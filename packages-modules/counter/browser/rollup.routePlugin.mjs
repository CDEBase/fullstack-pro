import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const dir = dirname(fileURLToPath(import.meta.url));
const dirPkg = dirname(pkg.name + '/' + pkg.main);

export default function routePlugin(options = {}) {
  return {
    name: "route-plugin",
    transform(source, id) {
      if (id.endsWith('.route.json')) {
        const basePath = dirname(id.replace(dir + '/src', dirPkg));
        try {
          const routes = JSON.parse(source);
          const newRoutes = routes.map(route => {
            if (route.file) {
              const file = route.file;
              return {
                ...route,
                file: file.startsWith('./') 
                  ? basePath + '/' + file.substring(2) 
                  : basePath + '/' + file,
              }
            }
            return route;
          });
          return JSON.stringify(newRoutes);
        } catch(err) {
          return null;
        }
      }
      return null;
    },
  };
}