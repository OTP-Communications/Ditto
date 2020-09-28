import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const lightHaptic = () => {
  ReactNativeHapticFeedback.trigger('impactLight', options);
};

export const mediumHaptic = () => {
  ReactNativeHapticFeedback.trigger('impactMedium', options);
};

export const heavyHaptic = () => {
  ReactNativeHapticFeedback.trigger('impactHeavy', options);
};
