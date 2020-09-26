import {Text, useTheme} from '@ui-kitten/components';
// import { useTheme } from '@ui-kitten/components'
import React, {useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import HtmlRenderer from 'react-native-render-html';
import {htmlEmojis} from '../../../../shared/utilities/emoji';
import {htmlLinks} from '../../../../shared/utilities/misc';

// const debug = require('debug')('rnm:scene:chat:message:components:Html')

const parseHtml = (html: string) => {
  return htmlEmojis(html?.includes('href') ? html : htmlLinks(html));
};

export default function Html({html, isMe = false}) {
  // const styles = getHtmlStyles(theme)
  const theme = useTheme();
  const styles = getHtmlStyles({isMe, theme});
  const [parsedHtml, setParsedHtml] = useState(parseHtml(html));

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const onLinkPress = (e, link: string) => {
    if (link) {
      Linking.canOpenURL(link).then(() => {
        Linking.openURL(link);
      });
    }
  };

  const renderers = {
    emoji: {renderer: emojiRenderer, wrapper: 'Text'},
    ul: {renderer: unorderedListRenderer, wrapper: 'Text'},
  };

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  useEffect(() => {
    if (html === parsedHtml) return;

    setParsedHtml(parseHtml(html));
  }, [html, parsedHtml]);

  return parsedHtml ? (
    <HtmlRenderer
      html={parsedHtml}
      renderers={renderers}
      onLinkPress={onLinkPress}
      renderersProps={{isMe}}
      {...styles}
    />
  ) : null;
}

const emojiRenderer = (
  htmlAttribs,
  children,
  convertedCSSStyles,
  passProps,
) => (
  <Text key={passProps.key} style={{fontFamily: 'NotoColorEmoji'}}>
    {children}
  </Text>
);

const unorderedListRenderer = (
  htmlAttribs,
  children,
  convertedCSSStyles,
  {renderersProps},
) => {
  const color = renderersProps.isMe ? '#fff' : '#fff';
  return children.map((c, i) => (
    <View style={{flexDirection: 'row'}} key={i}>
      <Text style={{color, fontSize: 6, marginTop: 6, marginRight: 6}}>⬤</Text>
      {c}
    </View>
  ));
};

const getHtmlStyles = ({isMe, theme}) => ({
  baseFontStyle: {
    color: isMe ? theme['color-basic-100'] : theme['text-basic-color'],
    fontSize: 16,
    letterSpacing: 0.3,
    fontWeight: '400',
  },
  tagsStyles: {
    blockquote: {
      borderLeftColor: theme['color-primary-500'],
      borderLeftWidth: 3,
      paddingLeft: 10,
      marginVertical: 10,
      opacity: 0.75,
    },
    a: {
      color: isMe
        ? theme['color-basic-100']
        : theme['background-basic-color-1'],
      textDecorationLine: 'underline',
    },
    code: {
      backgroundColor: '#00000025',
    },
  },
});
