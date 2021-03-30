import { createBrowserHistory, createMemoryHistory } from 'history';

// if (__CLIENT__) {
    const hist = createMemoryHistory();
    console.log('--hist', hist)
    module.exports = hist;

// } else {
//     module.exports = (url) => createMemoryHistory({
//         initialEntries: [url],
//     });
// }
