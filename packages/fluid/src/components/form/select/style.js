export default {
    '.label': {
        display: 'block',
        marginBottom: 'var(--fluid-gap-xsm)',
        fontSize: 'var(--fluid-font-size-sml)',
        fontWeight: 'var(--fluid-font-weight-med)',
        color: 'var(--fluid-clr-text)'
    },
    
    '.select': {
        position: 'relative',
        padding: '0.8em 1em',
        boxSizing: 'border-box',
        width: 'clamp(0rem, 20rem, 100vw)',
        fontFamily: 'var(--fluid-font-family)',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        borderRadius: 'var(--fluid-radius-sml)',
        border: 'solid 1px var(--fluid-clr-grey-300)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color .15s'
    },

    '.select.sml': {
        fontSize: 'var(--fluid-font-size-xsm)',
    },

    '.select.med': {
        fontSize: 'var(--fluid-font-size-sml)',
    },

    '.select.lrg': {
        fontSize: 'var(--fluid-font-size-med)',
    },

    '.select select': {
        display: 'none'
    },

    '.input': {
        backgroundColor: 'transparent',
        border: 'none',
        minWidth: 0,
        flexGrow: 1
    },

    '.icon': {
        height: '1.6em',
        aspectRatio: 1,
        marginLeft: '0.4em',
        color: 'var(--fluid-clr-grey-300)',
        transition: 'border-color .15s'
    },

    '.options': {
        position: 'absolute',
        left: '-1px',
        top: 'calc(100% + 0.6em)',
        boxSizing: 'border-box',
        width: 'inherit',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        borderRadius: 'var(--fluid-radius-sml)',
        border: 'solid 1px var(--fluid-clr-grey-300)',
        padding: '0.4em',
        maxHeight: 'calc(3.08em * 4 + 0.8em + 2px)',
        overflowY: 'auto'
    },

    '.option': {
        display: 'block',
        textAlign: 'left',
        width: '100%',
        border: 'none',
        backgroundColor: 'transparent',
        padding: '0.8em 1em',
        borderRadius: 'var(--fluid-radius-sml)',
        transition: 'background-color .1s',
        cursor: 'pointer'
    },

    '.option:hover, .option:focus-visible': {
        backgroundColor: 'var(--fluid-clr-primary-100)'
    },

    '.select:focus-within': {
        borderColor: 'var(--fluid-clr-primary-100)'
    },

    '.select:focus-within .icon': {
        color: 'var(--fluid-clr-primary-100)'
    }
}