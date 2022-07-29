/* eslint-disable no-useless-escape */
import fs from 'fs/promises';
import { readdirSync, statSync } from 'fs';
import path from 'path';
import { pascalCase, paramCase } from 'change-case';

/**
 * Code generator, currently just used for auto linking IPC handlers to the IPC module and exposing them on the front end.
 * You probably won't have to modify this, so don't worry about it too much.
 */

// Representation of an IPC handler for gencode purposes
interface GencodeIpcHandler {
  fileName: string;
  filePath: string;
  handlerName: string;
  handlerType: string; // nothing fancy, just a stringified function type as expressed in the code, but with any 'ipcContext' requirements removed
  handlerArgs: string[]; // also nothing fancy, just an array of strings containing the (untyped) args to the handler
}

const BASE_DIRECTORY = path.join(__dirname, '../src');
const HANDLERS_DIRECTORY = path.join(BASE_DIRECTORY, './main/handlers');
const FOLDER_SKIPLIST = ['helpers'];

// Files that are written by gencode
const FILE_PATHS = {
  ipc: path.join(BASE_DIRECTORY, './main/ipc.ts'),
  preload: path.join(BASE_DIRECTORY, './main/preload.js'),
  global: path.join(BASE_DIRECTORY, './renderer/global.d.ts'),
};

/**
 * Read the arguments passed to a handler
 */
const extractHandlerArgs: (
  fileContentsNoNewline: string,
  index: number
) => string[] = (fileContentsNoNewline, index) => {
  const resultString = [];
  let isRecording = false;
  for (let curr = index; curr < fileContentsNoNewline.length; curr += 1) {
    // curr = index to skip first bracket
    const char = fileContentsNoNewline[curr];
    if (char === ')') {
      break;
    } else if (char === '(') {
      isRecording = true;
    } else if (isRecording) {
      resultString.push(char);
    }
  }

  return resultString
    .join('')
    .split(',')
    .map((str) => str.trim())
    .map((str) => (str.includes(':') ? str.slice(0, str.indexOf(':')) : str)); // remove types from arguments
};

/**
 * Extracts a type string from a type, modifying it slightly for our purposes
 * @param typeString string representation of the function type that may continue longer than the actual type
 * @returns another string representation, but with the 'ipcContext' bit removed if it's present, and the type truncated to its logical end
 */
const extractType: (typeString: string) => string = (typeString) => {
  // End the string at the first instance of a semicolon when not inside a bracket
  const openers = ['(', '[', '<', '{'];
  const closers = [')', ']', '>', '}'];

  let stackHeight = 0; // tracks if we're in a bracket
  let sliceIndex = 0; // where to end the slice
  while (sliceIndex < typeString.length) {
    const char = typeString[sliceIndex];
    if (stackHeight === 0 && char === ';') {
      break; // first semicolon outside of a bracket ends the search
    }
    if (openers.includes(char)) {
      stackHeight += 1;
    } else if (
      closers.includes(char) &&
      !(sliceIndex > 0 && char === '>' && typeString[sliceIndex - 1] === '=') // arrows "=>" don't count as ending a bracket
    ) {
      stackHeight -= 1;
    }
    sliceIndex += 1;
  }

  return typeString
    .slice(0, sliceIndex)
    .replace(/ipcContext: IpcContext(?:, )?/, '');
};

const recursivelyReadDirectory: (dir: string) => string[] = (dir) => {
  const contents = readdirSync(dir);

  let fileNames: string[] = [];

  contents.forEach((fileOrDir: string) => {
    const fullPath = path.join(dir, fileOrDir);

    if (statSync(fullPath).isDirectory()) {
      if (!FOLDER_SKIPLIST.includes(fileOrDir)) {
        fileNames = fileNames.concat(recursivelyReadDirectory(fullPath));
      }
    } else {
      fileNames.push(fullPath);
    }
  });

  return fileNames.filter((file: string) => file.includes('.ts'));
};

/**
 * Load everything we need to know about all the IPC handlers we've written, so we can put info in the other files as necessary
 */
const extractHandlersMetadata: () => Promise<
  GencodeIpcHandler[]
> = async () => {
  // Load list of file paths in handlers directory, recursively visiting subfolders
  const fileNames = (await recursivelyReadDirectory(HANDLERS_DIRECTORY)).map(
    (filePath: string) => filePath.split(`${HANDLERS_DIRECTORY}/`)[1]
  );

  const handlers = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(HANDLERS_DIRECTORY, fileName);

      const fileContents = await fs.readFile(filePath, { encoding: 'utf-8' });

      const fileContentsNoNewline = fileContents.replace(
        // eslint-disable-next-line no-control-regex
        new RegExp('\n', 'g'),
        ''
      );

      // Find 'export default' statement in file and what it refers to
      const exportNameRegexMatch = fileContents.match(/export default (\w+)/);

      if (exportNameRegexMatch === null) {
        throw new Error(
          `No default export in file ${filePath} . All handlers must declare a single default export.`
        );
      }

      const handlerName = exportNameRegexMatch[1]; // second element in match array is the matched text

      if (handlerName === 'function') {
        throw new Error(
          `Error in ${filePath} . Do not use 'export default function' syntax - instead, declare function as a const and export default the const.`
        );
      }

      // Find the handler type
      const handlerTypeRegexMatch = fileContentsNoNewline.match(
        new RegExp(`type ${pascalCase(handlerName)} = (.+);`)
      );

      if (handlerTypeRegexMatch === null) {
        throw new Error(
          `Error extracting type from handler in file ${filePath} . Handler type must be declared separately from handler, with matching name in PascalCase. See existing handlers for examples.`
        );
      }

      const handlerType = extractType(handlerTypeRegexMatch[1]); // again, second element is matched text

      // Find the handler args
      const handlerArgsRegexMatch = fileContentsNoNewline.match(
        new RegExp(
          `const ${handlerName}: ${pascalCase(handlerName)} =(?: async)? `
        )
      );

      if (
        handlerArgsRegexMatch === null ||
        handlerArgsRegexMatch.index === undefined
      ) {
        throw new Error(
          `Error extracting arguments from handler function in file ${filePath} . Handler is incorrectly specified, see existing handlers for examples.`
        );
      }

      const handlerArgsIndex = handlerArgsRegexMatch.index;

      const handlerArgs = extractHandlerArgs(
        fileContentsNoNewline,
        handlerArgsIndex
      );

      return {
        fileName,
        filePath,
        handlerName,
        handlerType,
        handlerArgs,
      };
    })
  );

  return handlers;
};

/**
 * Util for replacing the contents of a file between START GENERATED CODE and END GENERATED CODE tags (with optional parts)
 * @param filePath path of file
 * @param replaceWith things to replace with, can be a single string (no parts) or array (PART 1, PART 2 etc)
 */
const replaceBetweenTags: (
  filePath: string,
  replaceWith: string | string[]
) => Promise<void> = async (filePath, replaceWith) => {
  let fileContents = await fs.readFile(filePath, {
    encoding: 'utf-8',
  });

  const replaceWithList = Array.isArray(replaceWith)
    ? replaceWith
    : [replaceWith];

  replaceWithList.forEach((replaceWithString, i) => {
    const makeTag: (startOrEnd: string) => string = (startOrEnd) =>
      `// ${startOrEnd} GENERATED CODE${
        replaceWithList.length === 1 ? '' : ` PART ${i + 1}`
      }\n`;

    const startGeneratedIndex = fileContents.indexOf(makeTag('START'));
    const endGeneratedIndex = fileContents.indexOf(makeTag('END'));

    fileContents =
      fileContents.slice(0, startGeneratedIndex + makeTag('START').length) +
      replaceWithString +
      fileContents.slice(endGeneratedIndex);
  });

  await fs.writeFile(filePath, fileContents);
};

/**
 * Generate ipc.ts file in back end
 */
const generateIpcBackEnd: (
  handlers: GencodeIpcHandler[]
) => Promise<void> = async (handlers) => {
  const ipcImportCommands = handlers.map(({ filePath, handlerName }) => {
    const relativeFilePathNoExtension = filePath
      .split('.')[0]
      .split(`${HANDLERS_DIRECTORY}/`)[1];
    return `import ${handlerName} from './handlers/${relativeFilePathNoExtension}';`;
  });

  const ipcRegisterCommands = handlers.map(({ handlerName, handlerArgs }) => {
    const inputArgs = ['_event', ...handlerArgs].filter(
      (arg) =>
        arg !== 'ipcContext' && // ipcContext is injected by the IPC file and therefore not needed as an argument
        arg !== ''
    );

    // No need for unused _event arg if there aren't other args after it
    const inputArgsString = inputArgs.length > 1 ? inputArgs.join(', ') : '';

    const callArgsString = handlerArgs.join(', ');

    return `ipcMain.handle('${paramCase(
      handlerName
    )}', async (${inputArgsString}) => ${handlerName}(${callArgsString}));`;
  });

  const partOne = `${ipcImportCommands.join('\n')}\n`;
  const partTwo = ipcRegisterCommands.map((str) => `  ${str}\n`).join('\n');

  await replaceBetweenTags(FILE_PATHS.ipc, [partOne, partTwo]);
};

/**
 * Generate preload.js file
 */
const generatePreload: (
  handlers: GencodeIpcHandler[]
) => Promise<void> = async (handlers) => {
  const invokeRegisterCommands = handlers.map(
    ({ handlerName, handlerArgs }) => {
      const args = handlerArgs.filter((arg) => arg !== 'ipcContext');

      const inputArgsString = args.join(', ');

      const invokeArgsString = [`'${paramCase(handlerName)}'`, ...args].join(
        ', '
      );

      return `${handlerName}: (${inputArgsString}) => ipcRenderer.invoke(${invokeArgsString}),\n`;
    }
  );

  const injectWith = invokeRegisterCommands.map((str) => `  ${str}`).join('\n');

  await replaceBetweenTags(FILE_PATHS.preload, injectWith);
};

/**
 * Generate global.d.ts file
 */
const generateGlobalDeclaration: (
  handlers: GencodeIpcHandler[]
) => Promise<void> = async (handlers) => {
  const declareTypeCommands = handlers.map(({ handlerName, handlerType }) => {
    return `${handlerName}: ${handlerType};\n`;
  });

  const injectWith = declareTypeCommands.map((str) => `  ${str}`).join('\n');

  await replaceBetweenTags(FILE_PATHS.global, injectWith);
};

/**
 * Overall gencode runner.
 * Note: need to run prettier afterwards, as output formatting can be a little bit messed up. This is set up as part of `yarn gen` already
 */
const runGencode: () => Promise<void> = async () => {
  // Step 1: Get a list of the handler types for all handlers in the main/handlers/ folder
  const handlers: GencodeIpcHandler[] = await extractHandlersMetadata();

  // Step 2: Generate ipc.ts in the back end, to register the IPC handlers
  await generateIpcBackEnd(handlers);

  // Step 3: Generate preload.js in the back end, to expose IPC handlers to the front end
  await generatePreload(handlers);

  // Step 4: Generate global.d.ts in the front end, to give front end types to the IPC handlers
  await generateGlobalDeclaration(handlers);
};

// This is run from the command line, so call it as part of the file
runGencode();
