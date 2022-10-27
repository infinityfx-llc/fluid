export default {
    '.button': {
        border: 'none',
        padding: 0,
        backgroundColor: 'transparent',
        // backgroundColor: 'var(--fluid-clr-primary-100)',
        height: 'fit-content',
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 'var(--fluid-radius-sml)',
        transition: 'background-color .15s'
    },

    '.button:hover': {
        backgroundColor: 'var(--fluid-clr-foreground-100)',
    },

    '.icon': {
        color: 'var(--fluid-clr-text)'
    },

    '.sml .icon': {
        padding: '0.6rem',
        width: '2rem',
        height: '2rem'
    },

    '.med .icon': {
        padding: '0.8rem',
        width: '2.6rem',
        height: '2.6rem'
    },

    '.lrg .icon': {
        padding: '1.2rem',
        width: '3.4rem',
        height: '3.4rem'
    },

    '.button.round': {
        borderRadius: '999px'
    }
}