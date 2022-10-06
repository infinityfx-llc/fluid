import React, { useState } from 'react';
import Spinner from '@components/info/progress/spinner/index';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';

export default function Checkbox({ children, styles, size, disabled, error, onChange, className, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [checked, setChecked] = useState(false);
    const [link, setLink] = useLink(0);

    return <label
        {...props}
        className={combine(
            style.checkbox,
            style[size],
            checked ? style.checked : null,
            disabled ? style.disabled : null,
            error ? style.error : null,
            className
        )}>
        <svg viewBox="0 0 18 18" className={style.checkmark}>
            <Animatable onMount animate={{ length: link }}>
                <path d="M 3 9 L 8 13 L 15 5" />
            </Animatable>
        </svg>
        <input type="checkbox" disabled={disabled} checked={checked} onChange={e => {
            setLink(checked ? 0 : 1, 0.15);
            setChecked(!checked);
            if (is.function(onChange)) onChange(e);
        }} />
    </label>;
}

Checkbox.defaultProps = {
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