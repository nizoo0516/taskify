const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api/proxy"
    : "https://yourdomain.com/api/proxy";

interface FetchOptions extends Omit<RequestInit, "body"> {
  isFormData?: boolean;
  data?: unknown;
}

export async function apiRequest<Response>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { isFormData, headers, data, ...rest } = options;

  const fetchOptions: RequestInit = {
    ...rest,
    credentials: "include",
    headers: {
      ...(headers as Record<string, string>),
    },
  };

  // JSON 데이터 처리
  if (!isFormData && data !== undefined) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      "Content-Type": "application/json",
    };
    fetchOptions.body = JSON.stringify(data);
  } else if (isFormData) {
    fetchOptions.body = data as FormData;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
  console.log("요청 URL:", `${BASE_URL}${endpoint}`);

  // 인증 오류 > 로그아웃
  if (response.status === 401) {
    throw new Error("인증 실패: 다시 로그인하세요");
  }

  // 비밀번호변경 성공시
  if (response.status === 204) return undefined as Response;

  // 카드 생성
  if (response.status === 201) return response.json() as Promise<Response>;

  // 에러
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.log("apiRequest 요청 URL:", `${BASE_URL}${endpoint}`);
    console.log("fetch options:", fetchOptions);
    throw new Error(error?.message || "API 요청 실패");
  }

  return response.json();
}
