import { useState, useEffect, useCallback } from "react";

import { api, ApiError } from "@/lib/api";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useFetch<T>(path: string): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get<T>(path)
      .then((result) => setData(result))
      .catch((e: unknown) => {
        setError(e instanceof ApiError ? e.message : "Error de conexión");
      })
      .finally(() => setLoading(false));
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
