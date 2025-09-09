import { getMe, updateMe } from "./api";
import { DEFAULT_PROFILE_URL } from "./constants";
// zustand 파일
// import { useAuthStore } from "../auth/store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

// 프로필 기본 이미지 적용 함수
export async function baseProfile(): Promise<boolean> {
  // 내 프로필 조회
  const me = await getMe();
  // 프로필 이미지 있으면 리턴
  if (me.profileImageUrl) return false;

  // zustand 삭제
  // const token =
  //   useAuthStore.getState().accessToken ??
  //   (typeof window !== "undefined" ? localStorage.getItem("accessToken") : null);
  // if (!token) throw new Error("토큰 없음: 회원가입 후 다시 시도하세요.");

  // 쿠키가져오기
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!token) throw new Error("토큰 없음: 회원가입 후 다시 시도하세요.");

  // 기본 이미지 가져와서 File 만들기, 최신 버전 보장 위해 no-store로 캐시 무시
  const res = await fetch(DEFAULT_PROFILE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("기본 이미지 파일을 찾을 수 없습니다.");
  // file 객체로 다루기 위해 blob 객체로 변환
  const blob = await res.blob();
  if (!/image\/(png|jpeg)/.test(blob.type)) {
    throw new Error(`기본 이미지는 PNG/JPG 형식입니다. 현재 타입 : $ {blob.type}`);
  }
  const ext = blob.type === "image/png" ? "png" : "jpg";
  // blob을 File 객체로 생성
  const file = new File([blob], `img-profile.${ext}`, { type: blob.type });

  const field = new FormData();
  field.append("image", file);

  const upload = await fetch(`${API_BASE}/users/me/image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: field,
  });

  const txt = await upload.text().catch(() => "");
  if (!upload.ok) throw new Error(txt || `업로드 실패 : ${upload.status}`);

  let url: string | undefined;
  try {
    const json = JSON.parse(txt);
    url = json?.profileImageUrl ?? json?.imageUrl ?? json?.url;
  } catch {
    console.warn("upload parse fail", txt);
  }
  if (url) {
    await updateMe({ profileImageUrl: url, nickname: me.nickname });
  }

  // 확실한 캐시 우회
  const me2 = await fetch(`${API_BASE}/users/me?t=${Date.now()}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  }).then((r) => r.json());

  return !!me2.profileImageUrl;
}
