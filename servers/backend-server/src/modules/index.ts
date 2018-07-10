import modules, { settings } from './module';
export default modules;

export const serviceContext = modules.createServiceContext(settings);
