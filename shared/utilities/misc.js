import {Platform} from 'react-native';
import Color from 'color';

export const isIos = () => {
  return Platform.OS === 'ios';
};

export const isAndroid = () => {
  return Platform.OS === 'android';
};

export const isWeb = () => {
  return Platform.OS === 'web';
};

var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
export function htmlLinks(html) {
  return html ? html.replace(urlRegex, '<a href="$&">$&</a>') : html;
}

export function getNameColor(name, themeId = 'light') {
  const code = hashCode(name);
  const hex = intToHex(code);
  let col = Color(`#${hex}`);
  if (col.isDark() && themeId === 'dark') {
    col = col.lighten(0.4);
  }
  if (col.isLight() && themeId === 'light') {
    col = col.darken(0.4);
  }
  return col.hex();
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToHex(i) {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();
  return '00000'.substring(0, 6 - c.length) + c;
}

export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};