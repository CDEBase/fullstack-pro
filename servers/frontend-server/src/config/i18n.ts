/* eslint-disable jest/require-hook */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from 'virtual:i18next-loader';


i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    ns: 'translations',
    defaultNS: 'translations',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
