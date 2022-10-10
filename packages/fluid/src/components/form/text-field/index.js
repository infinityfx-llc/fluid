import React, { useId, useState } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';

export default function TextField({ children, styles, size, icon, disabled, required, error, type, placeholder, label, onChange, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [checked, setChecked] = useState(false);
    const forId = useId();
    const [link, setLink] = useLink(0);

    const Icon = icon;

    return <div
        {...props}>
        {label && <label htmlFor={forId} className={style.label}>{label} {required && '*'}</label>}
        <div className={combine(
            style.field,
            style[size],
            disabled ? style.disabled : null,
            error ? style.error : null
        )}>
            {Icon && <Icon className={style.icon} />}
            <input id={forId} type={type} disabled={disabled} required={required} className={style.input} placeholder={placeholder} onChange={e => {
                setLink(checked ? 0 : 1, 0.16);
                setChecked(!checked);
                if (is.function(onChange)) onChange(e);
            }} />
        </div>
    </div>;
}

TextField.defaultProps = {
    styles: {},
    size: 'med',
    type: 'text',
    disabled: false,
    required: false,
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
// required
// placeholder
// validator

// accesibility
// role="" tabIndex="" aria-label