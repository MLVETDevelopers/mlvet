![MLVET Banner](./assets/mlvet-banner.png)

<div align="center">
  <p>
    <a href="https://github.com/chloebrett/mlvet/actions/workflows/test.yml?query=branch%3Adevelop++Node.js+CI%22">
        <img src="https://img.shields.io/github/workflow/status/MLVETDevelopers/mlvet/Node.js%20CI"/>
    </a>
    <a href="https://github.com/chloebrett/mlvet/graphs/contributors">
        <img src="https://img.shields.io/github/contributors/MLVETDevelopers/mlvet" />
    </a>
    <a href="https://github.com/chloebrett/mlvet/releases">
        <img src="https://img.shields.io/github/v/release/MLVETDevelopers/mlvet"/>
    </a>
    <a href="https://github.com/chloebrett/mlvet/blob/develop/LICENSE">
        <img src="https://img.shields.io/github/license/MLVETDevelopers/mlvet"/>
    </a>
  </p>
</div>

![App demo GIF](./assets/app_demo.gif)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About the App](#about-the-app)
- [Official help guide](#official-help-guide)
- [Dependencies](#dependencies)
- [Installation (with pre-built binaries)](#installation-with-pre-built-binaries)
- [Manual Installing (from source)](#manual-installing-from-source)
- [Optional Development Installation](#optional-development-installation)
  - [Development Environment Setup](#development-environment-setup)
  - [Packaging for Production](#packaging-for-production)
  - [Testing](#testing)
  - [Generating IPC Handlers](#generating-ipc-handlers)
  - [Running the Collab server](#running-the-collab-server)
- [Contributors](#contributors)

## About the App

The Machine Learning Video Editing Toolkit (MLVET for short) is a desktop application which
allows users to edit their videos via a transcription of the video audio. This transcription
is produced with a machine learning model, and users are given the option to transcribe
both online (with AssemblyAI) and offline (with VOSK).

## Official help guide

For offical 'how-to' documentation visit [MLVET Docs](https://www.mlvet.app/docs)

To learn the codebase visit [MLVET codebase walkthrough](https://www.youtube.com/watch?v=rSpGJfZOhig)

## Dependencies

Supported Hardware - Windows - Mac (Intel) - Mac (ARM) - Linux

Node v16: download from https://nodejs.org/en/

Yarn package manager - run the following from your command line

```
npm install -g yarn
```

This will install yarn globally. Then you can install project-specific dependencies as follows

## Installation (with pre-built binaries)

There are multiple ways of downloading the MLVET app.

1. Through out website https://www.mlvet.app/download
2. Through the [github releases tab](https://github.com/chloebrett/mlvet/releases)

## Manual Installing (from source)

1. Dependencies: Node, yarn

2. Clone the repository and cd into the directory

   ```bash
   git clone https://github.com/MLVETDevelopers/mlvet.git
   cd mlvet
   ```

3. Package mlvet

   ```bash
   yarn package
   ```

4. Setup mlvet

   ```bash
   cd ./release/build
   ```

5. Execute `MLVET Setup` file

You should now see MLVET in your file system.

## Optional Development Installation

### Development Environment Setup

1. Dependencies: Node, yarn

2. Clone the repository and cd into the directory

   ```bash
   git clone https://github.com/MLVETDevelopers/mlvet.git
   cd mlvet
   ```

3. Install node dependencies

   ```bash
   yarn
   ```

4. Start the app in the `dev` environment
   ```bash
   yarn start
   ```

This will install all dependencies required by electron needed to run the app.

To make development easier, it's recommended to use VSCode, and install the following extensions:

- ESLint https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- Prettier https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

These will be automatically configured for the project based on the .eslintrc and .prettierrc files in the root directory.

### Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

### Testing

if app has not already been built, run:

```bash
yarn build
```

To run unit tests:

```bash
yarn test
```

### Generating IPC Handlers

Refer to the [Code Generate](tools/GENCODE_README.md) documentation and [IPC Handlers](src/main/handlers/HANDLERS_README.md) documentation

### Running the Collab server

Refer to the [Collab Server](src/collabServer/README.md) documentation

## Contributors

This project exists thanks to all the people who contribute. If you are interested in helping, check out the [Contributing Guide](CONTRIBUTING.md).

<a href="https://github.com/MLVETDevelopers/mlvet/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=MLVETDevelopers/mlvet" />
</a>
