"use client";

import { DependencyList, useEffect, useState } from "react";

export function useApiHandler<T>(
  apiFn: () => Promise<T>,
  deps: DependencyList = [],
  options?: { autoFetch?: boolean },
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFn();
      setData(res);
      return res;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (options?.autoFetch !== false) {
      fetchData().catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, loading, error, refetch: fetchData };
}
