export default {
    '.label': {
        display: 'block',
        marginBottom: 'var(--fluid-gap-xsm)',
        fontSize: 'var(--fluid-font-size-sml)',
        fontWeight: 'var(--fluid-font-weight-med)'
    },

    '.field': {
        padding: '0.8em 1em',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        border: 'solid 1px var(--fluid-clr-grey-300)',
        borderRadius: 'var(--fluid-radius-sml)',
        display: 'flex',
        alignItem: 'center',
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
        minWidth: 0
    },

    '.icon': {
        width: '1.5rem',
        aspectRatio: 1,
        marginRight: 'var(--fluid-gap-xsm)',
        color: 'var(--fluid-clr-grey-300)',
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