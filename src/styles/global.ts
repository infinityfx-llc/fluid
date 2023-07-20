import { FluidStyles } from "../types";

export default {
    '*': {
        boxSizing: 'border-box',
        padding: 0,
        margin: 0
    },

    'html, body': {
        width: '100%',
        minHeight: '100dvh',
        overflowX: 'hidden'
    },

    body: {
        fontFamily: 'var(--f-font-family)',
        backgroundColor: 'var(--f-clr-bg-100)',
        overflowY: 'auto'
    },

    a: {
        color: 'inherit',
        textDecoration: 'none'
    },

    'input, button, textarea, select': {
        font: 'inherit'
    }
} as FluidStyles;