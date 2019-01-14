const { findConfigs } = require('./webpack.config');
import 'jest';
describe('test', ()=> {

    it('test findconfig', async (done) => {

        const config = await findConfigs();
        console.log('--config', config);
        done();
    })
})