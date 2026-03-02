const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiClient<T>(
  endpoint: string,
  { params, ...options }: RequestOptions = {}
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL 환경변수가 설정되지 않았습니다.");
  }

  let url = `${BASE_URL}${endpoint}`;

  // query string 자동 생성
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    headers: isFormData
      ? options.headers
      : {
          "Content-Type": "application/json",
          ...options.headers,
        },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API 요청 실패");
  }

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null as T;
}