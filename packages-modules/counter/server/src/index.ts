import { Feature } from '@common-stack/server-core';
import counter from './module';

export { CounterMockMoleculerService } from './services';
export * from './constants';
export default new Feature(counter);
