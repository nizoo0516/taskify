"use client";

import { useState } from "react";

import { login, logout } from "@/features/auth/actions";

export default function TestLogin() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 초기값 서버에서 받은 걸로 설정

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login({ email: "example@email.com", password: "12345678" });
      setIsLoggedIn(true); // 로그인 성공 시 업데이트
      alert("로그인 성공!");
    } catch (err) {
      console.error(err);
      alert("로그인 실패!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false); // 로그아웃 시 업데이트
    alert("로그아웃 완료!");
  };

  return (
    <button
      onClick={isLoggedIn ? handleLogout : handleLogin}
      disabled={loading}
      className="bg-brand-blue-500 hover:bg-brand-blue-600 m-4 rounded px-4 py-2 text-white disabled:opacity-50"
    >
      {loading ? "처리 중..." : isLoggedIn ? "로그아웃" : "로그인"}
    </button>
  );
}
