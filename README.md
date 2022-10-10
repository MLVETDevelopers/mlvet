<div align="center">
  <h1><strong>MLVET</strong></h1>
  <p>
    <strong>Machine Learning Video Editing Toolkit</strong>
  </p>
  <p>
    <a href="https://github.com/chloebrett/mlvet/actions/workflows/test.yml?query=branch%3Adevelop++Node.js+CI%22">
        <img src="https://img.shields.io/github/workflow/status/chloebrett/mlvet/Node.js%20CI/develop?label=build%20status"/>
    </a>
    <a href="https://github.com/chloebrett/mlvet/graphs/contributors">
        <img src="https://img.shields.io/github/contributors/chloebrett/mlvet" />
    </a>
    <a href="https://github.com/chloebrett/mlvet/releases">
        <img src="https://img.shields.io/github/v/release/chloebrett/mlvet"/>
    </a>
    <a href="https://github.com/chloebrett/mlvet/blob/develop/LICENSE">
        <img src="https://img.shields.io/github/license/chloebrett/mlvet"/>
    </a>
  </p>
</div>

## About the App

The Machine Learning Video Editing Toolkit (MLVET for short) is a desktop application which
allows users to edit their videos via a transcription of the video audio. This transcription
is produced with a machine learning model, and users are given the option to transcribe
both online (with AssemblyAI) and offline (with VOSK).

## Official help guide

For offical 'how-to' documentation visit https://www.mlvet.app/docs

## Installation

There are multiple ways of downloading the MLVET app.

1. Through out website https://www.mlvet.app/
2. Through the [github releases tab](https://github.com/chloebrett/mlvet/releases)

## Dependencies

Supported Hardware - Windows - Mac (Intel) - Mac (ARM) - Linux

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

## Testing

if app has not already been built, run:

```bash
yarn build
```

To run unit tests:

```bash
yarn test
```

## Generating IPC Handlers

Refer to the documents `tools/GENCODE_README.md` and `src/main/handlers/HANDLERS_README.md`

## Running the Collab server

Refer to the documentation in `src/collabServer/README.md`
