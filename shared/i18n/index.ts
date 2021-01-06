import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// import en from './locales/en.json';
import zhHans from './locales/zh-Hans.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import nl from './locales/nl.json';

const resources = {
  // en,
  fr,
  de,
  nl,
  'zh-Hans': zhHans,
};

console.log({ resources })

const fallback = { languageTag: 'de', isRTL: false };
// const locale =
//   RNLocalize.findBestAvailableLanguage(Object.keys(resources)) || fallback;

const locale = fallback;

const languageDetector = {
  init: Function.prototype,
  type: 'languageDetector',
  detect: () => locale.languageTag,
  cacheUserLanguage: Function.prototype,
};

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    lng: 'de',
    fallbackLng: fallback,
    debug: true,
    resources,
    ns: ['auth', 'messages', 'settings', 'newChat', 'home'],
    react: {
      useSuspense: false,
    },
  })

export default i18n;
