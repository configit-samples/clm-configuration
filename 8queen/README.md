# Eight Queen game

This application illustrates how you can use Configit's VT technology to solve the [8queen puzzle](https://en.wikipedia.org/wiki/Eight_queens_puzzle). In the 8queen puzzle, the goal is to place eight queens on the chessboard without any of the queens capturing each other. This demo application illustrates how Configit's configuration engine has full knowledge of all possible solutions left.

The application is built in React and requires access to an Ace Platform instance with a VT Package containing a compiled version of the Ace model from the in `model-export` folder.

## Getting started

Before you run the application, change the settings in the `.env` file to match your local setup of Ace Platform.

- Change the `REACT_APP_API_URL` to the URL of your Ace Platform installation.
- Change the `REACT_APP_PACKAGE_PATH` to reference the package you want to use. The demo can use any valid and published package containing a configurable product called iHear.
- Change the `API_KEY` to reference be a valid Ace Platform `API_KEY` that can read the packages.

Then install the code dependencies:

```
npm install
```

And start the application with:

```
npm start
```

## Deployment to vercel

After having logged in to Vercel run

```
vercel env pull
```

Then run

```
vercel
```

or

```
vercel --prod
```

Simulate the deployment environment locally with

```
vercel dev
```
