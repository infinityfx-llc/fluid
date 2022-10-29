import React, { useId, useState } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { IconButton } from '@components/buttons';
import { EyeClosedIcon, EyeIcon } from '@components/icons';

export default function PasswordField({ children, styles, size, icon, disabled, required, error, placeholder, label, onChange, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const forId = useId();
    const [hidden, setHidden] = useState(true);

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
            <input id={forId} type={hidden ? 'password' : 'text'} disabled={disabled} required={required} className={style.input} placeholder={placeholder} onChange={e => {
                if (is.function(onChange)) onChange(e);
            }} />
            <IconButton size="sml" onClick={() => setHidden(!hidden)}>
                {hidden ? <EyeIcon /> : <EyeClosedIcon />}
            </IconButton>
        </div>
    </div>;
}

PasswordField.defaultProps = {
    styles: {},
    size: 'med',
    disabled: false,
    required: false,
    error: null
};

// add password strength indicator at bottom

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