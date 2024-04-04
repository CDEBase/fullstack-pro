import * as fs from 'fs';
import * as path from 'path';

const authWrapperImportPath = '@adminide-stack/user-auth0-browser-ant';

// Utility function to get the project's root directory.
export function getRootPath() {
    return process.cwd();
}

/**
 *
 * @param file Function to wrap a route component, conditionally with an auth wrapper.
 * If auth is not required, a dummy wrapper is used that simply renders the component.
 *
 * @param {string} file - The path to the original component file.
 * @param {boolean} needsAuth - Indicates whether the component requires authentication.
 * @returns {string} The path to the wrapped component, relative to the project root.
 */
export function wrapRouteComponent(file: string, needsAuth = false, clientOnly = false) {
    const basePath = path.join(getRootPath(), 'node-modules');
    const fileName = path.basename(file, '.js');
    const wrappedFileName = `Wrapped${fileName}.tsx`;
    const newFileDir = path.join(getRootPath(), 'app');

    // Construct the conditional wrapper logic based on the needsAuth and clientOnly flags.
    const authWrapperImport = needsAuth ? `import { authWrapper } from '${authWrapperImportPath}';\n` : '';
    const clientOnlyImport = clientOnly ? `import { ClientOnly } from 'remix-utils/client-only';\n` : '';
    const originalComponentImport = `import OriginalComponent from '${file}';\n`;
    const componentWrapper = needsAuth
        ? `const WrappedComponent = (props) => authWrapper(React.createElement(OriginalComponent, props));\n`
        : `const DummyWrapper = (props) => <OriginalComponent {...props} />;\n`;
    const clientOnlyWrapper = clientOnly
        ? `<ClientOnly>{() => <${needsAuth ? 'WrappedComponent' : 'DummyWrapper'} {...props} />}</ClientOnly>`
        : `<${needsAuth ? 'WrappedComponent' : 'DummyWrapper'} {...props} />`;

    try {
        // Generate the wrapper component content, combining the necessary wrappers.
        const wrappedContent = `
    import * as React from 'react';
    ${authWrapperImport}${clientOnlyImport}${originalComponentImport}
    ${componentWrapper}
    export default function Component(props) {
      return (
        ${clientOnlyWrapper}
      );
    }
    `;

        // Determine the new file path for the wrapped component.
        const newFilePath = path.join(newFileDir, wrappedFileName);

        // Write the wrapped component's code to the new file.
        fs.writeFileSync(newFilePath, wrappedContent, 'utf8');

        console.log(`Wrapped component generated at: ${newFilePath}`);

        // Return the path of the new, wrapped component, relative to the project root.
        const relativeFilePath = path.relative(basePath, newFilePath);
        return relativeFilePath;
    } catch (error) {
        console.error('Error wrapping component:', error);
        // Return the original file path if an error occurs during wrapping.
        return file;
    }
}
