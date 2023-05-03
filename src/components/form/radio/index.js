import React, { useState } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';

export default function Radio({ children, styles, size, disabled, error, onChange, className, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [checked, setChecked] = useState(false);
    const [link, setLink] = useLink(0);

    return <label
        {...props}
        className={combine(
            style.radio,
            style[size],
            checked ? style.checked : null,
            disabled ? style.disabled : null,
            error ? style.error : null,
            className
        )}>
        <Animatable lazy={false} animate={{ scale: link }}>
            <div className={style.inner} />
        </Animatable>
        <input type="radio" disabled={disabled} checked={checked} onChange={e => {
            setLink(checked ? 0 : 1, 0.05);
            setChecked(!checked);
            if (is.function(onChange)) onChange(e);
        }} />
    </label>;
}

Radio.defaultProps = {
    styles: {},
    size: 'med',
    disabled: false,
    error: null
};

// custom styling prop
// size prop
// color variant
// pass react props (event listeners and stuff)

// for inputs and stuff:
// disabled
// loading
// icon
// error
// name
// onChange event
// labels??

// accesibility
// role="" tabIndex=""