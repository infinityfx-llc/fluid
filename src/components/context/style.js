import React from 'react';
import { createContext } from 'react';

export const StyleContext = createContext();

export function StyleProvider({ children, stylesheet }) {

    return <StyleContext.Provider value={stylesheet}>
        {children}
    </StyleContext.Provider>;
}