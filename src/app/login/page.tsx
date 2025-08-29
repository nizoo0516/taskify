"use client";

import { useState } from "react";

import { login } from "@/features/auth/api";

export default function LoginPage() {
  const [email, setEmail] = useState("example@email.com");
  const [password, setPassword] = useState("12345678");

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      console.log("로그인 성공:", res.accessToken);
      alert("로그인 성공!");
    } catch (err) {
      console.error("로그인 실패:", err);
    }
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}
