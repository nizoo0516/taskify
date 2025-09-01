const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

function formatDueDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export async function createTestDataWithExistingUser() {
  // 1) 로그인
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "example@email.com",
      password: "12345678",
    }),
  });
  if (!loginRes.ok) {
    const err = await loginRes.json().catch(() => ({}));
    throw new Error(err.message || "로그인 실패");
  }
  const { accessToken, user } = await loginRes.json();

  const jsonAuthHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  // 2) 대시보드
  const dashboardRes = await fetch(`${BASE_URL}/dashboards`, {
    method: "POST",
    headers: jsonAuthHeader,
    body: JSON.stringify({ title: "테스트 대시보드", color: "#4276EC" }),
  });
  if (!dashboardRes.ok) throw new Error("대시보드 생성 실패");
  const dashboard = await dashboardRes.json();

  // 3) 컬럼
  const columnRes = await fetch(`${BASE_URL}/columns`, {
    method: "POST",
    headers: jsonAuthHeader,
    body: JSON.stringify({ title: "To Do", dashboardId: dashboard.id }),
  });
  if (!columnRes.ok) throw new Error("컬럼 생성 실패");
  const column = await columnRes.json();

  // 3.5) 카드 이미지 업로드 (multipart/form-data)
  // 주의: multipart는 Content-Type을 직접 설정하지 않습니다!
  const imgBlob = await fetch("https://picsum.photos/seed/taskify/640/360.jpg").then((r) =>
    r.blob(),
  );
  const form = new FormData();
  form.append("image", imgBlob, "demo.jpg");

  const uploadRes = await fetch(`${BASE_URL}/columns/${column.id}/card-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`, // ← 여기만 헤더 설정
    },
    body: form,
  });
  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    console.error("이미지 업로드 실패:", err);
    throw new Error(err.message || "이미지 업로드 실패");
  }
  const { imageUrl } = await uploadRes.json();

  // 4) 카드 생성 (업로드에서 받은 imageUrl 사용)
  const cardRes = await fetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers: jsonAuthHeader,
    body: JSON.stringify({
      assigneeUserId: user.id,
      dashboardId: dashboard.id,
      columnId: column.id,
      title: "테스트 카드",
      description: "이건 기존 계정으로 자동 생성한 카드입니다.",
      dueDate: formatDueDate(new Date()),
      tags: ["frontend", "test"],
      imageUrl, // ✅ 업로드된 URL
    }),
  });
  if (!cardRes.ok) {
    const err = await cardRes.json().catch(() => ({}));
    console.error("카드 생성 실패:", err);
    throw new Error(err.message || "카드 생성 실패");
  }
  const card = await cardRes.json();

  console.log("✅ 테스트 데이터 생성 완료", { dashboard, column, card });
}
