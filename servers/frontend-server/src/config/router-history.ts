import createHistory from 'history/createBrowserHistory';

if (typeof window !== 'undefined') {
    module.exports = createHistory();
} else {
    module.exports = {};
}
