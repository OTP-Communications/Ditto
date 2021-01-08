import {
  Avatar,
  Divider,
  Icon,
  Layout,
  ListItem,
  Text,
  Toggle,
  useTheme,
} from '@ui-kitten/components';
import React, {useContext} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import {ThemeContext} from '../../../shared/themes/ThemeProvider';
import Spacing from '../../../shared/styles/Spacing';
import {AppContext} from '../../../shared/context/AppContext';
import i18n from '../../../shared/i18n';

export default function SettingsScreen({navigation}) {
  const theme = useTheme();
  const {themeId, setTheme} = useContext(ThemeContext);
  const {errorReportingEnabled, setErrorReportingEnabled} = useContext(
    AppContext,
  );
  const myUser = matrix.getMyUser();

  const avatar = useObservableState(myUser.avatar$);
  const name = useObservableState(myUser.name$);

  const ThemeToggle = (props) => (
    <Toggle
      checked={themeId === 'dark'}
      onChange={(value) => {
        if (value) setTheme('dark');
        else setTheme('light');
      }}
    />
  );

  const DarkModeIcon = (props) => (
    <Icon {...props} fill={theme['color-primary-default']} name="moon" />
  );

  const ErrorReportingToggle = (props) => (
    <Toggle
      checked={errorReportingEnabled}
      onChange={setErrorReportingEnabled}
    />
  );

  const ErrorReportingIcon = (props) => (
    <Icon
      {...props}
      fill={theme['color-danger-default']}
      name="alert-triangle"
    />
  );

  const LanguageIconRight = (props) => (
    <Icon
      {...props}
      fill={theme['background-basic-color-1']}
      name="chevron-right"
    />
  );

  const LanguageIconLeft = (props) => (
    <Icon {...props} fill={theme['color-success-default']} name="globe-2" />
  );

  const navToLanguages = () => {
    navigation.navigate('LanguageSelect');
  };

  const logout = () => {
    Alert.alert(
      'Are you sure you want to log out?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes, logout', onPress: matrix.logout, style: 'destructive'},
      ],
      {cancelable: false},
    );
  };

  return (
    <Layout
      style={[
        styles.wrapper,
        {backgroundColor: theme['background-basic-color-5']},
      ]}>
      <View
        style={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: Spacing.l,
        }}>
        <Avatar
          source={{uri: matrix.getHttpUrl(avatar)}}
          style={{
            width: 100,
            height: 100,
            backgroundColor: theme['background-basic-color-3'],
          }}
        />
        {!avatar && (
          <Text
            category="h1"
            style={{
              position: 'absolute',
              fontSize: 50,
              opacity: 0.3,
            }}
            numberOfLines={1}>
            {name?.charAt(0)}
          </Text>
        )}
      </View>
      <Text category="h4" style={{maxWidth: 250}} numberOfLines={1}>
        {name}
      </Text>
      <Text
        category="h6"
        style={{opacity: 0.3, maxWidth: 250, marginBottom: 48}}
        numberOfLines={1}>
        {myUser.id}
      </Text>
      <Text
        category="h6"
        style={{
          alignSelf: 'flex-start',
          marginLeft: Spacing.l,
          marginBottom: Spacing.m,
        }}>
        {i18n.t('settings:appearance.title')}
      </Text>
      <ListItem
        title={i18n.t('settings:appearance.darkMode')}
        accessoryLeft={DarkModeIcon}
        accessoryRight={ThemeToggle}
        style={{backgroundColor: theme['background-basic-color-4']}}
      />
      <Divider />
      <ListItem
        onPress={navToLanguages}
        title={i18n.t('settings:appearance.language')}
        accessoryLeft={LanguageIconLeft}
        accessoryRight={LanguageIconRight}
        style={{backgroundColor: theme['background-basic-color-4'], height: 52}}
      />
      <Text
        category="h6"
        style={{
          alignSelf: 'flex-start',
          marginLeft: Spacing.l,
          marginBottom: Spacing.m,
          marginTop: Spacing.xxl,
        }}>
        {i18n.t('settings:privacy.title')}
      </Text>
      <ListItem
        title={i18n.t('settings:privacy.errorReporting')}
        description={i18n.t('settings:privacy.errorReportingDesc')}
        accessoryLeft={ErrorReportingIcon}
        accessoryRight={ErrorReportingToggle}
        style={{backgroundColor: theme['background-basic-color-4']}}
      />
      <ListItem
        onPress={logout}
        style={{
          backgroundColor: theme['background-basic-color-4'],
          width: '100%',
          justifyContent: 'center',
          marginTop: 48,
          height: 52,
        }}>
        <Text status="danger">Logout</Text>
      </ListItem>
    </Layout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 12,
    alignItems: 'center',
  },
});
