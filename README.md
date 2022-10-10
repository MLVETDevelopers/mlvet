# Machine Learning Video Editing Toolkit

## About the App 
The Machine Learning Video Editing Toolkit (MLVET for short) is a desktop application which 
allows users to edit their videos via a transcription of the video audio. This transcription 
is produced with a machine learning model, and users are given the option to transcribe
both online (with AssemblyAI) and offline (with VOSK). 

For more information and to install the app, visit the MLVET landing page
https://www.mlvet.app/

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

## Generating IPC Handlers

Refer to the documents `tools/GENCODE_README.md` and `src/main/handlers/HANDLERS_README.md`

## Additional steps you need to follow

After the [audio extract PR](https://github.com/chloebrett/mlvet/pull/12) got merged you will now need to have a `demo-video.mp4` video file under `assets/videos`

Note:

- You will have to create the `/video` subdirectory
- Do not push a .mp4 folder to the repo since it will not be read correctly between different OS's

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
