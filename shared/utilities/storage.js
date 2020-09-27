import AsyncStorage from '@react-native-community/async-storage';

export const saveItemToStorage = async (key, value) => {
  return AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getItemFromStorage = async (key) => {
  const value = await AsyncStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};
