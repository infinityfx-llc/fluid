export default {
    '.hamburger': {
        position: 'relative',
        border: 'none',
        padding: 0,
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '3rem',
        height: '3rem'
    },

    '.hamburger:not(.disabled)': {
        cursor: 'pointer'
    },

    '.layers': {
        position: 'relative',
        width: '100%',
        aspectRatio: 1.41,
        display: 'flex',
        flexDirection: 'column-reverse',
        justifyContent: 'space-between'
    },

    '.layer': {
        height: '3px',
        width: '100%',
        backgroundColor: 'var(--fluid-clr-text)',
        borderRadius: '999px'
    },

    '.cross': {
        position: 'absolute',
        height: '100%',
        width: '100%',
        transform: 'rotate(45deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.hor': {
        position: 'absolute'
    },

    '.ver': {
        position: 'absolute',
        height: '100%',
        width: '3px'
    }
}