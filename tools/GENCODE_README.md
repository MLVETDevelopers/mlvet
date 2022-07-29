# How to use gencode

For most purposes, just run `yarn gen` when you create, edit or delete an IPC handler. This will do the following:

- Register the handler to be listened on IPC in `main/ipc.ts`
- Expose the handler to the front end in `main/preload.js`
- Register the handler types in the front end in `renderer/global.d.ts`.

If you see comments saying 'START GENERATED CODE' or similar, that's where the generated code is being injected. You can edit the rest of the file if you like / if you need to, but the things between the START and END tags will be replaced each time gencode is run. Definitely don't edit them manually, it's a waste of time and will be overwritten (plus, the edits you probably want to make are exactly what gencode is there for).

## More subtle stuff

The use of gencode requires that handlers be formatted in a particular way. Notably:

- They must have a separately declared type, in the same file, with the same name as the handler:

e.g.

```
type ShowImportMediaDialog = (ipcContext: IpcContext) => Promise<string | null>;
```

- They must be declared as a const, not a function:

e.g.

```
const showImportMediaDialog: ShowImportMediaDialog = async (ipcContext) => {
  ...
```

They must be the default export:

```
export default showImportMediaDialog;
```

And finally, don't do anything fancy with the function parameters - e.g. destructuring, default arguments, etc. You can do all that in the function body. The reason for this is because gencode reads the function parameters to learn what arguments the handler needs so that it can pass them in in `ipc.ts` and in `preload.js`.
