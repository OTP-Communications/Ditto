import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import zhHans from './locales/zh-Hans.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import nl from './locales/nl.json';

export const supportedLanguages = [
  { name: 'English', tag: 'en' },
  { name: 'French', tag: 'fr-FR' },
  { name: 'German', tag: 'de' },
  { name: 'Dutch', tag: 'nl' },
  { name: 'Chinese', tag: 'zh-Hans' },
]

const resources = {
  en,
  'fr-FR': fr,
  de,
  nl,
  'zh-Hans': zhHans,
};

console.log({ resources })

const fallback = { languageTag: 'en', isRTL: false };
const locale =
  RNLocalize.findBestAvailableLanguage(Object.keys(resources)) || fallback;

console.log({ locale, test: RNLocalize.findBestAvailableLanguage(Object.keys(resources)) })

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
    fallbackLng: fallback,
    debug: true,
    resources,
    ns: ['auth', 'messages', 'settings', 'newChat', 'home'],
    react: {
      useSuspense: true,
    },
  })

export default i18n;
