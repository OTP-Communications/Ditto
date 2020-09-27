import {Text} from '@ui-kitten/components';
import {useObservableState} from 'observable-hooks';
import React from 'react';
import {StyleSheet} from 'react-native';

// const debug = require('debug')('rnm:scenes:chat:message:components:EventMessage')

export default function EventMessage({message}) {
  const content = useObservableState(message.content$);
  return (
    <Text style={styles.text} category="c2" appearance="hint">
      {content?.text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    marginVertical: 18,
    fontStyle: 'italic',
  },
});
