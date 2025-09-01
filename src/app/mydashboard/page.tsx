"use client"; 

import MyButton from "@/components/layout/Button";

export default function MyDashboard() {
  return (
    <div>
      <MyButton className="py-2.5 px-5 me-2 mb-2 text-[#787486]" onClick={() => alert("대시보드 생성!")}>111</MyButton>
      <MyButton className="py-2.5 px-5 me-2 mb-2 text-[#FFF]" color="buttonBlue" onClick={() => alert("대시보드 생성!")}>222</MyButton>
      <MyButton className="py-2.5 px-5 me-2 mb-2 text-[#FFF]" color="buttonGrey" onClick={() => alert("대시보드 생성!")}>333</MyButton>
    </div>
  );
}