## Collab server

This is run on a separate server (e.g. AWS EC2 instance) and doesn't need to be included in the application package. It uses some shared types from the overall package so it's included here for convenience. It's not invoked by Electron at runtime, it's a separate process that needs to be started on its own. It also has its own package.json so it doesn't share modules with the rest of the repo.
