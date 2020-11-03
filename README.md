# Configuration API Samples for Ace Platform

This repository contains sample applications that show how to use Ace Platform's
Configuration API.

There are two samples:

- **[Basic](basics/README.md)** — A basic application that demonstrates each of
  the Configuration API endpoints.

- **[iHear](ihear/README.md)** — A larger application that mimics a webshop
  selling hearing aids.

## Prerequisites

Before running the samples, you need to have:

- [Node.js](https://nodejs.org/en/) installed.
- An installation of **Ace Platform** running.
- The iHear package published to Ace Platform. For instructions, search for 
  "Publish the sample package" in the Ace Platform Installation guide.

To follow along with the samples, you need to be familiar with:

- Building web apps with [React](https://reactjs.org/).
- The basic concepts in Ace Platform such as `sections`, `variables`, `values`,
  and `assignments`. Refer to the "Configuration API overview" in the Ace 
  Platform docs for details.

For the `iHear` sample you also need a minimal understanding of 
[TypeScript](https://www.typescriptlang.org/).

## Authentication

By default, Ace Platform accepts API requests from `localhost` without need for
further authentication. If you are running the samples from a machine other than
`localhost`, or have disabled IP allowlisting in your Ace Platform installation,
then you will need to authenticate requests from the samples using an API key.

To do so:

1. Create an API key using the Ace Platform web UI. Give the key permissions to
   read packages.
1. Edit `basics/.env` and `ihear/.env`, replacing the value of the
   `REACT_APP_API_KEY` environment variable.
1. Edit `basic/src/api/fetch.js` and `ihear/src/api/fetch.ts`, uncommenting
   this line:

   ```javascript
   // headers.append('Authorization', 'ApiKey ' + process.env.REACT_APP_API_KEY);
   ```

## About the `next` branch

The `next` branch contains changes intended for the next (unreleased) version of 
Ace Platform.
