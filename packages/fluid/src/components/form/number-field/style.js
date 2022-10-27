export default {
    '.label': {
        display: 'block',
        marginBottom: 'var(--fluid-gap-xsm)',
        fontSize: 'var(--fluid-font-size-sml)',
        fontWeight: 'var(--fluid-font-weight-med)',
        color: 'var(--fluid-clr-text)'
    },

    '.field': {
        overflow: 'hidden',
        width: 'clamp(0rem, 20rem, 100vw)',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        border: 'solid 1px var(--fluid-clr-grey-300)',
        borderRadius: 'var(--fluid-radius-sml)',
        display: 'flex',
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
        padding: '0.8em 1em',
        appearance: 'textfield',
        border: 'none',
        backgroundColor: 'transparent',
        fontFamily: 'var(--fluid-font-family)',
        color: 'var(--fluid-clr-text)',
        minWidth: 0,
        flexGrow: 1
    },

    '.input::-webkit-inner-spin-button, .input::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none'
    },

    '.button': {
        border: 'none',
        padding: 0,
        backgroundColor: 'transparent',
        flexShrink: 0
    },

    '.interactable': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 .6em',
        height: '100%'
    },

    '.interactable *': {
        width: '1.2em',
        color: 'var(--fluid-clr-text)'
    },

    '.button.left': {
        borderRight: 'solid 1px var(--fluid-clr-grey-300)'
    },

    '.button.right': {
        borderLeft: 'solid 1px var(--fluid-clr-grey-300)'
    },

    '.field:focus-within': {
        borderColor: 'var(--fluid-clr-primary-100)'
    },

    '.field.error': {
        borderColor: 'red'
    }
}