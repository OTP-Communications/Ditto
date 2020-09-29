// import auth from './authService'
import {matrix} from '@rn-matrix/core';
import {
  Button,
  Card,
  Icon,
  Input,
  Layout,
  Modal,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
} from 'react-native';
// import Image from 'react-native-scalable-image'
// import styled from 'styled-components/native'

import {SCREEN_HEIGHT, SCREEN_WIDTH, isIos} from '../../../shared/utilities';

const topBlob = require('../../../shared/assets/images/blob4.png');
const bottomBlob = require('../../../shared/assets/images/blob5.png');

const debug = require('debug')('ditto:scenes:auth:LoginScreen');

export default function LoginScreen({navigation}) {
  const passwordInput = useRef(null);
  const theme = useTheme();
  const {t} = useTranslation('auth');

  // State
  const [usernameValue, setUsernameValue] = useState('');
  const [usernameTooltipVisible, setUsernameTooltipVisible] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [homeserverValue, setHomeserverValue] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [securePassword, setSecurePassword] = useState(true);

  const [passwordIsFocused, setPasswordIsFocused] = useState(false);
  const [homeserverIsFocused, setHomeserverIsFocused] = useState(false);

  // ********************************************************************************
  // Methods
  // ********************************************************************************

  const toggleUsernameTooltip = () =>
    setUsernameTooltipVisible(!usernameTooltipVisible);

  const handleLoginPress = async () => {
    Keyboard.dismiss();
    if (usernameValue.length === 0) {
      setErrorText(t('login.missingUsernameError'));
    } else if (passwordValue.length === 0) {
      setErrorText(t('login.missingPasswordError'));
    } else {
      debug('username: ', usernameValue);
      setErrorText('');
      setIsLoading(true);
      const response = await matrix.loginWithPassword(
        usernameValue,
        passwordValue,
        homeserverValue,
        true,
      );
      if (response.error) {
        setIsLoading(false);
        setErrorText(response.message);
      }
    }
  };

  const handleBackPress = () => navigation.goBack();

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleUsernameTooltip}>
      <Icon
        fill="#7F7F7F60"
        width={24}
        height={24}
        name="question-mark-circle-outline"
      />
    </TouchableWithoutFeedback>
  );

  const renderToggleSecureIcon = (props) => (
    <TouchableWithoutFeedback
      onPress={() => setSecurePassword(!securePassword)}>
      <Icon
        fill="#7F7F7F60"
        width={24}
        height={24}
        name={securePassword ? 'eye-off-outline' : 'eye-outline'}
      />
    </TouchableWithoutFeedback>
  );

  // ********************************************************************************
  // Lifecycle
  // ********************************************************************************
  useEffect(() => {
    setErrorText('');
  }, [usernameValue, passwordValue]);

  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: theme['color-basic-1000'],
      }}>
      <SafeAreaView>
        <TopNavigation
          title={(props) => (
            <Text
              {...props}
              category="h5"
              style={{color: theme['color-basic-100']}}>
              {t('login.title')}
            </Text>
          )}
          alignment="center"
          style={{backgroundColor: 'transparent'}}
          leftControl={<BackAction onPress={handleBackPress} />}
        />
      </SafeAreaView>
      <Image source={topBlob} style={styles.topBlob} />
      <Image source={bottomBlob} style={styles.bottomBlob} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollview}>
        <Input
          style={{
            backgroundColor: theme['color-basic-800'],
          }}
          textStyle={{color: theme['color-basic-100']}}
          label={t('login.usernameOrMatrixIdInputLabel')}
          placeholder={t('login.usernameOrMatrixIdInputPlaceholder')}
          autoFocus
          size={'large'}
          onChangeText={setUsernameValue}
          returnKeyType="next"
          onSubmitEditing={() => passwordInput.current.focus()}
          autoCapitalize="none"
          accessoryRight={renderIcon}
        />

        <Modal
          visible={usernameTooltipVisible}
          style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}>
          <TouchableWithoutFeedback
            onPress={() => setUsernameTooltipVisible(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#00000080',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Card disabled style={{marginBottom: 250}}>
                <Text category="h6" style={{marginBottom: 6}}>
                  Acceptable values:
                </Text>
                <Text>
                  Username only (defaults to matrix.org unless homeserver is
                  specified){'\n'}
                </Text>
                <Text>Full Matrix ID (@john:matrix.org)</Text>
                <Button
                  style={{marginTop: 24}}
                  onPress={() => setUsernameTooltipVisible(false)}>
                  Got it!
                </Button>
              </Card>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Input
          style={{
            marginTop: 12,
            backgroundColor: theme['color-basic-800'],
          }}
          textStyle={{color: theme['color-basic-100']}}
          label={t('login.passwordInputLabel')}
          placeholder={t('login.passwordInputPlaceholder')}
          size={'large'}
          accessoryRight={renderToggleSecureIcon}
          ref={passwordInput}
          secureTextEntry={securePassword}
          value={passwordValue}
          onChangeText={setPasswordValue}
          autoCapitalize="none"
          onSubmitEditing={handleLoginPress}
          returnKeyType="go"
        />

        {showAdvanced && (
          <Input
            style={{
              marginTop: 12,
              backgroundColor: theme['color-basic-800'],
            }}
            textStyle={{color: theme['color-basic-100']}}
            label={t('login.homeserverInputLabel')}
            placeholder={t('login.homeserverInputPlaceholder')}
            size="large"
            onFocus={() => setHomeserverIsFocused(true)}
            onBlur={() => setHomeserverIsFocused(false)}
            onChangeText={setHomeserverValue}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#808080"
            onSubmitEditing={handleLoginPress}
            returnKeyType="go"
          />
        )}

        {showAdvanced ? (
          <Button
            appearance="ghost"
            style={{marginTop: 12, alignSelf: 'center'}}
            onPress={() => setShowAdvanced(false)}>
            {t('login.basicLabel')}
          </Button>
        ) : (
          <Button
            appearance="ghost"
            style={{marginTop: 12, alignSelf: 'center'}}
            onPress={() => setShowAdvanced(true)}>
            {t('login.advancedLabel')}
          </Button>
        )}

        <View style={{marginTop: 40}}>
          <Button
            disabled={isLoading}
            accessoryLeft={() =>
              isLoading ? <Spinner status="basic" /> : null
            }
            onPress={handleLoginPress}
            size="giant"
            status="info"
            style={{borderRadius: 50}}>
            {t('login.loginButtonLabel')}
          </Button>
        </View>

        {errorText.length > 0 && (
          <Text status="danger" style={{textAlign: 'center', marginTop: 15}}>
            {t('login.somethingWrongError', {errorText: errorText})}
          </Text>
        )}
        <View style={{height: SCREEN_HEIGHT / 2}} />
      </ScrollView>
    </Layout>
  );
}

const BackAction = (props) => (
  <TopNavigationAction
    {...props}
    icon={(style) => (
      <Icon {...style} name="arrow-ios-back" width="35" height="35" />
    )}
  />
);

// const PageMargin = styled.ScrollView`
//   padding-left: 30;
//   padding-right: 30;
//   padding-top: 30;
// `

// const TopBlob = styled(Image)`
//   position: absolute;
//   top: -285;
//   left: -100;
//   z-index: -1;
// `

// const BottomBlob = styled(Image)`
//   position: absolute;
//   bottom: -500;
//   left: -400;
// `

const styles = StyleSheet.create({
  scrollview: {
    padding: 30,
  },
  topBlob: {
    position: 'absolute',
    top: -285,
    left: -100,
    zIndex: -1,
  },
  bottomBlob: {
    position: 'absolute',
    bottom: -500,
    left: -400,
  },
  dittoInput: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 4,
    paddingLeft: 20,
    borderWidth: 1,
    color: 'white',
  },
});
