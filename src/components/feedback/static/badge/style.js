export default {
    '.badge': {
        backgroundColor: 'var(--fluid-clr-grey-800)',
        borderRadius: 'var(--fluid-radius-sml)',
        fontFamily: 'var(--fluid-font-family)',
        fontWeight: 'var(--fluid-font-weight-reg)',
        color: 'var(--fluid-clr-text)',
        padding: '0.2em 0.4em',
        width: 'fit-content'
    },

    '.badge[data-size="sml"]': {
        fontSize: 'var(--fluid-font-size-xxs)'
    },

    '.badge[data-size="med"]': {
        fontSize: 'var(--fluid-font-size-sml)'
    },

    '.badge[data-size="lrg"]': {
        fontSize: 'var(--fluid-font-size-med)'
    }
}