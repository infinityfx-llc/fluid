export default {

    '.interact': {
        position: 'relative',
        width: 'fit-content',
        height: 'fit-content',
        zIndex: 0
    },

    '.interact.sml .focus': {
        inset: 'calc(-1 * var(--fluid-gap-xsm))',
    },

    '.interact.med .focus': {
        inset: 'calc(-1 * var(--fluid-gap-sml))',
    },

    '.interact.lrg .focus': {
        inset: 'calc(-1 * var(--fluid-gap-med))',
    },

    '.interact.fil .focus': {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },

    '.focus': {
        position: 'absolute',
        overflow: 'hidden',
        inset: 'calc(-1 * var(--fluid-gap-sml))',
        backgroundColor: 'rgb(var(--fluid-rgb-primary-100), .66)',
        borderRadius: 'var(--fluid-radius-sml)',
        opacity: 0,
        transition: 'opacity .1s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: -1
    },

    '.focus.round': {
        borderRadius: '999px'
    },

    '.interact *:first-child:hover + .focus, .interact *:first-child:focus-visible + .focus, .interact.fil:hover .focus': {
        opacity: 0.2
    },

    '.tap': {
        minWidth: '141%',
        aspectRatio: 1,
        borderRadius: '999px',
        backgroundColor: 'var(--fluid-clr-grey-200)'
    }

}