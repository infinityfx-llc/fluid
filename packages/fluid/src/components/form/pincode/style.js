export default {
    '.label': {
        display: 'block',
        marginBottom: 'var(--fluid-gap-xsm)',
        fontSize: 'var(--fluid-font-size-sml)',
        fontWeight: 'var(--fluid-font-weight-med)',
        color: 'var(--fluid-clr-text)'
    },

    '.pincode': {
        display: 'flex',
        gap: 'var(--fluid-gap-xsm)'
    },

    '.pincode.sml': {
        fontSize: 'var(--fluid-font-size-xsm)',
    },

    '.pincode.med': {
        fontSize: 'var(--fluid-font-size-sml)',
    },

    '.pincode.lrg': {
        fontSize: 'var(--fluid-font-size-med)',
    },

    '.input': {
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        border: 'solid 1px var(--fluid-clr-grey-300)',
        borderRadius: 'var(--fluid-radius-med)',
        padding: '1em',
        appearance: 'textfield',
        fontFamily: 'var(--fluid-font-family)',
        textAlign: 'center',
        color: 'var(--fluid-clr-text)',
        width: '1.6rem',
        transition: 'border-color .15s'
    },

    '.input::-webkit-inner-spin-button, .input::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none'
    },

    '.input:focus-visible': {
        borderColor: 'var(--fluid-clr-primary-100)'
    },

    '.pincode.error .input': {
        borderColor: 'red'
    }
}