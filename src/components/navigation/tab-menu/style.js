export default {
    '.menu': {
        display: 'flex',
        height: 'fit-content'
    },
    
    '.option': {
        position: 'relative',
        padding: '0.6em'
    },

    '.button': {
        border: 'none',
        padding: '0.6em 0.8em',
        backgroundColor: 'transparent',
        fontFamily: 'var(--fluid-font-family)',
        fontSize: 'var(--fluid-font-size-sml)',
        fontWeight: 'var(--fluid-font-weight-reg)',
        color: 'var(--fluid-clr-text)',
        cursor: 'pointer',
        transition: 'color .35s'
    },

    '.line': {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: '3px',
        width: '100%',
        backgroundColor: 'var(--fluid-clr-primary-100)',
        borderRadius: '999px'
    },

    '.button[data-active="true"]': {
        color: 'var(--fluid-clr-primary-100)'
    }
}