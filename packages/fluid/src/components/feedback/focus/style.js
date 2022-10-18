export default {

    '.container': {
        position: 'relative',
        width: 'fit-content',
        height: 'fit-content'
    },

    '.container *:first-child': {
        zIndex: 1
    },

    '.focus': {
        position: 'absolute',
        overflow: 'hidden',
        inset: 'calc(-1 * var(--fluid-gap-med))',
        backgroundColor: 'var(--fluid-clr-primary-100)',
        borderRadius: 'var(--fluid-radius-sml)',
        opacity: 0,
        transition: 'opacity .1s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
    },

    '.container:hover .focus, .container *:first-child:focus-visible + .focus': {
        opacity: 0.15
    },

    '.circle': {
        minWidth: '141%',
        aspectRatio: 1,
        borderRadius: '999px',
        backgroundColor: 'var(--fluid-clr-grey-200)'
    }

}