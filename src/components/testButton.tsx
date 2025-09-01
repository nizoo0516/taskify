"use client";
import { createTestDataWithExistingUser } from "@/lib/testData";

export default function TestDataButton() {
  const handleClick = async () => {
    try {
      await createTestDataWithExistingUser();
      alert("테스트 데이터 생성 완료!");
    } catch (err) {
      console.error(err);
      alert("테스트 데이터 생성 실패!");
    }
  };

  return <button onClick={handleClick}>테스트 데이터 자동 생성</button>;
}
