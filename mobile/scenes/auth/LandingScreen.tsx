import {useNavigation} from '@react-navigation/native';
import {Button, Layout, useTheme} from '@ui-kitten/components';
import React from 'react';
import {StatusBar, StyleSheet, Image, Text} from 'react-native';

import Wordmark from '../../../shared/assets/svg/wordmark.svg';
import i18n from '../../../shared/i18n';

const middleBlob = require('../../../shared/assets/images/blob1.png');
const topBlob = require('../../../shared/assets/images/blob2.png');
const bottomBlob = require('../../../shared/assets/images/blob3.png');

StatusBar.setBarStyle('light-content');

export default function LandingScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleLoginPress = () => navigation.navigate('Login');

  return (
    <Layout
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme['color-basic-1000'],
      }}>
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
        {i18n.t('auth:landing.loginButtonLabel')}
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
