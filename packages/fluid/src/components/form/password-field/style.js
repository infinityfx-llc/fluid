export default {
    '.label': {
        display: 'block',
        marginBottom: 'var(--fluid-gap-xsm)',
        fontSize: 'var(--fluid-font-size-sml)',
        fontWeight: 'var(--fluid-font-weight-med)',
        color: 'var(--fluid-clr-text)'
    },

    '.field': {
        padding: '0.4em',
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
        padding: '0.6em',
        fontFamily: 'var(--fluid-font-family)',
        border: 'none',
        backgroundColor: 'transparent',
        color: 'var(--fluid-clr-text)',
        minWidth: 0,
        flexGrow: 1,
        flexShrink: 1
    },

    '.icon': {
        width: '1.5rem',
        aspectRatio: 1,
        marginRight: 'var(--fluid-gap-xsm)',
        color: 'var(--fluid-clr-grey-700)',
        transition: 'color .15s'
    },

    '.toggle_icon': {
        height: 'inherit !important',
        width: 'auto !important',
        aspectRatio: 1,
        flexGrow: 1
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
    },

    '.strength_indicator': {
        width: '100%',
        display: 'flex',
        gap: 'var(--fluid-gap-xxs)',
        marginTop: 'var(--fluid-gap-xsm)'
    },

    '.strength_indicator .bar': {
        flexGrow: 1,
        height: '4px',
        borderRadius: '999px',
        backgroundColor: 'var(--fluid-clr-grey-800)',
        transition: 'background-color .15s'
    },

    '.strength_indicator[data-strength="1"] .bar[data-active="true"]': {
        backgroundColor: '#ff0000'
    },

    '.strength_indicator[data-strength="2"] .bar[data-active="true"]': {
        backgroundColor: '#ff5900'
    },

    '.strength_indicator[data-strength="3"] .bar[data-active="true"]': {
        backgroundColor: '#ffae00'
    },

    '.strength_indicator[data-strength="4"] .bar[data-active="true"]': {
        backgroundColor: '#bbff00'
    },

    '.strength_indicator[data-strength="5"] .bar[data-active="true"]': {
        backgroundColor: '#00ff44'
    }
}