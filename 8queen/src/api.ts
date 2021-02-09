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

/**
 * Wraps fetch function with correct
 * - Http headers
 * - Setup cors
 * - Throw `ServerError` when communication with server fails
 * - Logs and groups errors in the console
 */
function localFetch(payload: object) {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  headers.append('Access-Control-Allow-Origin', '*');
  if (process.env.REACT_APP_API_KEY) {
    headers.append('Authorization', 'ApiKey ' + process.env.REACT_APP_API_KEY);
  }

  const init = {
    method: 'POST',
    headers,
    mode: 'cors' as RequestMode,
    cache: 'default' as RequestCache,
    body: JSON.stringify(payload),
  };

  const request = new Request(
    process.env.REACT_APP_API_URL +
      '/configurator/v1/configure' +
      '?packagePath=' +
      process.env.REACT_APP_PACKAGE_PATH,
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
}

const baseRequest = {
  currency: 'EUR',
  language: 'system',
  date: new Date(),
  line: {
    id: 'ROOT',
    quantity: { value: 1, unit: 'EA' },
    productId: '8QUEEN',
  },
};

const baseAssignments = [
  {
    variableId: 'DIM_BUILDDATE',
    value: '2022-01-01T10:00:00.000Z',
  },
];

export async function assign(assignments) {
  const request = {
    ...baseRequest,
    line: {
      ...baseRequest.line,
      variableAssignments: [...baseAssignments, ...(assignments || [])],
    },
  };
  return await localFetch(request);
}
