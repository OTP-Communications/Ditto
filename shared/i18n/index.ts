

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { saveItemToStorage, getItemFromStorage } from '../utilities/storage'

import en from './locales/en.json';
import zhHans from './locales/zh-Hans.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import nl from './locales/nl.json';

const i18n = i18next.createInstance()

export const supportedLanguages = [
  { name: 'English', tag: 'en' },
  { name: 'German', tag: 'de' },
  { name: 'Dutch', tag: 'nl' },
  { name: 'French', tag: 'fr' },
  { name: 'Chinese', tag: 'zh-Hans' },
]

const resources = {
  en,
  de,
  nl,
  fr,
  'zh-Hans': zhHans,
};

const fallback = { languageTag: 'en', isRTL: false };
const locale =
  RNLocalize.findBestAvailableLanguage(Object.keys(resources)) || fallback;


const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: () => locale.languageTag,
  init: () => { },
  cacheUserLanguage(lng: string) {
    saveItemToStorage('@ditto-language', lng)
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: fallback.languageTag,
    debug: false,
    resources,
    react: {
      useSuspense: true
    }
  });

getItemFromStorage('@ditto-language').then((lang: string) => {
  if (lang) {
    i18n.changeLanguage(lang)
  }
})

export default i18n;
