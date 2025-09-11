// 사용할 색상 팔레트 (배경색 + 글자색)
const colorVariants = [
  { bg: "bg-[#F9EEE3]", text: "text-[#D58D49]" },
  { bg: "bg-[#E9F3E1]", text: "text-[#5A8F2F]" },
  { bg: "bg-[#DBE6F7]", text: "text-[#4981D5]" },
  { bg: "bg-[#F7DBF0]", text: "text-[#D549B6]" },
];

// label(string)을 받아 항상 같은 색상을 돌려주는 함수
export function getColorForTag(label: string) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colorVariants.length);
  return colorVariants[index];
}
