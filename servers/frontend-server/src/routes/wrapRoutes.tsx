import fs from 'fs';
import path from 'path';

const wrapperComponentImportPath = '../components/Wrapper'; // Adjust the path as necessary

export function getRootPath() {
  const directoryName = path.dirname(process.cwd());
  const rootPath = directoryName.split(path.sep);
  rootPath.splice(rootPath.length - 1, 1);
  
  return rootPath.join(path.sep);
}

export function wrapRouteComponent(file: string) {
  const basePath = getRootPath() + '/node_modules/';
  const filePath = `${basePath}${file}`;
  let fileName = path.basename(file);

  try {
    const wrappedContent = `
import * as React from 'react';
import Wrapper from '${wrapperComponentImportPath}';
import Component from './${fileName}';
var WrappedComponent = (props) => {
  return (React.createElement(Wrapper, null,
    React.createElement(Component, props)));
};export{WrappedComponent as default};
`;
    fileName = `_authenticate${fileName}`;
    const newPath = path.resolve(path.dirname(filePath), fileName);
    fs.writeFileSync(newPath, wrappedContent, 'utf8');
    console.log(`Wrapped ${newPath}`);

    return newPath.replace(basePath, '');
  } catch (e) {
    console.log('Error', e);
  }

  return file;
}
