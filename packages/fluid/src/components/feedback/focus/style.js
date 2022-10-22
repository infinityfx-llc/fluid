export default {

    '.container': {
        position: 'relative',
        width: 'fit-content',
        height: 'fit-content',
        cursor: 'pointer'
    },

    '.container.sml': {
        padding: '0.6rem'
    },

    '.container.med': {
        padding: '0.8rem'
    },

    '.container.lrg': {
        padding: '1rem'
    },

    '.container *:first-child': {
        zIndex: 1
    },

    '.focus': {
        position: 'absolute',
        overflow: 'hidden',
        inset: 0,
        backgroundColor: 'rgb(var(--fluid-rgb-primary-100), .66)',
        borderRadius: 'var(--fluid-radius-sml)',
        opacity: 0,
        transition: 'opacity .1s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
    },

    '.container:hover .focus, .container *:first-child:focus-visible + .focus': {
        opacity: 0.2
    },

    '.circle': {
        minWidth: '141%',
        aspectRatio: 1,
        borderRadius: '999px',
        backgroundColor: 'var(--fluid-clr-grey-200)'
    }

}