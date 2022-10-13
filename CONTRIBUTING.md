## Bug Reporting :bug:

One of the most important things you can do is report bugs. Please reference [how to report a bug](http://polite.technology/reportabug.html) and follow the issue templates when adding new bugs.

## Development

## Structure of the mlvet repository

```
mlvet
│   filename
│   filename
│   filename
│   filename
│   filename
│   filename
│   filename
│   filename
│
└───dirname
    │
    ├───dirname
    │   filename
    │
    └───dirname
        filename
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
