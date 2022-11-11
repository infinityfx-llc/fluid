export default {
    '.key': {
        position: 'relative',
        fontSize: 'var(--fluid-font-size-sml)',
        fontWeight: 'var(--fluid-font-weight-bld)',
        color: 'var(--fluid-clr-grey-400)',
        backgroundColor: 'var(--fluid-clr-grey-600)',
        height: 'fit-content',
        padding: '.3em .6em .5em .6em',
        borderRadius: 'var(--fluid-radius-sml)',
        zIndex: 0
    },

    '.key::after': {
        content: '""',
        position: 'absolute',
        inset: '1px 1px calc(1px + .2em) 1px',
        backgroundColor: 'var(--fluid-clr-grey-800)',
        borderRadius: 'var(--fluid-radius-sml)',
        zIndex: -1
    }
}