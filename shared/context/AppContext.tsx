import React, {createContext, useEffect, useState} from 'react';
import {
  getItemFromStorage,
  saveItemToStorage,
} from '../../shared/utilities/storage';

export const AppContext = createContext({
  errorReportingEnabled: false,
  setErrorReportingEnabled: () => {},
});

export default function AppContextProvider({children}) {
  const [errorReportingEnabled, setErrorReportingEnabled] = useState(false);

  useEffect(() => {
    getItemFromStorage('@ditto-error-reporting').then((reporting) => {
      if (reporting) {
        setErrorReportingEnabled(reporting);
      }
    });
  }, []);

  useEffect(() => {
    saveItemToStorage('@ditto-error-reporting', errorReportingEnabled);
  }, [errorReportingEnabled]);

  return (
    <AppContext.Provider
      value={{errorReportingEnabled, setErrorReportingEnabled}}>
      {children}
    </AppContext.Provider>
  );
}
