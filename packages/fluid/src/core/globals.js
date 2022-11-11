export const DEFAULT_COLOR_SCHEME = 'light';

export const COLOR_SCHEMES = {
    light: {
        primary: ['#16E9B1'],
        accent: ['#FF9625'],
        background: ['#EEEEEE'],
        foreground: ['#FFFFFF'],
        grey: ['#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6'],
        light: ['#ffffff', '#f2ece6', '#e6e0da'],
        dark: ['#000000', '#1c1f1e', '#383d3c'],
        text: '#000000'
    },
    dark: {
        primary: ['#16E9B1'],
        accent: ['#FF9625'],
        background: ['#000000'],
        foreground: ['#272727'],
        grey: ['#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6'],
        light: ['#ffffff', '#f2ece6', '#e6e0da'],
        dark: ['#000000', '#1c1f1e', '#383d3c'],
        text: '#FFFFFF'
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
        xlg: '1.8em'
    },
    font: {
        family: 'Poppins',
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
    },
    fonts: {
        Poppins: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap'
    },
    screens: {
        mob: [0, 480],
        tab: [481, 768],
        lap: [769, 1024],
        dsk: [1025, 1200],
        tlv: [1201]
    }
};