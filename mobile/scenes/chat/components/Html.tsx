import {Text, useTheme} from '@ui-kitten/components';
import React, {useContext, useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import HtmlRenderer from 'react-native-render-html';
import Spacing from '../../../../shared/styles/Spacing';
import {ThemeContext} from '../../../../shared/themes/ThemeProvider';
import ThemeType from '../../../../shared/themes/themeType';
import {htmlEmojis} from '../../../../shared/utilities/emoji';
import {htmlLinks, getNameColor} from '../../../../shared/utilities/misc';
import {matrix} from '@rn-matrix/core';

// const debug = require('debug')('rnm:scene:chat:message:components:Html')

const parseHtml = (html: string) => {
  return htmlEmojis(html?.includes('href') ? html : htmlLinks(html));
};

export default function Html({html, isMe = false}) {
  const theme: ThemeType = useTheme();
  const {themeId} = useContext(ThemeContext);
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
    'mx-reply': {renderer: replyRenderer, wrapper: 'View'},
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
      renderersProps={{isMe, theme, parsedHtml, themeId}}
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

const replyRenderer = (
  htmlAttribs,
  children,
  convertedCSSStyles,
  {key, renderersProps},
) => {
  const {theme, parsedHtml, themeId} = renderersProps;
  const senderId = parsedHtml
    ?.slice(parsedHtml.lastIndexOf('@'), parsedHtml.lastIndexOf('</a>'))
    ?.trim();
  const senderName = matrix.getUserById(senderId)?.name$.getValue();
  return (
    <View
      key={key}
      style={{
        borderLeftWidth: 3,
        borderColor: theme['color-primary-default'],
        padding: Spacing.xs,
        paddingLeft: 8,
        marginVertical: Spacing.s,
      }}>
      <View style={{opacity: 0.75}}>
        <Text
          style={{
            fontWeight: 'bold',
            marginBottom: 3,
            color: getNameColor(senderId, themeId),
          }}>
          {senderName}
        </Text>
        <Text>
          {parsedHtml
            ?.slice(
              parsedHtml.indexOf('<br>') + 4,
              parsedHtml.indexOf('</blockquote>'),
            )
            ?.trim()}
        </Text>
      </View>
    </View>
  );
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
      borderLeftColor: isMe
        ? theme['color-basic-100']
        : theme['color-primary-default'],
      borderLeftWidth: 3,
      padding: Spacing.xs,
      paddingLeft: 8,
      marginVertical: Spacing.s,
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
    p: {},
  },
});
