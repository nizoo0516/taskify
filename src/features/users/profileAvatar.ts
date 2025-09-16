import { getMe, updateMe, uploadProfileImage } from "./api";

// 닉네임 첫 글자를 알파벳으로 변환해주는 함수
function getInitialLetter(nickname: string): string {
  const ch = (nickname ?? "").trim().charAt(0);
  if (!ch) return "?";
  if (/[A-Za-z]/.test(ch)) return ch.toUpperCase();
  const code = ch.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const CHO = Math.floor((code - 0xac00) / (21 * 28));
    const MAP = [
      "G",
      "G",
      "N",
      "D",
      "D",
      "R",
      "M",
      "B",
      "B",
      "S",
      "S",
      "E",
      "J",
      "J",
      "C",
      "K",
      "T",
      "P",
      "H",
    ];
    return (MAP[CHO] || "E").charAt(0);
  }
  return "?";
}

// 알파벳별 색상 추출
const LETTER_COLOR: Record<string, string> = {
  A: "#93C5FD",
  B: "#93C5AA",
  C: "#A5B4FC",
  D: "#FDBA74",
  E: "#F59EAE",
  F: "#86EFAC",
  G: "#60A5FA",
  H: "#FDE68A",
  I: "#C7D2FE",
  J: "#A7F3D0",
  K: "#FCA5A5",
  L: "#67E8F9",
  M: "#F5D0FE",
  N: "#FCD34D",
  O: "#93C5AA",
  P: "#BFDBFE",
  Q: "#FECACA",
  R: "#99F6E4",
  S: "#DDD6FE",
  T: "#FBBF24",
  U: "#86EFAC",
  V: "#93C5FD",
  W: "#FBCFE8",
  X: "#A7F3D0",
  Y: "#A5B4FC",
  Z: "#FDE68A",
};
const colorByLetter = (l: string) => LETTER_COLOR[l.toUpperCase()] ?? "#CBD5E1";

// 원형 배경 + 이니셜 그려서 PNG blob 생성
async function makeAvatarBlob(letter: string, color: string, size = 256): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${Math.floor(size * 0.5)}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, size / 2, size / 2);
  return await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/png", 0.92));
}

const flagKey = (userId: string | number) => `profileSeeded:${String(userId)}`;

export async function profileAvatar() {
  const me = await getMe(); // 내 정보 조회
  if (!me?.id) return;

  if (me.profileImageUrl) return;
  if (localStorage.getItem(flagKey(me.id))) return;

  const letter = getInitialLetter(me.nickname ?? "U");
  const color = colorByLetter(letter);
  const blob = await makeAvatarBlob(letter, color, 256);

  const fd = new FormData();
  fd.append("image", blob, "avatar.png");
  const res = await uploadProfileImage(fd); // POST /users/me/image 업로드, URL 획득
  if (res?.profileImageUrl) {
    await updateMe({
      nickname: me.nickname,
      profileImageUrl: res.profileImageUrl,
    });
    localStorage.setItem(flagKey(me.id), "1"); // PUT /users/me에 profileImageUrl 저장
  }
}
