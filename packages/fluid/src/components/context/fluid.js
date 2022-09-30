import React, { createContext, useInsertionEffect, useMemo } from 'react';
import { DEFAULT_COLOR_SCHEME, DEFAULT_THEME } from '@core/globals';
import useColorScheme from '@hooks/color-scheme';
import { cloneMergeDeep } from '@core/utils/helper';
import { parseVariables } from '@core/utils/css';
import useStylesheet from '@hooks/stylesheet';
import useGlobalStyles from '@hooks/global-styles';
import('@styles/globals.css');

export const FluidContext = createContext();

export function FluidProvider({ children, theme }) {
    const stylesheet = useStylesheet();
    const [colorScheme, setColorScheme] = useColorScheme();

    const fluid = useMemo(() => {
        const fluid = cloneMergeDeep(DEFAULT_THEME, theme);
        fluid.colors = fluid.schemes[colorScheme] || fluid.schemes[DEFAULT_COLOR_SCHEME];
        fluid.colorScheme = colorScheme;
        fluid.setColorScheme = setColorScheme;

        return fluid;
    }, [colorScheme, theme]);

    useGlobalStyles(() => {
        const vars = { '--fluid-font-family': fluid.font.family };
        parseVariables(fluid.colors, 'fluid-clr', vars);
        parseVariables(fluid.spacing, 'fluid-gap', vars);
        parseVariables(fluid.radii, 'fluid-radius', vars);
        parseVariables(fluid.font.sizes, 'fluid-font-size', vars);
        parseVariables(fluid.font.weights, 'fluid-font-weight', vars);

        return { ':root': vars };
    });

    useInsertionEffect(() => {
        stylesheet.hydrate();

        return () => stylesheet.cleanup();
    }, [fluid]);

    return <FluidContext.Provider value={fluid}>
        <div id="fluid__root">
            {children}
        </div>
    </FluidContext.Provider>;
}

FluidProvider.defaultProps = {
    theme: {}
};

// settings:
// themes: { themename: etc.. }
// breakpoints
// font preloading