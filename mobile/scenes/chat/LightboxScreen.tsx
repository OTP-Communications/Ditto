import {Button, Icon, Text, useTheme} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React, {useState} from 'react';
import {
  Pressable,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';

export default function LightboxScreen({navigation, route}) {
  const message = route.params?.message;
  if (!message) navigation.goBack();

  const theme = useTheme();
  const content = useObservableState(message.content$);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!content) return null;

  const {width, height} = content.full;

  const saveImage = async () => {
    setSaving(true);
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
    })
      .fetch('GET', content.full.url)
      .then((res) => {
        CameraRoll.saveToCameraRoll(res.data, 'photo')
          .then((res) => {
            console.log(res);
            finishSaving();
          })
          .catch((err) => {
            console.log(err);
            finishSaving();
          });
      })
      .catch((error) => {
        console.log(error);
        finishSaving();
      });
  };

  const finishSaving = () => {
    setSaved(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(false);
    }, 1000);
  };

  return (
    <>
      <Header saveImage={saveImage} goBack={navigation.goBack} />
      <View
        style={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {saving && <SaveToast saved={saved} theme={theme} />}
        <ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height - 200}
          imageWidth={width}
          imageHeight={height}
          useNativeDriver={true}>
          <Image
            style={{width, height}}
            source={{
              uri: content.full.url,
            }}
          />
        </ImageZoom>
      </View>
    </>
  );
}

function Header({saveImage, goBack}) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Button
        onPress={saveImage}
        appearance="ghost"
        accessoryLeft={(props) => (
          <Icon
            {...props}
            fill={theme['text-basic-color']}
            name="download"
            width={30}
            height={30}
          />
        )}
      />
      <Pressable
        onPress={goBack}
        style={({pressed}) => ({
          marginRight: 18,
          opacity: pressed ? 0.4 : 1,
        })}>
        <Text category="s1" style={{fontSize: 18}}>
          Done
        </Text>
      </Pressable>
    </View>
  );
}

function SaveToast({saved, theme}) {
  return (
    <View
      style={{
        backgroundColor: theme['color-basic-800'],
        position: 'absolute',
        width: 150,
        height: 150,
        zIndex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.85,
      }}>
      {saved ? (
        <Button
          appearance="ghost"
          accessoryLeft={(props) => (
            <Icon
              {...props}
              fill={'#fff'}
              name="checkmark"
              width={60}
              height={60}
            />
          )}
        />
      ) : (
        <ActivityIndicator
          color="#fff"
          size="large"
          style={{marginBottom: 18}}
        />
      )}
      <Text category="h6" style={{color: '#fff'}}>
        {saved ? 'Saved' : 'Saving...'}
      </Text>
    </View>
  );
}
