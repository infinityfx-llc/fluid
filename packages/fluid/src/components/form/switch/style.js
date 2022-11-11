export default {
    '.switch': {
        width: '4.5rem',
        height: '2.5rem',
        borderRadius: '999px',
        boxSizing: 'border-box',
        padding: '0.25rem',
        display: 'flex',
        backgroundColor: 'var(--fluid-clr-grey-800)',
        cursor: 'pointer',
        transition: 'background-color .16s'
    },

    '.switch input': {
        display: 'none'
    },

    '.handle': {
        aspectRatio: 1,
        borderRadius: '999px',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)'
    },

    '.switch.checked': {
        backgroundColor: 'var(--fluid-clr-primary-100)'
    }
}