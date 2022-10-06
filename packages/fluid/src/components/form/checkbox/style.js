export default {
    '.checkbox': {
        width: '1.75rem',
        height: '1.75rem',
        border: 'solid .25rem',
        backgroundColor: 'transparent',
        borderColor: 'var(--fluid-clr-primary-100)',
        borderRadius: 'var(--fluid-radius-sml)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.15s'
    },

    '.checkbox input': {
        display: 'none'
    },

    '.checkmark': {
        width: '100%',
        height: '100%',
        strokeWidth: '.25rem',
        fill: 'transparent',
        stroke: 'var(--fluid-clr-highlight-100)'
    },

    '.checkbox.checked': {
        backgroundColor: 'var(--fluid-clr-primary-100)'
    },

    '.checkbox.disabled': {
        cursor: 'default',
        borderColor: 'var(--fluid-clr-grey-300)',
        backgroundColor: 'var(--fluid-clr-grey-200)'
    },

    '.checkbox.error': {
        borderColor: 'red'
    },
    '.checkbox.checked.error': {
        backgroundColor: 'red'
    }
};