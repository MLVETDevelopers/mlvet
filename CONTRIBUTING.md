## Code of Conduct

This project and everyone participating in it is governed by the [MLVET Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Bug Reporting :bug:

One of the most important things you can do is report bugs. Please reference [how to report a bug](http://polite.technology/reportabug.html) and follow the issue templates when adding new bugs.

## Structure of the mlvet repository

```
mlvet
├── assets
│   ├── fonts                     holds fonts to be used in the project
│   ├── icons                     holds app icons
├── mocks                         holds file with mock runtime object for testing
├── release
│   ├── app                       holds files necessary for building
│   └── build                     packaged app will be stored here after running `yarn package`
│
├── src
│   ├── collabServer              holds files necessary to run the collab server (collaborative editing)
│   ├── collabTypes               holds types for collab types
│   ├── expressServer             holds files for express server (server responsible for streaming video to the frontend)
│   ├── main                      holds files for the electron backend
│   ├── renderer                  holds files for the react frontend
│   ├── transcriptProcessing      holds files used by both the frontend and backend for transcription processing
│   └── vosk                      holds files used by both the frontend and backend for local transcription (vosk)
└── tools                         holds files for code gen
```

## Development

To get your development environment set up

1. Install the following dependencies: `node 16`, `yarn`

2. Clone the repository and cd into the directory

   ```bash
   repos> git clone https://github.com/MLVETDevelopers/mlvet.git
   repos> cd mlvet
   ```

3. Install node dependencies

   ```bash
   mlvet> yarn
   mlvet> cd src/collabServer/
   m/s/collabServer/> yarn
   m/s/collabServer/> cd ../../release/app
   m/r/app/> yarn
   ```

4. Running the tests

   ```bash
   mlvet> yarn test
   ```

5. Start the app in the `dev` environment
   ```bash
   yarn start
   ```

## Deployment (Releasing the app)

1. Create a PR into `develop` with the version in `package.json` incremented - [Follow Semantic Versioning](https://semver.org/)
1. Create a new branch off `develop` (eg. `sync-dev-with-uat`) and pull in `uat`
1. Open a PR to merge `sync-dev-with-uat` into `develop`
1. Get the PR approved and merge into `develop`
1. Open a PR to merge `develop` into `uat`
1. Get the PR approved and merge into `develop`
1. The GitHub actions will create a new release
1. Open the release and edit it, add release notes and remove the macOS ARM dmgs

## Public website

[mlvet.app](https://www.mlvet.app/) is managed in a [separate repo](https://github.com/rileykeane/mlvet-landing-page).

## Contributors

Thank you to all the people who have already contributed to MLVET!

<a href="https://github.com/MLVETDevelopers/mlvet/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=MLVETDevelopers/mlvet" />
</a>