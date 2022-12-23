export default {
    '.box': {
        width: '5.4rem',
        height: '5.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    '.track': {
        cx: '50%',
        cy: '50%',
        r: '45%',
        stroke: 'var(--fluid-clr-grey-900)',
        strokeWidth: '10%',
        fill: 'transparent',
        strokeDashoffset: 0.2,
        strokeDasharray: 1,
        transformOrigin: '50% 50%',
        rotate: '126deg',
        strokeLinecap: 'round'
    },

    '.progress': {
        stroke: 'var(--fluid-clr-primary-100)',
        zIndex: 1
    },

    '.text': {
        position: 'absolute',
        fontFamily: 'var(--fluid-font-family)',
        fontWeight: 'var(--fluid-font-weight-med)',
        fontSize: '1.3em',
        color: 'var(--fluid-clr-text)'
    }
}