export default {
    ':root': {
        fontSize: '12px',
        // '--fluid-clr-primary-100': '#16E9B1',
        // '--fluid-clr-accent-100': '#FF9625',
        // '--fluid-clr-background-100': '#EEEEEE',
        // '--fluid-clr-foreground-100': '#FFFFFF',
        // '--fluid-clr-text-100': '#000000',
        // '--fluid-gap-xxs': '.4em',
        // '--fluid-gap-xsm': '.6em',
        // '--fluid-gap-sml': '.8em',
        // '--fluid-gap-med': '1.4em',
        // '--fluid-gap-lrg': '2.4em',
        // '--fluid-gap-xlg': '3.6em',
        // '--fluid-gap-xxl': '4.8em',
        // '--fluid-radius-xsm': '.15em',
        // '--fluid-radius-sml': '.3em',
        // '--fluid-radius-med': '.6em',
        // '--fluid-radius-lrg': '1em',
        // '--fluid-radius-xlg': '1.8em',
        // '--fluid-radius-max': '9999px',
        // '--fluid-font-size-xxs': '.8rem',
        // '--fluid-font-size-xsm': '.9rem',
        // '--fluid-font-size-sml': '1.1rem',
        // '--fluid-font-size-med': '1.3rem',
        // '--fluid-font-size-lrg': '1.8rem',
        // '--fluid-font-size-xlg': '2.8rem',
        // '--fluid-font-size-xxl': '4rem',
        // '--fluid-font-weight-thn': 300,
        // '--fluid-font-weight-lgt': 400,
        // '--fluid-font-weight-reg': 500,
        // '--fluid-font-weight-med': 600,
        // '--fluid-font-weight-bld': 700,
        // '--fluid-font-weight-blk': 900
    },

    '*': {
        outline: 'none'
    },

    'body, form': {
        margin: 0,
        padding: 0
    },

    body: {
        minHeight: '100vh',
        backgroundColor: 'var(--fluid-clr-background-100)',
        fontFamily: 'var(--font-family), Tahoma, Verdana, sans serif',
        fontSize: 'var(--font-size-s)',
        '-webkit-font-smoothing': 'antialiased',
        overflowWrap: 'break-word',
        hyphens: 'auto',
    },

    'img, picture, video, canvas, svg': {
        display: 'block',
        maxWidth: '100%'
    },

    'input, button, textarea, select': {
        font: 'inherit'
    },

    a: {
        textDecoration: 'none',
        color: 'inherit'
    }
};