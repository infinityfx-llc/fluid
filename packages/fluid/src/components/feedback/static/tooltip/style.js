export default {
    '.parent': {
        position: 'relative'
    },

    '.tooltip': {
        position: 'absolute',
        pointerEvents: 'none',
        fontSize: 'var(--fluid-font-size-sml)',
        fontFamily: 'var(--fluid-font-family)',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        borderRadius: 'var(--fluid-radius-sml)',
        padding: '.4em .6em',
        boxShadow: '0 0 6px rgb(0, 0, 0, 0.06)',
        opacity: 0,
        transition: 'opacity .15s'
    },

    '*:hover > .tooltip, *:focus-visible > .tooltip': {
        opacity: 1
    },

    '.tooltip[data-place="left"]': {
        right: 'calc(100% + var(--fluid-gap-sml))',
        top: '50%',
        transform: 'translateY(-50%)'
    },

    '.tooltip[data-place="top"]': {
        bottom: 'calc(100% + var(--fluid-gap-sml))',
        left: '50%',
        transform: 'translateX(-50%)'
    },

    '.tooltip[data-place="right"]': {
        left: 'calc(100% + var(--fluid-gap-sml))',
        top: '50%',
        transform: 'translateY(-50%)'
    },

    '.tooltip[data-place="bottom"]': {
        top: 'calc(100% + var(--fluid-gap-sml))',
        left: '50%',
        transform: 'translateX(-50%)'
    }
}