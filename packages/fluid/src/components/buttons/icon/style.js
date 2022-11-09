export default {
    '.button': {
        border: 'none',
        padding: 0,
        backgroundColor: 'transparent',
        // backgroundColor: 'var(--fluid-clr-primary-100)',
        color: 'var(--fluid-clr-text)',
        height: 'fit-content',
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 'var(--fluid-radius-sml)',
        transition: 'background-color .15s',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.button > *': {
        flexGrow: 1
    },

    '.button[data-round="true"]': {
        borderRadius: '999px'
    },

    '.button.sml': {
        padding: '0.6rem',
        width: '3.4rem',
        height: '3.4rem'
    },

    '.button.med': {
        padding: '0.8rem',
        width: '4.2rem',
        height: '4.2rem'
    },

    '.button.lrg': {
        padding: '1.1rem',
        width: '5.4rem',
        height: '5.4rem'
    },
    
    '.button:hover': {
        // backgroundColor: 'var(--fluid-clr-foreground-100)',
    }
    
}