import React, {useState} from 'react';
import * as eva from '@eva-design/eva';
import dittoDarkTheme from './dittoDark.json';
import dittoLightTheme from './dittoLight.json';

const themes = {
  light: {...eva.light, ...dittoLightTheme},
  dark: {...eva.dark, ...dittoDarkTheme},
};

const initialTheme = 'dark';

export const ThemeContext = React.createContext({
  themeId: initialTheme,
  theme: themes.light,
  setTheme: (theme: 'light' | 'dark') => {},
});

export default function ThemeProvider({children}: {children: JSX.Element}) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const currentTheme: any = themes[theme];

  return (
    <ThemeContext.Provider
      value={{themeId: theme, theme: currentTheme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}
