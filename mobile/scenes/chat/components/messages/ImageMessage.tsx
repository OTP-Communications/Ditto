import {useTheme, Text, Icon} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {Pressable, Image, View} from 'react-native';
import i18n from '../../../../../shared/i18n';
import MessageWrapper from '../MessageWrapper';

function ImageMessage(props) {
  const {
    message,
    prevSame,
    nextSame,
    isMe,
    onPress = () => {},
    onLongPress = () => {},
  } = props;

  const theme = useTheme();
  const content = useObservableState(message.content$);

  if (!content) return null;

  const sharpRadius = 6;
  const imageStyles = {
    alignSelf: 'flex-end',
    overflow: 'hidden',
    height:
      content.thumb?.height && !isNaN(content.thumb.height)
        ? content.thumb.height
        : 250,
    width:
      content.thumb?.width && !isNaN(content.thumb.width)
        ? content.thumb.width
        : '100%',
    maxHeight: 250,
    backgroundColor: theme['background-basic-color-3'],
    borderRadius: 20,
    ...(prevSame && isMe ? {borderTopRightRadius: sharpRadius} : {}),
    ...(prevSame && !isMe ? {borderTopLeftRadius: sharpRadius} : {}),
    ...(nextSame && isMe ? {borderBottomRightRadius: sharpRadius} : {}),
    ...(nextSame && !isMe ? {borderBottomLeftRadius: sharpRadius} : {}),
  };

  const PlaceHolderIcon = ({showError}) => (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icon
        name="image-outline"
        fill={theme['color-basic-700']}
        style={{
          width: 64,
          height: 64,
        }}
      />
      {showError && <Text>{i18n.t('chat:messages.failedToLoadImage')}</Text>}
    </View>
  );

  const ImageThumbnail = () => (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({pressed}) => ({
        opacity: pressed ? 0.5 : 1,
      })}>
      <View style={imageStyles}>
        <PlaceHolderIcon />
        <Image
          resizeMode="contain"
          source={{uri: content.thumb.url}}
          style={{flex: 1}}
        />
      </View>
    </Pressable>
  );

  const FailedLoadingImage = () => (
    <View style={imageStyles}>
      <PlaceHolderIcon showError />
    </View>
  );

  return (
    <MessageWrapper {...props}>
      {content.thumb?.url ? <ImageThumbnail /> : <FailedLoadingImage />}
    </MessageWrapper>
  );
}

const isEqual = (prevProps, nextProps) => {
  return (
    prevProps.message.content$.getValue() ===
    nextProps.message.content$.getValue()
  );
};

export default React.memo(ImageMessage, isEqual);
