import { Feature } from '@common-stack/client-react';
import repository from './module';
import { Counter } from './components/Counter';

export { Counter };
export default new Feature(repository);
