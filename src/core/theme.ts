import { FluidBreakpoint, FluidColorScheme, FluidStyles } from "../types";

export type PartialFluidTheme = {
    palettes?: {
        [key: string]: {
            primary?: string[];
            accent?: string[];
            grey?: string[];
            heading?: string[];
            text?: string[];
            bg?: string[];
            fg?: string[];
            error?: string[];
        }
    },
    defaultColorScheme?: string;
    spacing?: {
        xxs?: string;
        xsm?: string;
        sml?: string;
        med?: string;
        lrg?: string;
        xlg?: string;
        xxl?: string;
    },
    radius?: {
        xsm?: string;
        sml?: string;
        med?: string;
        lrg?: string;
        xlg?: string;
    },
    font?: {
        family?: string,
        size?: {
            xxs?: string;
            xsm?: string;
            sml?: string;
            med?: string;
            lrg?: string;
            xlg?: string;
            xxl?: string;
        }
    },
    breakpoints?: {
        [key in FluidBreakpoint]?: number;
    }
};

export type FluidTheme = {
    palettes: {
        [key: string]: {
            primary?: string[];
            accent?: string[];
            grey?: string[];
            heading?: string[];
            text?: string[];
            bg?: string[];
            fg?: string[];
            error?: string[];
        }
    },
    defaultColorScheme: FluidColorScheme;
    spacing: {
        xxs: string;
        xsm: string;
        sml: string;
        med: string;
        lrg: string;
        xlg: string;
        xxl: string;
    },
    radius: {
        xsm: string;
        sml: string;
        med: string;
        lrg: string;
        xlg: string;
    },
    font: {
        family: string,
        size: {
            xxs: string;
            xsm: string;
            sml: string;
            med: string;
            lrg: string;
            xlg: string;
            xxl: string;
        }
    },
    breakpoints: {
        [key in FluidBreakpoint]: number;
    }
}

export const DEFAULT_THEME = {
    palettes: {
        light: {
            primary: ['#22e39f', '#45e6ad', '#60f0bd', '#8cf5d0', '#baf7e2', '#dcfcf1'],
            accent: ['#1dddf2'],
            grey: ['#e6e6e6', '#cccccc', '#b3b3b3', '#999999', '#808080', '#666666', '#4d4d4d', '#333333', '#191919'],
            heading: ['#000000'],
            text: ['#000000', '#ffffff'],
            bg: ['#f7f6f5', '#ffffff'],
            fg: ['#f2edeb', '#ede6e4'],
            error: ['#ff1f1f', '#ff5454', '#ff8c8c', '#ffbdbd']
        },
        dark: {
            primary: ['#1dddf2', '#1ac4d6', '#15a1b0', '#0e838f', '#064f57', '#043136'],
            accent: ['#22e39f'],
            grey: ['#191919', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6'],
            heading: ['#ffffff'],
            text: ['#ffffff', '#000000'],
            bg: ['#000000', '#171616'],
            fg: ['#212020', '#2e2c2c'],
            error: ['#ff1f1f', '#b32727', '#822f2f', '#632c2c']
        }
    },
    defaultColorScheme: 'light' as const,
    spacing: {
        xxs: '.2rem',
        xsm: '.4rem',
        sml: '.7rem',
        med: '1rem',
        lrg: '2rem',
        xlg: '4rem',
        xxl: '8rem'
    },
    radius: {
        xsm: '3px',
        sml: '4px',
        med: '8px',
        lrg: '12px',
        xlg: '16px'
    },
    font: {
        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue"',
        size: {
            xxs: '.7rem',
            xsm: '.825rem',
            sml: '1rem',
            med: '1.2rem',
            lrg: '1.7rem',
            xlg: '2.5rem',
            xxl: '4rem'
        }
    },
    breakpoints: {
        mob: 480,
        tab: 768,
        lap: 1024,
        dsk: 1280
    }
}

function insertVariables(prefix: string, map: { [key: string]: any } | any[], variables: { [key: string]: string }) {
    const arr = Array.isArray(map) ? map : Object.entries(map);

    for (let i = 0; i < arr.length; i++) {
        const key = Array.isArray(arr[i]) ? arr[i][0] : (i + 1) * 100;

        variables[`--f-${prefix}-${key}`] = Array.isArray(arr[i]) ? arr[i][1] : arr[i];
    }
}

export function parseCSSVariables<T extends FluidTheme>(theme: T) {
    const vars: { [key: string]: string } = {
        '--f-font-family': theme.font.family
    };

    insertVariables('spacing', theme.spacing, vars);
    insertVariables('radius', theme.radius, vars);
    insertVariables('font-size', theme.font.size, vars);

    return vars;
}

export function parseColorPalettes<T extends FluidTheme>(theme: T) {
    const ruleset: FluidStyles = {};
    const mediaset: FluidStyles = {};

    for (const name in theme.palettes) {
        const vars = {};
        for (const key in theme.palettes[name]) {
            insertVariables(`clr-${key}`, theme.palettes[name][key as never], vars);
        }

        let key = `#__fluid.scheme-${name}`;
        if (theme.defaultColorScheme === name) key += ', #__fluid.scheme-system';
        ruleset[key] = vars;

        if (name === 'light' || name === 'dark') {
            mediaset[`@media(prefers-color-scheme: ${name})`] = {
                '#__fluid.scheme-system': vars
            };
        }
    }

    return Object.assign(ruleset, mediaset);
}

export const COLOR_SCHEME_COOKIE = 'FLUID_PREF_COLOR_SCHEME';