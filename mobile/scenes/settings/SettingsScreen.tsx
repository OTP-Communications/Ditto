import {
  Avatar,
  Icon,
  Layout,
  ListItem,
  Text,
  Toggle,
  useTheme,
} from '@ui-kitten/components';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {matrix} from '@rn-matrix/core';
import {useObservableState} from 'observable-hooks';
import {ThemeContext} from '../../../shared/themes/ThemeProvider';

export default function SettingsScreen() {
  const theme = useTheme();
  const {themeId, setTheme} = useContext(ThemeContext);
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
    <Icon {...props} fill={theme['color-primary-500']} name="moon" />
  );
  const PersonIcon = (props) => <Icon {...props} name="person" />;
  const ItemChevron = (props) => <Icon {...props} name="chevron-right" />;

  const logout = () => {
    matrix.logout();
  };

  return (
    <Layout
      style={[
        styles.wrapper,
        {backgroundColor: theme['background-basic-color-5']},
      ]}>
      <Avatar
        source={{uri: matrix.getHttpUrl(avatar)}}
        style={{width: 100, height: 100, marginBottom: 12}}
      />
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
        style={{alignSelf: 'flex-start', marginLeft: 16, marginBottom: 12}}>
        Appearance
      </Text>
      <ListItem
        title="Dark Mode"
        accessoryLeft={DarkModeIcon}
        accessoryRight={ThemeToggle}
        style={{backgroundColor: theme['background-basic-color-4']}}
      />
      {/* <Text
        category="h6"
        style={{
          alignSelf: 'flex-start',
          marginLeft: 16,
          marginBottom: 12,
          marginTop: 48,
        }}>
        Account Settings
      </Text>
      <ListItem
        title="Avatar and Display Name"
        accessoryLeft={PersonIcon}
        accessoryRight={ItemChevron}
        style={{backgroundColor: theme['background-basic-color-4']}}
      /> */}
      <ListItem
        onPress={logout}
        style={{
          backgroundColor: theme['background-basic-color-4'],
          width: '100%',
          justifyContent: 'center',
          marginTop: 48,
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
