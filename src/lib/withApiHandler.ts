export async function withApiHandler<T>(fn: () => Promise<T>) {
  try {
    const res = await fn();
    return res;
  } catch (err) {
    console.error("API 실패:", err);
    throw err;
  }
}
