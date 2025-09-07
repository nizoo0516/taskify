"use client";

import { useEffect, useState } from "react";

import { isLoggedIn } from "@/features/auth/actions";

export function useAuthGuard() {
  const loggedIn = async () => await isLoggedIn();
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return { loggedIn, hydrated };
}
