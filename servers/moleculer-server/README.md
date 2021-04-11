[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# servers

## NPM scripts
- `yarn dev` - Start development mode (load all services locally with hot-reload & REPL)
- `yarn build`- Uses typescript to transpile service to javascript
- `npm start` - Start production mode (set `SERVICES` env variable to load certain services) (previous build needed)
- `yarn cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `yarn ci` - Run continuous test mode with watching
- `npm test` - Run tests & generate coverage report