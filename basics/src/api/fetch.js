const toQueryString = (obj) => {
  return (
    '?' +
    Object.keys(obj)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
      .join('&')
  );
};

class ServerError extends Error {
  constructor(type, ...args) {
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
export default (url, method, payload) => {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  if (process.env.REACT_APP_API_KEY) {
    headers.append('Authorization', 'ApiKey ' + process.env.REACT_APP_API_KEY);
  }

  const { packagePath, ...otherPayload } = payload;
  const init = {
    method,
    headers,
    mode: 'cors',
    cache: 'default',
    body: method !== 'GET' ? JSON.stringify(otherPayload) : undefined,
  };

  const query =
    method === 'GET' ? toQueryString(payload) : toQueryString({ packagePath });
  const request = new Request(
    process.env.REACT_APP_API_URL + url + query,
    init
  );

  return fetch(request)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new ServerError(
            err.type ? err.type : 'UNKNOWN_ERR',
            err.message ? err.message : 'Unknown error'
          );
        });
      }
      return response.json();
    })
    .catch((err) => {
      console.error(`FETCH ERROR: [${err.type}] ${err.message}`);
      throw err;
    });
};
