import { FluidStyles } from "../types";

export default {
    '*': {
        boxSizing: 'border-box',
        padding: 0,
        margin: 0
    },

    'html': {
        scrollbarGutter: 'stable',
        '--f-shadow-sml': '0 .5px .5px rgb(0, 0, 0, 0.15), 0 2px 2px -1px rgb(0, 0, 0, 0.1), 0 5px 5px -2.5px rgb(0, 0, 0, 0.07)',
        '--f-shadow-med': '0 .5px .5px rgb(0, 0, 0, 0.15), 0 3px 3px -1px rgb(0, 0, 0, 0.12), 0 6px 6px -2px rgb(0, 0, 0, 0.08), 0 12px 12px -3px rgb(0, 0, 0, 0.06)',
        '--f-shadow-lrg': '0 .5px .5px rgb(0, 0, 0, 0.15), 0 3px 3px -1px rgb(0, 0, 0, 0.1), 0 8px 8px -2px rgb(0, 0, 0, 0.085), 0 16px 16px -3px rgb(0, 0, 0, 0.07), 0 24px 24px -4px rgb(0, 0, 0, 0.05)'
    },

    'html, body': {
        width: '100%',
        minHeight: '100dvh',
        fontFamily: 'var(--f-font-family), system-ui, sans-serif'
    },

    body: {
        backgroundColor: 'var(--f-clr-bg-100)',
        color: 'var(--f-clr-text-100)'
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