export default {
    '.segmented': {
        position: 'relative',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        fontSize: 'var(--fluid-font-size-med)',
        fontWeight: 'var(--fluid-font-weight-med)',
        display: 'flex',
        borderRadius: '999px'
    },

    '.segmented input': {
        display: 'none'
    },

    '.segment': {
        padding: '1em 2em',
        borderRadius: '999px',
        cursor: 'pointer',
        zIndex: 1
    },

    '.segment.disabled': {
        cursor: 'default',
        color: 'var(--fluid-clr-grey-200)'
    },

    '.selectors': {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        color: 'transparent',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    
    '.selection': {
        padding: '1em 2em',
        borderRadius: '999px',
        backgroundColor: 'var(--fluid-clr-primary-100)',
        boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)'
    }
}