(global => {

    const { navigator } = global;
    if (navigator) {
        // userAgent
        //
        // Required by:
        // - lib-jitsi-meet/modules/browser/BrowserDetection.js
        let userAgent = navigator.userAgent || '';

        // react-native/version
        const { name, version } = require('react-native/package.json');
        let rn = name || 'react-native';

        version && (rn += `/${version}`);
        if (userAgent.indexOf(rn) === -1) {
            userAgent = userAgent ? `${rn} ${userAgent}` : rn;
        }

        // (OS version)
        const os = `(${Platform.OS} ${Platform.Version})`;

        if (userAgent.indexOf(os) === -1) {
            userAgent = userAgent ? `${userAgent} ${os}` : os;
        }

        navigator.userAgent = userAgent;
    }

    // // CallStats
    // //
    // // Required by:
    // // - lib-jitsi-meet
    // require('react-native-callstats/csio-polyfill');
    // global.callstats = require('react-native-callstats/callstats');


    // // Timers
    // //
    // // React Native's timers won't run while the app is in the background, this
    // // is a known limitation. Replace them with a background-friendly
    // // alternative.
    // //
    // // Required by:
    // // - lib-jitsi-meet
    // // - Strophe
    // global.clearTimeout = BackgroundTimer.clearTimeout.bind(BackgroundTimer);
    // global.clearInterval = BackgroundTimer.clearInterval.bind(BackgroundTimer);
    // global.setInterval = BackgroundTimer.setInterval.bind(BackgroundTimer);
    // global.setTimeout = (fn, ms = 0) => BackgroundTimer.setTimeout(fn, ms);


})(global || window || this); // eslint-disable-line no-invalid-this