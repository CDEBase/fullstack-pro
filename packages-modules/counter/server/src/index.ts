import counter from './module';
import { Feature } from '@common-stack/server-core';
export { CounterMockMoleculerService } from './services';
export * from './constants';

export default new Feature(counter);
