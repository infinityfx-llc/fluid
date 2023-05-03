export default {
    '.datetime': {
        fontFamily: 'var(--fluid-font-family)',
        fontSize: '3.4rem',
        lineHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'var(--fluid-clr-text)'
    },

    '.date': {
        fontSize: '0.48em'
    },

    '.datetime[data-halftime="true"] .date': {
        fontSize: '0.66em'
    },

    '.time': {
        display: 'flex',
        alignItems: 'top',
        gap: '0.3rem'
    },

    '.time_postfix': {
        fontSize: '0.4em',
        lineHeight: '1.2em'
    }
}