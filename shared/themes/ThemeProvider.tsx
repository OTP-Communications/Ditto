import React, {useState} from 'react';
import * as eva from '@eva-design/eva';
import dittoDarkTheme from './dittoDark.json';

const themes = {
  dittoDark: {...eva.dark, ...dittoDarkTheme},
  light: {},
  dark: {},
};

export const ThemeContext = React.createContext({
  theme: themes.dittoDark,
  setTheme: (theme: 'light' | 'dark' | 'dittoDark') => {},
});

export default function ThemeProvider({children}: {children: JSX.Element}) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'dittoDark'>(
    'dittoDark',
  );
  const currentTheme: any = themes[theme];

  return (
    <ThemeContext.Provider value={{theme: currentTheme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}
