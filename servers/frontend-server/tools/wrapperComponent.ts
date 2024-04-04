import * as fs from 'fs';
import * as path from 'path';

const authWrapperImportPath = '@adminide-stack/user-auth0-browser-ant';

// Utility function to get the project's root directory.
export function getRootPath(): string {
    return process.cwd();
}

/**
 * Wraps a route component with optional authentication and client-only rendering.
 * 
 * @param {string} file - The relative path to the original component file.
 * @param {boolean} [needsAuth=false] - Indicates whether the component requires authentication.
 * @param {boolean} [clientOnly=false] - Indicates whether the component should only render on the client side.
 * @returns {string} The relative path to the wrapped component, from the project root.
 */
export function wrapRouteComponent(file: string, needsAuth = false, clientOnly = false): string {
    try {
        const basePath = path.join(getRootPath(), 'node-modules');
        const fileName = `Wrapped${path.basename(file, '.js')}.tsx`;
        const newFilePath = path.join(getRootPath(), 'app', fileName);

        const authImport = needsAuth ? `import { authWrapper } from '${authWrapperImportPath}';` : '';
        const clientOnlyImport = clientOnly ? `import { ClientOnly } from 'remix-utils/client-only';` : '';
        const originalComponentImport = `import OriginalComponent from '${file}';`;
        
        const componentDeclaration = needsAuth
            ? 'const EnhancedComponent = (props) => authWrapper(React.createElement(OriginalComponent, props));'
            : '';
        
        const componentUsage = clientOnly
            ? `<ClientOnly>{() => <${needsAuth ? 'EnhancedComponent' : 'OriginalComponent'} {...props} />}</ClientOnly>`
            : `<${needsAuth ? 'EnhancedComponent' : 'OriginalComponent'} {...props} />`;

        const wrappedContent = `
import * as React from 'react';
${authImport}
${clientOnlyImport}
${originalComponentImport}
${componentDeclaration}
export default function Component(props) {
    return (${componentUsage});
}`;
        
        fs.writeFileSync(newFilePath, wrappedContent.trim(), 'utf8');
        console.log(`Wrapped component generated at: ${newFilePath}`);

        return path.relative(basePath, newFilePath);
    } catch (error) {
        console.error('Error wrapping component:', error);
        return file;
    }
}
