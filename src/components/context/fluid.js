import React, { createContext, useEffect, useInsertionEffect, useMemo } from 'react';
import { DEFAULT_COLOR_SCHEME, DEFAULT_THEME } from '@core/globals';
import Stylesheet from '@core/stylesheet';
import useColorScheme from '@hooks/color-scheme';
import { cloneMergeDeep } from '@core/utils/helper';
import { StyleProvider } from './style';
import { parseVariables } from '@core/utils/css';
import('@styles/globals.css');

export const FluidContext = createContext();

const stylesheet = new Stylesheet();

export function FluidProvider({ children, theme }) {
    const [colorScheme, setColorScheme] = useColorScheme();

    const fluid = useMemo(() => {
        const fluid = cloneMergeDeep(DEFAULT_THEME, theme);
        fluid.colors = fluid.schemes[colorScheme] || fluid.schemes[DEFAULT_COLOR_SCHEME];
        fluid.colorScheme = colorScheme;
        fluid.setColorScheme = setColorScheme;

        return fluid;
    }, [colorScheme, theme]);

    useInsertionEffect(() => {
        const vars = { '--fluid-font-family': fluid.font.family };
        parseVariables(fluid.colors, 'fluid-clr', vars);
        parseVariables(fluid.spacing, 'fluid-gap', vars);
        parseVariables(fluid.radii, 'fluid-radius', vars);
        parseVariables(fluid.font.sizes, 'fluid-font-size', vars);
        parseVariables(fluid.font.weights, 'fluid-font-weight', vars);
        stylesheet.insert('global', {
            ':root': vars
        });
    }, [fluid]);

    useInsertionEffect(() => {
        stylesheet.inject();

        return () => stylesheet.remove();
    }, []);

    return <FluidContext.Provider value={fluid}>
        <StyleProvider stylesheet={stylesheet}>
            <div id="fluid__root">
                {children}
            </div>
        </StyleProvider>
    </FluidContext.Provider>;
}

FluidProvider.defaultProps = {
    theme: {}
};

// settings:
// themes: { themename: etc.. }
// breakpoints