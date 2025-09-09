import { redirect } from "next/navigation";

import Home from "@/components/home/Home";
import { isLoggedIn } from "@/features/auth/actions";

export default async function Page() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    redirect("/mydashboard");
  }

  return <Home />;
}
