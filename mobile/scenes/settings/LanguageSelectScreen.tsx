import {Layout, Radio, RadioGroup, Text, useTheme} from '@ui-kitten/components';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import i18n, {supportedLanguages} from '../../../shared/i18n';
import Spacing from '../../../shared/styles/Spacing';
import ThemeType from '../../../shared/themes/themeType';
import {useTranslation} from 'react-i18next';

export default function LanguageSelectScreen() {
  const theme: ThemeType = useTheme();
  const [language, setLanguage] = useState(i18n.language);

  const {t} = useTranslation();

  const setNewLanguage = (index: number) => {
    i18n
      .changeLanguage(supportedLanguages[index].tag)
      .then(() => setLanguage(supportedLanguages[index].tag));
  };

  return (
    <Layout
      style={[
        styles.wrapper,
        {backgroundColor: theme['background-basic-color-5']},
      ]}>
      <Text>{t('auth:landing.loginButtonLabel')}</Text>
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
