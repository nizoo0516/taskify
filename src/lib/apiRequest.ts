import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";

interface FetchOptions extends Omit<RequestInit, "body"> {
  withAuth?: boolean; // 인증을 필요로 할 때
  isFormData?: boolean; // FormData일 때
  data?: unknown;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiRequest<Response>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { withAuth, isFormData, headers, data, ...rest } = options;

  // 토큰
  let token: string | null = null;

  if (withAuth) {
    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const cookieStore = cookies() as unknown as ResponseCookies;
      token = cookieStore.get("accessToken")?.value ?? null;
    } else {
      token = localStorage.getItem("accessToken");
    }

    if (!token) throw new Error("토큰 없음: 다시 로그인하세요.");
  }

  const authHeader: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  // fetch
  const fetchOptions: RequestInit = {
    ...rest,
    headers: {
      ...authHeader,
      ...(headers as Record<string, string>),
    } as HeadersInit,
  };

  // json 데이터일때
  if (!isFormData) {
    if (data !== undefined) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        "Content-Type": "application/json",
      };
      fetchOptions.body = JSON.stringify(data);
    }
  } else {
    // FormData일때
    fetchOptions.body = data as FormData;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

  // 인증 오류 > 로그아웃
  if (response.status === 401) {
    if (typeof window === "undefined") {
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = cookies() as unknown as ResponseCookies;
        cookieStore.delete("accessToken");
      } catch {
        /* noop */
      }
    }

    throw new Error("인증 실패: 다시 로그인하세요");
  }

  // 비밀번호변경 성공시
  if (response.status === 204) return undefined as Response;

  // 카드 생성
  if (response.status === 201) return response.json() as Promise<Response>;

  // 에러
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    // 오류 확인용
    // console.log("API 호출:", `${BASE_URL}${endpoint}`);
    throw new Error(error?.message || "API 요청 실패");
  }

  return response.json();
}
