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
        width: 'calc(100% - 10px)',
        height: '6px',
        backgroundColor: 'var(--fluid-clr-grey-300)',
        borderRadius: '999px',
        overflow: 'hidden'
    },

    '.vertical .track': {
        height: 'calc(100% - 10px)',
        width: '6px'
    },

    '.progress': {
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--fluid-clr-primary-100)',
        transformOrigin: 'top left'
    },

    '.handle': {
        userSelect: 'none',
        position: 'absolute',
        height: '100%',
        aspectRatio: 1,
        borderRadius: '999px',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        boxShadow: '0 0 6px rgb(0, 0, 0, 0.1)'
    },

    '.vertical .handle': {
        height: 'auto',
        width: '100%'
    }
}