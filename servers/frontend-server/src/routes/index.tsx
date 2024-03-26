import pkg from '../../package.json' assert { type: "json" };
import counterRoutes from '@sample-stack/counter-module-browser/lib/routes.json' assert { type: "json" };

const dependencies: any = pkg.dependencies;

const getFilePath = (file: string, module: string) => {
  let link = dependencies[module];
  let filePath = file;
  
  if (link && link.startsWith('link:')) {
    link = link.replace('link:', '');
    filePath = filePath.replace(module, link);
    filePath = '../' + filePath; // escape from src/
  } else {
    filePath = '../node_modules/' + filePath; // escape from src/, enter node_modules/
  }
  return filePath;
};

export const generateRemixRoutes = async (route) => {
  
  counterRoutes.forEach((routeConfig: any) => {
    const { path, file, ...routeParams }: any = Object.values(routeConfig)[0];
    const filePath = getFilePath(file, '@sample-stack/counter-module-browser');
    route(path, filePath, routeParams);
  });
}
