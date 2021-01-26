import queryString from 'query-string';

class ServerError extends Error {
  type: string;

  constructor(type: string, ...args: string[]) {
    super(...args);

    this.type = type;

    Error.captureStackTrace && Error.captureStackTrace(this, ServerError);
  }
}

/**
 * Wraps fetch function and setup
 *
 * - Http headers
 * - Setup cors
 */
export default async function callFetch(
  url: string,
  method: string,
  payload: { [key: string]: any }
) {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  if (process.env.REACT_APP_API_KEY) {
    headers.append('Authorization', 'ApiKey ' + process.env.REACT_APP_API_KEY);
  }

  const { packagePath, ...otherPayload } = payload;
  const init: RequestInit = {
    method,
    headers,
    mode: 'cors',
    cache: 'default',
    body: method !== 'GET' ? JSON.stringify(otherPayload) : undefined,
  };

  const query =
    method === 'GET'
      ? queryString.stringify(payload)
      : queryString.stringify({ packagePath });

  const request = new Request(
    process.env.REACT_APP_API_URL + url + '?' + query,
    init
  );

  try {
    const response = await fetch(request);
    if (!response.ok) {
      return response.json().then((err) => {
        throw new ServerError(
          err.type ? err.type : 'UNKNOWN_ERR',
          err.message ? err.message : 'Unknown error'
        );
      });
    }
    return await response.json();
  } catch (err_1) {
    console.error(`FETCH ERROR: [${err_1.type}] ${err_1.message}`);
    throw err_1;
  }
}
