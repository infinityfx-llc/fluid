export default {
    '.checkbox': {
        width: '24px',
        height: '24px',
        border: 'solid 2px',
        backgroundColor: 'var(--fluid-clr-foreground-100)',
        borderColor: 'var(--fluid-clr-accent-100)',
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
        strokeWidth: '20%',
        fill: 'transparent',
        stroke: 'var(--fluid-clr-text-100)'
    },

    '.checkbox.checked': {
        backgroundColor: 'var(--fluid-clr-accent-100)'
    }
};