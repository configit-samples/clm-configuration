import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string';

export function useURLState<T>(
  name: string,
  initialValue: T,
  decoder: (value: string | string[] | null) => T
): [T, (v: T) => void] {
  const location = useLocation();
  const history = useHistory();
  const queryValue = queryString.parse(location.search)[name];

  // Set the initial value
  const [value, setValue] = useState<T>(
    queryValue !== undefined ? decoder(queryValue) : initialValue
  );

  // Update the url search param on state update
  useEffect(() => {
    const params: { [key: string]: any } =
      queryString.parse(location.search) || {};
    params[name] = value;

    history.push({
      ...location,
      search: `?${queryString.stringify(params)}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
}
