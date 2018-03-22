import './default-router';
import modules from '@sample-stack/counter/lib/browser';
if (!modules.router) {
    throw new Error('At least one router must be defined in modules');
}
const router = modules.router;
export default router;
