import modules, { settings } from './module';
import { hemeraGen } from '../modules/nats-connection';

export default modules;

export const serviceContext = modules.createServiceContext(settings);
export const updateContainers = (options) => {
    if (process.env.NODE_ENV !== 'development') {
        const hemera = hemeraGen();
        options.forEach(el => {
            hemera.act({
                topic: `UPDATE_CONTAINER_${el.toUpperCase()}`,
                cmd: `UPDATE_CONTAINER_${el.toUpperCase()}`,
            });
        });
    } else {
        modules.createServiceContext(settings, options);
    }
};
