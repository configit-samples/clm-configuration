import { useEffect, useState } from 'react';

type FetchType<T> = { loading: boolean; error?: string; data?: T };

export function useFetch<T>(
  f: () => Promise<T>,
  cacheKey?: string
): FetchType<T> {
  const [state, setState] = useState<FetchType<T>>({ loading: false });

  useEffect(() => {
    setState({ loading: true, data: state.data });

    async function fetch() {
      try {
        const data = await f();
        setState({ loading: false, data });
      } catch (e) {
        setState({ loading: false, error: e.message });
      }
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  return state;
}
