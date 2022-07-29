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

Then go into `src/pyServer` and run

```bash
pip install -r requirements.txt
```

This will install all dependencies required to run the python server.

For Deepspeech transcription to work, you will need to also add the pre-trained model and scorer to `src/pyServer`

```bash
curl -LO https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.pbmm
curl -LO https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/deepspeech-0.9.3-models.scorer
```

If you encounter an import error `ImportError: DLL load failed: The specified module could not be found.` when trying to use Deepspeech, you may need to move the `libdeepspeech.so` file from
`Lib/site-packages/deepspeech/lib/libdeepspeech.so` to
`Lib/site-packages/deepspeech/libdeepspeech.so` (in your virtual environment).

## Additional steps you need to follow

After the [audio extract PR](https://github.com/chloebrett/mlvet/pull/12) got merged you will now need to have a `demo-vdieo.mp4` video file under `assets/videos`

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
