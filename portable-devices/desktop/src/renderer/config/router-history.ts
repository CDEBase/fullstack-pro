import { createMemoryHistory, createHashHistory } from 'history';

if (__CLIENT__) {
    module.exports = createHashHistory(); // use hashistory in electron
} else {
    module.exports = (url: string) =>
        createMemoryHistory({
            initialEntries: [url],
        });
}
