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
        inset: 0
    },

    '.focus': {
        position: 'absolute',
        overflow: 'hidden',
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

    '.interact *:first-child:focus-visible + .focus': {
        opacity: 0.2
    },

    '@media (hover: hover)': {
        '.interact:hover .focus': {
            opacity: 0.2
        }
    },

    '@media (hover: none)': {
        '.interact:active .focus': {
            opacity: 0.2
        }
    },

    '.circle': {
        minWidth: '141%',
        aspectRatio: 1,
        borderRadius: '999px',
        backgroundColor: 'var(--fluid-clr-grey-200)'
    }

}