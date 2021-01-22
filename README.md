> :point_up: The examples in the master branch are for the coming release (2.1.0) of Ace Platform. Checkout the [ace-platform-1.1 branch](https://github.com/configit-samples/ace-configuration-api-samples/tree/ace-platform-1.1) for v1.1 samples.

# Configuration API Samples for Ace Platform

This repository contains sample applications that show how to use Ace Platform's Configuration API.

There are two samples:

- **[Basic](basics/README.md)** — A basic application that demonstrates each of the Configuration API endpoints.

- **[iHear](ihear/README.md)** — A larger application that mimics a webshop selling hearing aids.

## Prerequisites

Before running the samples, you need to have:

- [Node.js](https://nodejs.org/en/) installed.
- An installation of **Ace Platform** running.
- The iHear package published to Ace Platform. For instructions, see "Publishing the sample package" in the Ace Platform Installation guide.

To follow along with the samples, you need to be familiar with:

- Building web apps with [React](https://reactjs.org/).
- The basic concepts in Ace Platform such as `sections`, `variables`, `values`, and `assignments`. Refer to the Ace Platform documentation for details.

For the `iHear` sample you also need a minimal understanding of [TypeScript](https://www.typescriptlang.org/).

## Authenticated APIs

The samples assume that the Ace Platform APIs do not have authentication enabled. The Ace Platform APIs support the following authentication schemes:

- JWT bearer token
- API Key
- HTTP basic authentication

To use the sample code with an authenticated API, you need to modify the `/basics/src/api/fetch.js` and `ihear/src/api/fetch.ts` files to send the right authentication information to the API. What you need to send depends on which scheme is enabled on the API. For example, to send an API Key in the basic example add the key to the HTTP headers like so:

```javascript
export default (url, method, payload) => {
  const headers = new Headers();
  // Adds API key to HTTP headers
  headers.append('Authorization', 'ApiKey DAxYmZiNDY1....' );
  //  Rest of function left out for brevity
```

You can read more about the authentication schemes and their required HTTP headers in the Ace Platform documentation.
