"use server";

import { cookies } from "next/headers";

import type { LogRequest, LoginRequest } from "@/features/auth/types";
import { apiRequest } from "@/lib/apiRequest";

// 로그인
export const loginAction = async (data: LoginRequest): Promise<LogRequest> => {
  console.log("📌 loginAction 실행됨");
  const res = await apiRequest<LogRequest>("/auth/login", {
    method: "POST",
    data,
  });

  (await cookies()).set("accessToken", res.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
};

// 로그아웃
export async function logoutAction() {
  (await cookies()).delete("accessToken");
}

// 로그인 여부 체크
export async function isLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");
  return !!token;
}
