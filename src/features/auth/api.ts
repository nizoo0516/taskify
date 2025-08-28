import type {
  LoginRequest,
  LogRequest,
  NewPasswordRequest,
  ChangePasswordResponse,
} from "@/features/auth/types";
import { apiRequest } from "@/lib/apiRequest";

// 로그인
export const login = (data: LoginRequest) =>
  apiRequest<LogRequest>("/auth/login", {
    method: "POST",
    data,
  });

// 비밀번호 변경
export const changePassword = (data: NewPasswordRequest) =>
  apiRequest<ChangePasswordResponse>("/auth/password", {
    method: "PUT",
    data,
    withAuth: true, //토큰 필요
  });
