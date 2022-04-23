# Machine Learning Video Editing Toolkit

## Dependencies

Node v16: download from https://nodejs.org/en/

Yarn package manager - run the following from your command line

```
npm install -g yarn
```

This will install yarn globally. Then you can install project-specific dependencies as follows

## Installing

Clone the repo, then:

```bash
yarn
```

This will install all dependencies required by electron needed to run the app.

Then go into `src/py_server` and run

```bash
pip install -r requirements.txt
```

This will install all dependencies required to run the python server.

## Starting Development

Start the app in the `dev` environment:

```bash
yarn start
```

To make development easier, it's recommended to use VSCode, and install the following extensions:

- ESLint https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- Prettier https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

These will be automatically configured for the project based on the .eslintrc and .prettierrc files in the root directory.

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```
