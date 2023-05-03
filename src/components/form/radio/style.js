export default {
    '.radio': {
        width: '2.4rem',
        height: '2.4rem',
        backgroundColor: 'var(--fluid-clr-grey-800)',
        borderRadius: '999px',
        transition: 'background-color .1s',
        boxSizing: 'border-box',
        padding: '0.6rem'
    },

    '.radio:not(.disabled)': {
        cursor: 'pointer'
    },

    '.radio input': {
        display: 'none'
    },

    '.inner': {
        width: '100%',
        height: '100%',
        borderRadius: '999px',
        backgroundColor: 'var(--fluid-clr-light-100)'
    },

    '.radio.checked': {
        backgroundColor: 'var(--fluid-clr-primary-100)'
    },

    '.radio.error': {
        backgroundColor: 'red'
    }
}