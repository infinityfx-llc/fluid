export default {
    '.button': {
        border: 'none',
        padding: 0,
        // backgroundColor: 'transparent',
        backgroundColor: 'var(--fluid-clr-primary-100)',
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
        width: '2rem',
        height: '2rem'
    },

    '.med .icon': {
        width: '2.4rem',
        height: '2.4rem'
    },

    '.lrg .icon': {
        width: '3rem',
        height: '3rem'
    },

    '.button.round': {
        borderRadius: '999px'
    }
}