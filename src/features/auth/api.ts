import type { NewPasswordRequest, ChangePasswordResponse } from "@/features/auth/types";
import { apiRequest } from "@/lib/apiRequest";

// 비밀번호 변경
export const changePassword = (data: NewPasswordRequest) =>
  apiRequest<ChangePasswordResponse>("/auth/password", {
    method: "PUT",
    data,
  });
