import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("accessToken")?.value;

  if (!token) {
    notFound();
  }

  return <>{children}</>;
}
