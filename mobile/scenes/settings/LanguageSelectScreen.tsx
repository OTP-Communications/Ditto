import {Layout, Radio, RadioGroup, Text, useTheme} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Spacing from '../../../shared/styles/Spacing';
import ThemeType from '../../../shared/themes/themeType';
import {useTranslation} from 'react-i18next';
import {supportedLanguages} from '../../../shared/i18n';

export default function LanguageSelectScreen() {
  const theme: ThemeType = useTheme();
  const {t, i18n} = useTranslation();
  console.log({i18n});
  const [language, setLanguage] = useState(i18n.language);

  const setNewLanguage = (index: number) => {
    i18n
      .changeLanguage(supportedLanguages[index].tag)
      .then(() => setLanguage(supportedLanguages[index].tag));
  };
  useEffect(() => {
    const one = i18n.getResourceBundle('en', 'auth');
    const two = i18n.getResourceBundle('de', 'auth');
    console.log({one, two});
    // i18n
    //   .reloadResources()
    //   .then((val) =>
    //     console.log({result: i18n.getResourceBundle('de', 'settings')}),
    //   );
  }, []);

  return (
    <Layout
      style={[
        styles.wrapper,
        {backgroundColor: theme['background-basic-color-5']},
      ]}>
      <Text>
        {language}: {t('hello')}
      </Text>
      <RadioGroup
        selectedIndex={supportedLanguages.findIndex((i) => i.tag === language)}
        onChange={setNewLanguage}>
        {supportedLanguages.map((lang) => (
          <Radio key={lang.tag} style={{padding: Spacing.m}}>
            {lang.name} ({lang.tag})
          </Radio>
        ))}
      </RadioGroup>
    </Layout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: Spacing.m,
  },
});

// import React from 'react';
// import {Text, View, TouchableOpacity} from 'react-native';
// import i18next from 'i18next';
// import {initReactI18next, useTranslation} from 'react-i18next';
// import de from '../../../shared/i18n/locales/de.json';

// const languageDetector = {
//   type: 'languageDetector',
//   async: true,
//   detect: (cb) => cb('en'),
//   init: () => {},
//   cacheUserLanguage: () => {},
// };

// const resources = {
//   en: {
//     translation: {
//       hello: 'Hello world',
//       change: 'Change language',
//     },
//   },
//   fr: {
//     translation: {
//       hello: 'Hej världen',
//       change: 'Byt språk',
//     },
//   },
//   de: {
//     translation: {
//       ...de,
//       hello: 'test 2',
//       change: 'wow cool',
//       test: {
//         one: 'hmmmm',
//       },
//     },
//   },
//   // de,
// };

// i18next.use(languageDetector).use(initReactI18next).init({
//   fallbackLng: 'en',
//   debug: true,
//   resources,
// });

// export default function LanguageSelectScreen() {
//   const {t, i18n} = useTranslation();

//   console.log(i18n.getResourceBundle('de', 'translation'));

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'white',
//       }}>
//       <Text style={{fontSize: 20, marginBottom: 20}}>{t('hello')}</Text>

//       <TouchableOpacity
//         onPress={() =>
//           i18n.changeLanguage(i18n.language === 'de' ? 'en' : 'de')
//         }>
//         <Text>{t('settings.title')}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
