import React, {useState} from 'react';
import {Layout} from '@ui-kitten/components';
import Sidebar from './components/Sidebar';
import RoomView from './components/RoomView';
import {View} from 'react-native';

export default function AppScreen() {
  const [currentRoom, setCurrentRoom] = useState(null);

  return (
    <Layout level="3" style={{flex: 1, flexDirection: 'row'}}>
      <Sidebar currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
      {currentRoom ? (
        <RoomView currentRoom={currentRoom} />
      ) : (
        <View style={{flex: 3.5}} />
      )}
    </Layout>
  );
}
