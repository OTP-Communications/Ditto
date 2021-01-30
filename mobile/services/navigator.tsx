import {StackActions} from '@react-navigation/native';
import React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function navPush(name, params) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}
