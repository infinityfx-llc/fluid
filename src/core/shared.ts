import { FluidComponents, FluidSelectorStyles, Selectors } from "../types";
import { FluidIcon } from "./icons";
import { DEFAULT_THEME, FluidTheme } from "./theme";

export const GLOBAL_CONTEXT: {
    styles: {
        [key: string]: {
            rules: string;
            selectors: Selectors;
        };
    };
    components: FluidComponents & {
        [key: string]: FluidSelectorStyles<Selectors>;
    };
    dependents: {
        [key: string]: string[];
    };
    theme: FluidTheme;
    paths: string[];
    cssOutput: 'automatic' | 'manual';
    icons: {
        [key in FluidIcon]?: React.JSXElementConstructor<any>;
    };
    rawConfig: string;
    isDev: boolean;
    isInternal: boolean;
    name: string;
    version: string;
} = {
    styles: {},
    components: {},
    dependents: {},
    theme: DEFAULT_THEME,
    paths: [
        './src/**/*.{jsx,tsx}',
        './app/**/*.{jsx,tsx}',
        './pages/**/*.{jsx,tsx}',
        './components/**/*.{jsx,tsx}'
    ],
    cssOutput: 'automatic',
    icons: {},
    rawConfig: '',
    isDev: false,
    isInternal: false,
    name: '',
    version: ''
};