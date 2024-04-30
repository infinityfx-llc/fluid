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
        overflowX: 'hidden',
        fontFamily: 'var(--f-font-family)',
        '--f-shadow-sml': '0 0 8px -2px rgb(0, 0, 0, 0.08), 0 0 3px rgb(0, 0, 0, 0.04)',
        '--f-shadow-med': '0 4px 12px -3px rgb(0, 0, 0, 0.1), 0 2px 4px rgb(0, 0, 0, 0.05)'
    },

    body: {
        backgroundColor: 'var(--f-clr-bg-100)',
        color: 'var(--f-clr-text-100)',
        overflowY: 'auto'
    },

    a: {
        color: 'inherit',
        textDecoration: 'none'
    },

    'input, button, textarea, select': {
        font: 'inherit',
        letterSpacing: 'inherit',
        wordSpacing: 'inherit'
    }
} as FluidStyles;