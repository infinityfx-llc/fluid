export default {
    '.timeline': {
        display: 'grid'
    },

    '.timeline[data-uniform="true"][data-horizontal="false"]': {
        gridAutoRows: '1fr'
    },

    '.timeline[data-uniform="true"][data-horizontal="true"]': {
        gridAutoColumns: '1fr'
    },

    '.timeline[data-horizontal="true"]': {
        gridAutoFlow: 'column'
    },
    
    '.event': {
        position: 'relative',
        display: 'flex',
        gap: 'var(--fluid-gap-sml)',
        alignItems: 'start'
    },

    '.timeline[data-horizontal="true"] .event': {
        flexDirection: 'column'
    },

    '.timeline[data-horizontal="false"] .event:not(:last-child)': {
        paddingBottom: 'var(--fluid-gap-med)'
    },

    '.timeline[data-horizontal="true"] .event:not(:last-child)': {
        paddingRight: 'var(--fluid-gap-med)'
    },

    '.line': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    '.segment': {
        position: 'absolute',
        width: '4px',
        height: '100%',
        top: '1rem',
        backgroundColor: 'var(--fluid-clr-grey-300)'
    },

    '.timeline[data-horizontal="true"] .segment': {
        width: '100%',
        height: '4px',
        top: 'auto',
        left: '1rem'
    },

    '.bullet': {
        position: 'relative',
        width: 'calc(2rem - 4px)',
        height: 'calc(2rem - 4px)',
        backgroundColor: 'var(--fluid-clr-background-100)',
        border: 'solid 4px var(--fluid-clr-grey-300)',
        borderRadius: '999px',
        zIndex: 1
    },

    '.bullet[data-active="true"]': {
        borderColor: 'var(--fluid-clr-primary-100)'
    },

    '.bullet[data-active="true"]::after': {
        content: '""',
        position: 'absolute',
        inset: '3px',
        backgroundColor: 'var(--fluid-clr-primary-100)',
        borderRadius: '999px'
    },

    '.segment[data-active="true"]': {
        backgroundColor: 'var(--fluid-clr-primary-100)'
    }
}