export default {
    '.timeline': {
        display: 'grid'
    },

    '.timeline[data-uniform="true"]': {
        gridAutoRows: '1fr'
    },
    
    '.event': {
        position: 'relative',
        display: 'flex',
        gap: 'var(--fluid-gap-sml)',
        alignItems: 'start'
    },

    '.event:not(:last-child)': {
        paddingBottom: 'var(--fluid-gap-med)'
    },

    '.line': {
        display: 'flex',
        justifyContent: 'center',
    },

    '.segment': {
        position: 'absolute',
        width: '4px',
        height: 'calc(100% + 1rem)',
        backgroundColor: 'var(--fluid-clr-grey-300)'
    },

    '.bullet': {
        width: 'calc(2rem - 4px)',
        height: 'calc(2rem - 4px)',
        backgroundColor: 'var(--fluid-clr-background-100)',
        border: 'solid 4px var(--fluid-clr-grey-300)',
        borderRadius: '999px',
        zIndex: 1
    }
}