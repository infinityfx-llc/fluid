export default {
    '.segmented': {
        position: 'relative',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        fontSize: 'var(--fluid-font-size-med)',
        fontWeight: 'var(--fluid-font-weight-med)',
        color: 'var(--fluid-clr-text)',
        display: 'flex',
        height: 'fit-content',
        borderRadius: 'var(--fluid-radius-sml)'
    },

    '.segmented.round': {
        borderRadius: '999px'
    },

    '.segmented input': {
        display: 'none'
    },

    '.segment': {
        padding: '1em 2em',
        cursor: 'pointer',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center'
    },

    '.segment.disabled': {
        cursor: 'default',
        color: 'var(--fluid-clr-grey-600)'
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
        padding: 'calc(1em - 0.35rem) calc(2em - 0.35rem)',
        borderRadius: 'var(--fluid-radius-sml)',
        backgroundColor: 'var(--fluid-clr-primary-100)',
        boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)'
    },

    '.round .selection': {
        borderRadius: '999px'
    },

    '.segmented.error': {
        outline: 'solid 1px red'
    }
}