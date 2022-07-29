All files in this folder (including files in subfolders) will cause various auto-generated code to be created when `yarn gen` is run.

Files in the `helpers` subfolder are excluded - any shared logic that the handlers use can be put in here as they won't invoke autogeneration.

Content of the handler files must comply with a specific format - see GENCODE_README.md.
