export default {
    '.button': {
        userSelect: 'none',
        outline: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 'var(--fluid-gap-sml) var(--fluid-gap-med)',
        height: 'fit-content',
        backgroundColor: 'var(--fluid-clr-primary-100)',
        color: 'var(--fluid-clr-text-100)',
        fontFamily: 'var(--fluid-font-family)',
        fontSize: 'var(--fluid-font-size-med)',
        fontWeight: 'var(--fluid-font-weight-med)',
        borderRadius: 'var(--fluid-radius-max)',
        transition: 'background-color 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--fluid-gap-sml)'
    },

    '.button:hover': {
        backgroundColor: 'var(--fluid-clr-foreground-100)'
    },

    '.button.loading': {
        color: 'transparent'
    },

    '.test': {
        position: 'absolute'
    }
};