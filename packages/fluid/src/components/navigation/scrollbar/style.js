export default {
    '.container': {
        overflow: 'hidden !important'
    },

    '.scrollbar': {
        position: 'absolute',
        width: '0.6rem',
        height: '100%',
        right: 0,
        top: 0
    },

    '.handle': {
        width: 'inherit',
        height: '50%',
        background: 'var(--fluid-clr-grey-200)',
        borderRadius: '999px',
        opacity: 0.35,
        cursor: 'pointer',
        transition: 'opacity .15s'
    },

    '.scrollbar:hover .handle': {
        opacity: 0.75
    }
}