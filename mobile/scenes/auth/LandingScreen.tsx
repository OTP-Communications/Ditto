import {useNavigation} from '@react-navigation/native';
import {Button, Layout, useTheme} from '@ui-kitten/components';
import React from 'react';
// import { useTranslation } from 'react-i18next'
import {StatusBar, StyleSheet, Image, Text} from 'react-native';

import Wordmark from '../../../shared/assets/svg/wordmark.svg';

const middleBlob = require('../../../shared/assets/images/blob1.png');
const topBlob = require('../../../shared/assets/images/blob2.png');
const bottomBlob = require('../../../shared/assets/images/blob3.png');

StatusBar.setBarStyle('light-content');

export default function LandingScreen() {
  const navigation = useNavigation();

  // const { t } = useTranslation('auth')

  const handleLoginPress = () => navigation.navigate('Login');

  return (
    <Layout
      level="4"
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image source={topBlob} style={blobs.top} />
      <Image source={middleBlob} style={blobs.middle} />
      <Image source={bottomBlob} style={blobs.bottom} />
      <Text
        style={{
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 100,
          opacity: 0.8,
        }}>
        ditto
      </Text>
      {/* <Wordmark width={200} height={100} fill={theme['text-basic-color']} /> */}
      <Button
        onPress={handleLoginPress}
        size="giant"
        status="info"
        style={{
          borderRadius: 50,
          width: 200,
          marginTop: 300,
        }}>
        {/* {t('landing.loginButtonLabel')} */}
        LOGIN
      </Button>
    </Layout>
  );
}

const blobs = StyleSheet.create({
  top: {
    position: 'absolute',
    top: -80,
    right: -100,
  },
  middle: {
    position: 'absolute',
    top: -220,
    left: -420,
  },
  bottom: {
    position: 'absolute',
    bottom: -340,
    left: -220,
  },
});

// const Wordmark = styled(WordmarkFile)`
//   margin-top: 150;
//   margin-left: 30;
// `;
