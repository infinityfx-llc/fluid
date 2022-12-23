export default {
    '.frame': {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--fluid-radius-med)'
    },

    '.frame > *' : {
        objectFit: 'cover',
        width: '100%',
        height: '100%'
    },

    '.frame[data-size="sml"]': {
        width: '24rem',
    },

    '.frame[data-size="med"]': {
        width: '36rem',
    },

    '.frame[data-size="lrg"]': {
        width: '48rem',
    },

    '.footnote': {
        fontFamily: 'var(--fluid-font-family)',
        fontSize: 'var(--fluid-font-size-sml)',
        marginTop: 'var(--fluid-gap-xsm)',
        color: 'var(--fluid-clr-text)'
    },

    '.frame::before' : {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundColor: 'var(--fluid-clr-grey-500)',
        transition: 'opacity .35s',
        pointerEvents: 'none',
        animation: 'frame-load-blink 0.8s infinite alternate',
        zIndex: 1
    },

    '@keyframes frame-load-blink': {
        '0%': {
            backgroundColor: 'var(--fluid-clr-grey-500)'
        },
        '100%': {
            backgroundColor: 'var(--fluid-clr-grey-600)'
        }
    },

    '.frame[data-loaded="true"]::before': {
        opacity: 0
    }
}