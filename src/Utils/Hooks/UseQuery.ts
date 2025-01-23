import { useEffect, useState } from "react";

type QueryParams<Args extends unknown[], T> = {
  query: ((...args: Args) => Promise<T>) | (() => Promise<T>) | undefined;
  args: Args;
  enabled?: boolean;
};

export default function useQuery<Args extends unknown[], T>(queryParams: QueryParams<Args, T>) {
  const { query, args } = queryParams;
  const enabled = queryParams.enabled !== false;

  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);

  async function runQuery() {
    if (query === undefined) return;

    setLoading(true);

    const res = await query(...args);
    setData(res);

    setLoading(false);
  }

  useEffect(() => {
    if (enabled) runQuery();
  }, [enabled, ...args, query]);

  return { data, loading, reRunQuery: runQuery };
}
