/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Feature } from '@common-stack/client-react';
import { locationChangeEpic } from './locationEpic';

export default new Feature({
    epic: [locationChangeEpic],
});
