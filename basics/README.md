# Basic sample application

This sample application demonstrates how to use Ace Platform's Configuration API.

It includes several parts:

- [Product search](docs/PRODUCT_SEARCH.md)
- [Configurator](docs/CONFIGURATOR.md)
- [Price](docs/PRICE.md)

## Getting started

Before running the application for the first time, change the settings in the `.env` file to match your local setup of the Ace Platform:

- Change the `REACT_APP_API_URL` to the URL of your running configurator service.
- Change the `REACT_APP_PACKAGE_PATH` to reference the published package you want to use.

For example:

```
REACT_APP_API_URL=https://daily.clm-dev.cloud
REACT_APP_PACKAGE_PATH=ace-samples/sample-models
REACT_APP_API_KEY=MKUNki012....
```

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
        ├── configurator    # example configurator using the /configure endpoint
        └── product-search  # example using the /products endpoint

```

This project is created with [Create React App](https://facebook.github.io/create-react-app/). The React documentation has a lot valuable information about topics like _Adding styles and assets_, _Deployment_, _Editor Setup_, and so on.

## Making it your own

The intention of this sample is to act as a starting point for building your own configurator. To learn more, continue by reading the

- [Product search sample](docs/PRODUCT_SEARCH.md) documentation
- [Configurator sample](docs/CONFIGURATOR.md) documentation
- [Price sample](docs/PRICE.md) documentation
