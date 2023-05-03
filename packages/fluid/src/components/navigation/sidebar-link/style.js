export default {
    '.link': {
        position: 'relative',
        padding: 'var(--fluid-gap-xsm)',
        fontSize: 'var(--fluid-font-size-med)',
        fontFamily: 'var(--fluid-font-family)',
        color: 'var(--fluid-clr-text)',
        cursor: 'pointer',
        display: 'flex'
    },

    '.link[data-active="true"]': {
        color: 'var(--fluid-clr-primary-100)'
    },

    '.focus': {
        display: 'flex',
        padding: 'var(--fluid-gap-xsm)'
    },

    '.icon': {
        width: '2rem',
        height: '2rem'
    },

    '.line': {
        width: '4px',
        height: 'inherit',
        marginLeft: 'var(--fluid-gap-xsm)',
        backgroundColor: 'var(--fluid-clr-primary-100)',
        borderRadius: '999px'
    }
}