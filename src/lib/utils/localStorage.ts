export const saveAcceptedAt = (id: number, time: string) => {
  const stored = JSON.parse(localStorage.getItem("acceptedMap") || "{}");
  stored[id] = time;
  localStorage.setItem("acceptedMap", JSON.stringify(stored));
};

export const loadAcceptedMap = () => {
  return JSON.parse(localStorage.getItem("acceptedMap") || "{}") as Record<number, string>;
};
