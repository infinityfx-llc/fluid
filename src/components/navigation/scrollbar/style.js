export default {
    '@media not (pointer: coarse)': {
        '.container': {
            overflow: 'hidden !important'
        },
        
        '.container:not(.hidden)': {
            paddingRight: '0.6rem !important'
        }
    },

    '.scrollbar': {
        position: 'absolute',
        width: '0.6rem',
        height: '100%',
        right: 0,
        top: 0,
        zIndex: 999
    },

    '.hidden .scrollbar': {
        display: 'none'
    },

    '@media (pointer: coarse)': {
        '.scrollbar': {
            display: 'none'
        }
    },

    '.handle': {
        userSelect: 'none',
        width: 'inherit',
        height: '0%',
        background: 'var(--fluid-clr-grey-500)',
        borderRadius: '999px',
        opacity: 0.35,
        cursor: 'default',
        transition: 'opacity .15s'
    },

    '.scrollbar:hover .handle': {
        opacity: 0.75
    }
}