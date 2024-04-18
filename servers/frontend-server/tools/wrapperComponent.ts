import * as fs from 'fs';
import * as path from 'path';

const authWrapperImportPath = '@adminide-stack/user-auth0-browser-ant';

// Utility function to get the project's root directory.
export function getRootPath(): string {
  return process.cwd();
}

// New function to handle file writing
function writeComponentToFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Component generated at: ${filePath}`);
}

function generateExports(options) {
  let exports = '';
  if (options.hasLoader) {
    exports += `
export async function loader(params) {
  return await loaderFunc(params);
}`;
  }
  if (options.hasAction) {
    exports += `
export async function action(params) {
  return await actionFunc(params);
}`;
  }
  return exports;
}

function generateLoaderDataHook(options) {
  return options.hasLoader ? `const loaderData = useLoaderData();\n` : '';
}

function generateLoaderDataProp(options) {
  return options.hasLoader ? 'loaderData={loaderData}' : '';
}

function wrapComponent(currentFilePath, wrapperPaths, options) {
  // Start with the base import for the OriginalComponent.
  let imports = `import * as React from 'react';\n`;
  let componentImports = `import OriginalComponent`;
  if (options.hasLoader || options.hasAction) {
    let additionalImports = [];
    if (options.hasLoader) {
      additionalImports.push('loader as loaderFunc');
    }
    if (options.hasAction) {
      additionalImports.push('action as actionFunc');
    }
    componentImports += `, { ${additionalImports.join(', ')} }`;
  }
  componentImports += ` from '${currentFilePath}';\n`;
  imports += componentImports;

  // Include useLoaderData import if hasLoader is true.
  if (options.hasLoader) {
    imports += `import { useLoaderData } from '@remix-run/react';\n`;
  }

  if (!wrapperPaths.length) {
    // Return the original component structure if there are no wrappers.
    let componentLogic = `export default function Component(props) {
  ${generateLoaderDataHook(options)}
  return (<OriginalComponent {...props}${generateLoaderDataProp(options)} />);
}
${generateExports(options)}
`;
    return imports + componentLogic;
  }

  let wrappersStart = '', wrappersEnd = '';

  // Construct wrapping elements for each wrapper path provided.

  wrapperPaths.forEach((wrapperPath, index) => {
    let wrapperComponentName = `Wrapper${index + 1}`;
    if (wrapperPath === '$authWrapper') {
      imports += `import authModule from '${authWrapperImportPath}';\n`;
      wrappersStart = `authModule.authWrapper(React.createElement(` + wrappersStart;
      wrappersEnd += `))`;
    } else if (wrapperPath === '$clientOnlyWrapper') {
      imports += `import { ClientOnly } from 'remix-utils/client-only';\n`;
      wrappersStart = `<ClientOnly>{() => ` + wrappersStart;
      wrappersEnd += `}</ClientOnly>`;
    } else {
      imports += `import ${wrapperComponentName} from '${wrapperPath}';\n`;
      wrappersStart += `<${wrapperComponentName} {...props}>`;
      wrappersEnd = `</${wrapperComponentName}>` + wrappersEnd;
    }
  });

  // Final component logic including all wrappers.
  let componentLogic = `
const EnhancedComponent = (props) => {
  ${generateLoaderDataHook(options)}
  return ${wrappersStart}<OriginalComponent {...props}${generateLoaderDataProp(options)} />${wrappersEnd};
};
export default function Component(props) {
  return <EnhancedComponent {...props} />;
}
${generateExports(options)}
`;

  return imports + componentLogic;
}


export function wrapRouteComponent(file: string, wrapperPaths: string[] = [], options = { hasLoader: false, hasAction: false, suffix: '' }): string {
  const basePath = path.join(getRootPath(), 'node-modules');
  let fileName = path.basename(file, '.js');
  fileName = `Wrapped${fileName}-${options.suffix}.tsx`;
  const newFilePath = path.join(getRootPath(), 'app', fileName);
  const wrappedContent = wrapComponent(file, wrapperPaths, options);

  writeComponentToFile(newFilePath, wrappedContent); // Use the new function for writing
  return path.relative(basePath, newFilePath);
}