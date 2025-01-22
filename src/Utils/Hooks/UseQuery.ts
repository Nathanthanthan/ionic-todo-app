import { useEffect, useState } from "react";

type QueryParams<Args extends any[], T> = {
  query: (...args: Args) => Promise<T>;
  args: Args;
  enabled?: boolean;
};

export default function useQuery<Args extends any[], T>(queryParams: QueryParams<Args, T>) {
  const { query, args } = queryParams;
  const enabled = queryParams.enabled !== false;

  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);

  async function runQuery() {
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
