export type FluidTheme = {
    palettes: {
        [key: string]: {
            primary: string[];
            accent: string[];
            grey: string[];
            text: string[];
            bg: string[];
            fg: string[];
            error: string[];
        }
    },
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
    breakpoints: number[]
}

export const DEFAULT_THEME: FluidTheme = {
    palettes: {
        light: {
            primary: ['#22e39f', '#45e6ad', '#60f0bd', '#8cf5d0', '#baf7e2', '#dcfcf1'],
            accent: ['#1dddf2'],
            grey: ['#e6e6e6', '#cccccc', '#b3b3b3', '#999999', '#808080', '#666666', '#4d4d4d', '#333333', '#191919'],
            text: ['#000', '#fff'],
            bg: ['#fff'],
            fg: ['#f0f7f7'],
            error: ['#ff1f1f', '#ff5454', '#ff8c8c', '#ffbdbd']
        },
        dark: {
            primary: ['#000'],
            accent: ['#000'],
            grey: ['#000'],
            text: ['#000'],
            bg: ['#000'],
            fg: ['#000'],
            error: ['red']
        }
    },
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
        family: 'sans-serif',
        size: {
            xxs: '.7rem',
            xsm: '.85rem',
            sml: '1rem',
            med: '1.25rem',
            lrg: '1.7rem',
            xlg: '2.5rem',
            xxl: '4rem'
        }
    },
    breakpoints: [480, 768, 1024, 1200]
}

function insertVariables(prefix: string, map: { [key: string]: any } | any[], variables: { [key: string]: string }) {
    const arr = Array.isArray(map) ? map : Object.entries(map);

    for (let i = 0; i < arr.length; i++) {
        const key = Array.isArray(arr[i]) ? arr[i][0] : (i + 1) * 100;

        variables[`--f-${prefix}-${key}`] = Array.isArray(arr[i]) ? arr[i][1] : arr[i];
    }
}

export function parseCSSVariables(theme: FluidTheme) {
    const vars: { [key: string]: string } = {
        '--f-font-family': theme.font.family
    };

    insertVariables('spacing', theme.spacing, vars);
    insertVariables('radius', theme.radius, vars);
    insertVariables('font-size', theme.font.size, vars);
    insertVariables('breakpoint', theme.breakpoints, vars);

    return vars;
}

export function parseColorPalettes(theme: FluidTheme) {
    const ruleset: {
        [key: string]: React.CSSProperties;
    } = {};

    for (const name in theme.palettes) {
        const vars = {};
        for (const key in theme.palettes[name]) {
            insertVariables(`clr-${key}`, theme.palettes[name][key as never], vars);
        }

        ruleset[`body.scheme-${name}`] = vars;
    }

    // prefers-color-scheme @media

    return ruleset;
}