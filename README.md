# Machine Learning Video Editing Toolkit

## Installing

Clone the repo, then:

```bash
yarn
```

This will install all dependencies required by electron needed to run the app.

Then go into `mlvet/src/py_server` and run

```bash
pip install -r requirements.txt
```

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
