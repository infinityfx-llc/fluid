export default {
    ':root': {
        fontSize: '12px'
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