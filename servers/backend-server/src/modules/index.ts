import modules, { settings } from './module';

export default modules;
export { settings };

// export const updateContainers = (options) => {
//     if (process.env.NODE_ENV !== 'development') {
//         options.forEach(el => {
//             hemera.act({
//                 topic: `UPDATE_CONTAINER_${el.toUpperCase()}`,
//                 cmd: `UPDATE_CONTAINER_${el.toUpperCase()}`,
//             });
//         });'
//     } else {
//         modules.createServiceContext(settings, options);
//     }
// };
