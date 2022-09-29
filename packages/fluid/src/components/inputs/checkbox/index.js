import React, { useState } from 'react';
import Spinner from '@components/info/progress/spinner/index';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { mergeFallback } from '@core/utils/helper';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';

export default function Checkbox({ children, styles, size, disabled, loading, onClick, className, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [checked, setChecked] = useState(false);
    const link = useLink(0);

    return <label
        {...props}
        className={combine(
            style.checkbox,
            style[size],
            checked ? style.checked : null,
            disabled ? style.disabled : null,
            className
        )}>
        <svg viewBox="0 0 16 20" className={style.checkmark}>
            <Animatable onMount animate={{ length: link }} initial={{ length: 0 }}>
                <path d="M 4 8 L 9 12 L 16 4" />
            </Animatable>
        </svg>
        <input type="checkbox" disabled={disabled} checked={checked} onChange={() => {
            setChecked(!checked);
        }} />
    </label>;
}

Checkbox.defaultProps = {
    styles: {},
    size: 'med',
    disabled: false,
    loading: false
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