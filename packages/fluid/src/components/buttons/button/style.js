export default {
    '.button': {
        userSelect: 'none',
        outline: 'none',
        border: 'none',
        cursor: 'pointer',
        height: 'fit-content',
        backgroundColor: 'var(--fluid-clr-primary-100)',
        color: 'var(--fluid-clr-text-100)',
        fontFamily: 'var(--fluid-font-family)',
        transition: 'background-color 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--fluid-gap-sml) var(--fluid-gap-med)',
        fontWeight: 'var(--fluid-font-weight-med)',
        borderRadius: 'var(--fluid-radius-max)',
        gap: 'var(--fluid-gap-sml)'
    },

    '.button.sml': {
        fontSize: 'var(--fluid-font-size-sml)',
    },

    '.button.med': {
        fontSize: 'var(--fluid-font-size-med)',
    },

    '.button.lrg': {
        fontSize: 'var(--fluid-font-size-lrg)',
    },

    '.button:not(.disabled):hover': {
        backgroundColor: 'var(--fluid-clr-foreground-100)'
    },

    '.button.loading': {
        color: 'transparent'
    },

    '.button.disabled': {
        cursor: 'default',
        backgroundColor: 'var(--fluid-clr-foreground-100)'
    },

    '.test': {
        position: 'absolute'
    }
};