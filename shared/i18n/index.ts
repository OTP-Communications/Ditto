

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import zhHans from './locales/zh-Hans.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import nl from './locales/nl.json';
import AsyncStorage from '@react-native-community/async-storage';

const i18n = i18next.createInstance()

export const supportedLanguages = [
  { name: 'English', tag: 'en' },
  { name: 'German', tag: 'de' },
  { name: 'Dutch', tag: 'nl' },
  { name: 'Chinese', tag: 'zh-Hans' },
]

const resources = {
  en,
  de,
  nl,
  'zh-Hans': zhHans,
};

console.log({ resources })

const fallback = { languageTag: 'en', isRTL: false };
const locale =
  RNLocalize.findBestAvailableLanguage(Object.keys(resources)) || fallback;

console.log({ locale, test: RNLocalize.findBestAvailableLanguage(Object.keys(resources)) })

// const languageDetector = {
//   init: Function.prototype,
//   type: 'languageDetector',
//   detect: () => locale.languageTag,
//   cacheUserLanguage: Function.prototype,
// };

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: cb => cb('de'),
  init: () => { },
  cacheUserLanguage: () => { },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'de',
    debug: true,
    resources,
    react: {
      useSuspense: true
    }
  });

export default i18n;


// import React from 'react';
// import { Text, View, TouchableOpacity } from 'react-native';
// import i18next from 'i18next';
// import { initReactI18next, useTranslation } from 'react-i18next';
// // import fr from '../../../shared/i18n/locales/fr.json';
// import en from './locales/en.json'
// import de from './locales/de.json'

// const languageDetector = {
//   type: 'languageDetector',
//   async: true,
//   detect: (cb) => cb('en'),
//   init: () => { },
//   cacheUserLanguage: () => { },
// };

// i18next
//   .use(languageDetector)
//   .use(initReactI18next)
//   .init({
//     fallbackLng: 'en',
//     debug: true,
//     // resources: {
//     //   en: {
//     //     translation: {
//     //       hello: 'Hello world',
//     //       change: 'Change language',
//     //     },
//     //   },
//     //   sv: {
//     //     translation: {
//     //       hello: 'Hej världen',
//     //       change: 'Byt språk',
//     //     },
//     //   },
//     // },
//     react: {
//       useSuspense: true
//     }
//   });

// i18next.addResourceBundle('en', 'translation', en)
// i18next.addResourceBundle('de', 'translation', de)
// console.log('langueages', i18next.languages)