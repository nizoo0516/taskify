import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("accessToken")?.value;

  if (token) {
    redirect("/mydashboard");
  }

  return <>{children}</>;
}
