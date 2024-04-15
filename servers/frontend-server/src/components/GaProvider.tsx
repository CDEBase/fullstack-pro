import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from '@remix-run/react';
import { config } from '../config/browser-env-config';

ReactGA.initialize(config.GA_ID);


const GA4Provider = ({ children }: any) => {
    const location = useLocation();

    useEffect(() => {
        ReactGA.send({ hitType: 'pageview', page: document.location.pathname });
    }, [location]);

    return <>{children}</>;
};

export default GA4Provider;
