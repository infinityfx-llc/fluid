export const DEFAULT_COLOR_SCHEME = 'light';

export const COLOR_SCHEMES = {
    light: {
        primary: ['#16E9B1'],
        accent: ['#FF9625'],
        background: ['#EEEEEE'],
        foreground: ['#FFFFFF'],
        text: ['#000000']
    },
    dark: {
        primary: ['#16E9B1'],
        accent: ['#FF9625'],
        background: ['#000000'],
        foreground: ['#272727'],
        text: ['#FFFFFF']
    }
};

export const DEFAULT_THEME = {
    schemes: COLOR_SCHEMES,
    spacing: {
        xxs: '.4em',
        xsm: '.6em',
        sml: '.8em',
        med: '1.4em',
        lrg: '2.4em',
        xlg: '3.6em',
        xxl: '4.8em'
    },
    radii: {
        xsm: '.15em',
        sml: '.3em',
        med: '.6em',
        lrg: '1em',
        xlg: '1.8em',
        max: '9999px',
    },
    font: {
        family: '"Poppins", sans serif',
        sizes: {
            xxs: '.8rem',
            xsm: '.9rem',
            sml: '1.1rem',
            med: '1.3rem',
            lrg: '1.8rem',
            xlg: '2.8rem',
            xxl: '4em'
        },
        weights: {
            thn: 300,
            lgt: 400,
            reg: 500,
            med: 600,
            bld: 700,
            blk: 900
        }
    }
};