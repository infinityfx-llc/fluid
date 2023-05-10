export default {
    '.label': {
        display: 'block',
        marginBottom: 'var(--fluid-gap-xsm)',
        fontSize: 'var(--fluid-font-size-sml)',
        fontWeight: 'var(--fluid-font-weight-med)',
        color: 'var(--fluid-clr-text)'
    },

    '.field': {
        padding: '1em',
        boxSizing: 'border-box',
        width: 'clamp(0rem, 20rem, 100vw)',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        border: 'solid 1px var(--fluid-clr-grey-700)',
        borderRadius: 'var(--fluid-radius-sml)',
        display: 'flex',
        alignItems: 'center',
        transition: 'border-color .15s'
    },

    '.field.sml': {
        fontSize: 'var(--fluid-font-size-xsm)',
    },

    '.field.med': {
        fontSize: 'var(--fluid-font-size-sml)',
    },

    '.field.lrg': {
        fontSize: 'var(--fluid-font-size-med)',
    },

    '.input': {
        fontFamily: 'var(--fluid-font-family)',
        border: 'none',
        backgroundColor: 'transparent',
        color: 'var(--fluid-clr-text)',
        minWidth: 0
    },

    '.icon': {
        width: '1.5rem',
        aspectRatio: 1,
        marginRight: 'var(--fluid-gap-xsm)',
        color: 'var(--fluid-clr-grey-700)',
        transition: 'color .15s'
    },

    '.field:focus-within': {
        borderColor: 'var(--fluid-clr-primary-100)'
    },

    '.field:focus-within .icon': {
        color: 'var(--fluid-clr-primary-100)'
    },

    '.field.error': {
        borderColor: 'red'
    },

    '.field.error .icon': {
        color: 'red'
    }
}