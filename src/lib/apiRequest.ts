import { redirect } from "next/navigation";

import { useAuthStore } from "@/features/auth/store";

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
  const token = useAuthStore.getState().accessToken;
  const authHeader = withAuth && token ? { Authorization: `Bearer ${token}` } : {};

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

  // 인증 오류 > 로그아웃, 홈
  if (response.status === 401) {
    useAuthStore.getState().clearToken();
    redirect("/");
  }

  // 비밀번호변경 성공시
  if (response.status === 204) return undefined as Response;

  // 카드 생성
  if (response.status === 201) return response.json() as Promise<Response>;

  // 에러
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "API 요청 실패");
  }

  return response.json();
}
