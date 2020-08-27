import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Layout, Input, Text, Card, Button} from '@ui-kitten/components';
import {matrix} from '@rn-matrix/core';

export default function AuthScreen() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const login = async () => {
    const result = await matrix.loginWithPassword(
      username,
      password,
      null,
      true,
    );
    if (result.error) {
      setError(result.message);
    }
  };

  const Footer = (props: any) => (
    <View {...props} style={[props.style, {alignItems: 'flex-end'}]}>
      <Button onPress={login}>Login</Button>
    </View>
  );

  return (
    <Layout style={styles.wrapper} level="3">
      <Card disabled style={styles.card} footer={Footer}>
        <Input
          label="Username or MXID"
          placeholder="Who are you?"
          autoFocus
          size="large"
          value={username}
          onChangeText={setUsername}
          returnKeyType="next"
          autoCapitalize="none"
          style={{marginBottom: 12}}
        />
        <Input
          label="Password"
          placeholder="Shh, don't tell!"
          secureTextEntry
          size="large"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        {error}
      </Card>
    </Layout>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    alignSelf: 'center',
    minWidth: 400,
  },
});
