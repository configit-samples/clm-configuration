/**
 * Encapsulate errors from ASP.NET in this guy
 */
class ServerError extends Error {
  serverError: string;

  constructor(message: string, serverError: string) {
    super(message);
    this.serverError = serverError;
  }
}

const toQueryString = (obj: any) => {
  return (
    '?' +
    Object.keys(obj)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
      .join('&')
  );
};

/**
 * Wraps fetch function with correct
 * - Http headers
 * - Setup cors
 * - Throw `ServerError` when communication with server fails
 * - Logs and groups errors in the console
 */
export default (url: string, method: string, payload: object) => {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  // headers.append('Authorization', 'ApiKey ' + process.env.REACT_APP_API_KEY);

  const init = {
    method,
    headers,
    mode: 'cors' as RequestMode,
    cache: 'default' as RequestCache,
    body: method !== 'GET' ? JSON.stringify(payload) : undefined,
  };

  const query = method === 'GET' ? toQueryString(payload) : '';
  const request = new Request(
    process.env.REACT_APP_API_URL + url + query,
    init
  );

  return fetch(request)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((serverError) => {
          throw new ServerError(response.statusText, serverError);
        });
      }

      return response.json();
    })
    .catch((err) => {
      let serverError = err.serverError;
      if (serverError) {
        if (console.groupCollapsed) {
          console.groupCollapsed('SERVER ERROR [' + serverError.message + ']');
          if (serverError.stackTrace) {
            console.error(serverError.stackTrace);
          }
          console.groupEnd();
        }
        throw new Error(serverError.message);
      } else {
        console.error('FETCH ERROR: [' + err.message + ']');
        throw new Error('Something went wrong, try again later');
      }
    });
};
