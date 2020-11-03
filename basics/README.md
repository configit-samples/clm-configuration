# Basic sample application

This sample application demonstrates how to use Ace Platform's Configuration API.

## Getting started

Before running the application for the first time, change the settings in the
`.env` file to match your Ace Platform installation:

- `REACT_APP_API_URL` — Replace `localhost:9000` with your Ace Platform host
  and port.
- `REACT_APP_PACKAGE_PATH` — Reference the published package you want to use.
- `REACT_APP_API_KEY` — Add your API key if necessary. See 
  [Authentication](../README.md#authentication) for details.


Next, install the code dependencies:

```
npm install
```

Then start the application:

```
npm start
```

## Structure

The project has the following structure:

```
├── docs                    # documentation (Start here)
├── public                  # index.html and assets
└── src
    ├── api                 # helpers for calling the HTTP API
    ├── components          # general React components
    └── pages
        ├── configurator    # example using the /configure endpoint
        ├── pricing         # example using the /price endpoint
        └── product-search  # example using the /products endpoint

```

This project is created with [Create React App](https://facebook.github.io/create-react-app/).
The React documentation has a lot valuable information about topics like
_Adding styles and assets_, _Deployment_, _Editor Setup_, and so on.

## Making it your own

The intention of this sample is to act as a starting point for building your own
configurator. To learn more, continue by reading the:

- [Product search sample](docs/PRODUCT_SEARCH.md) documentation
- [Configurator sample](docs/CONFIGURATOR.md) documentation
- [Price sample](docs/PRICE.md) documentation
