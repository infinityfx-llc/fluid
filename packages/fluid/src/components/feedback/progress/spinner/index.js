import React from 'react';
import { Animatable } from '@infinityfx/lively';
import useStyles from '@hooks/styles';
import { combine } from '@core/utils/css';

export default function Spinner({ className }) {
    const style = useStyles({
        '.container': {
            width: '1.4em',
            height: '1.4em'
        },
        '.spinner': {
            fill: 'transparent',
            stroke: 'var(--fluid-clr-highlight-100)',
            strokeWidth: '10%',
            cx: '50%',
            cy: '50%',
            r: '40%'
        }
    });

    return <svg viewBox="0 0 100 100" className={combine(style.container, className)}>
        <Animatable onMount animate={{ rotate: [0, 720], length: [0.75, 0.25, 0.75], interpolate: 'linear', repeat: Infinity, duration: 2 }} initial={{ origin: { x: 0.5, y: 0.5 }}}>
            <circle className={style.spinner} />
        </Animatable>
    </svg>;
}

// FIX Animatable issues:
// check default origin (not 0.5???)
// fix weird scale flickering when parsing transform (-1 counts as non-default scale???)