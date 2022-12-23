import React, { useEffect } from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { combine } from '@core/utils';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';

export default function CircularProgress({ value, color }) {
    const style = useStyles(defaultStyles);
    const [link, setLink] = useLink(value);

    useEffect(() => setLink(value), [value]);

    return <div className={style.box}>
        <svg viewBox="0 0 10 10" width="100%" height="100%">
            <circle className={style.track} pathLength={1} />
            <Animatable onMount animate={{ length: link(val => val * 0.8) }}>
                <circle className={combine(style.track, style.progress)} pathLength={1} style={{ stroke: color }} />
            </Animatable>
        </svg>

        <span className={style.text}>{(value * 100).toFixed(0)}%</span>
    </div>;
}

CircularProgress.defaultProps = {
    value: 0.5
}