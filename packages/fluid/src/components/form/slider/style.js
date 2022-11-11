export default {
    '.slider': {
        position: 'relative',
        height: '20px',
        width: '16rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },

    '.slider.vertical': {
        height: '16rem',
        width: '20px'
    },

    '.track': {
        width: '100%',
        height: '6px',
        backgroundColor: 'var(--fluid-clr-grey-800)',
        borderRadius: '999px',
        overflow: 'hidden'
    },

    '.vertical .track': {
        height: '100%',
        width: '6px'
    },

    '.progress': {
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--fluid-clr-primary-100)',
        transformOrigin: 'top left'
    },

    '.handle_wrapper': {
        position: 'absolute',
        height: '100%',
        aspectRatio: 1
    },

    '.handle': {
        height: '100%',
        width: '100%',
        userSelect: 'none',
        borderRadius: '999px',
        backgroundColor: 'var(--fluid-clr-light-100)',
        boxShadow: '0 0 6px rgb(0, 0, 0, 0.1)',
        touchAction: 'none'
    },

    '.vertical .handle_wrapper': {
        height: 'auto',
        width: '100%'
    },

    '.slider.disabled': {
        cursor: 'default'
    },

    '.disabled .progress': {
        backgroundColor: 'var(--fluid-clr-grey-800)'
    },

    '.disabled .handle': {
        backgroundColor: 'var(--fluid-clr-grey-700)'
    }
}