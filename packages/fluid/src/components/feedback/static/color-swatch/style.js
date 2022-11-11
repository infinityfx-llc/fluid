export default {
    '.swatch': {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--fluid-radius-sml)',
        border: 'solid 1px var(--fluid-clr-grey-800)',
    },

    '.swatch.med': {
        width: '2rem',
        height: '2rem'
    },

    '.swatch[data-round="true"]': {
        borderRadius: '999px'
    },

    '.swatch::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%, #eee 100%)',
        backgroundPosition: '0px 0px, 1rem 1rem',
        backgroundSize: '2rem 2rem',
        backgroundRepeat: 'repeat',
        zIndex: -1
    },

    '.swatch[data-selected="true"]': {
        outline: 'solid 1px var(--fluid-clr-foreground-100)',
        borderColor: 'var(--fluid-clr-foreground-100)'
    }
}