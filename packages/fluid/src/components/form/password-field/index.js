import React, { useId, useState } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { IconButton } from '@components/buttons';
import { EyeClosedIcon, EyeIcon } from '@components/icons';
import Badge from '@components/feedback/static/badge';

export default function PasswordField({ children, styles, size, strengthIndicator, icon, disabled, required, error, placeholder, label, onChange, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const forId = useId();
    const [hidden, setHidden] = useState(true);
    const [strength, setStrength] = useState(0);
    const [capsLocked, setCapsLocked] = useState(false);

    const Icon = icon;

    const change = e => {
        if (is.function(onChange)) onChange(e);

        let val = e.target.value, strength = 0;
        for (const regx of [/[a-z]/, /[A-Z]/, /\d/, /\W|_/, /.{10,}/]) {
            if (regx.test(val)) strength++;
        }

        setStrength(strength);
    };

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
            <input id={forId} type={hidden ? 'password' : 'text'} disabled={disabled} required={required} className={style.input} placeholder={placeholder} onChange={change} onKeyDown={e => {
                if (e.code === 'CapsLock') {
                    setCapsLocked(e.getModifierState('CapsLock'));
                }
            }} />
            <IconButton size="sml" className={style.toggle_icon} onClick={() => setHidden(!hidden)}>
                {hidden ? <EyeIcon /> : <EyeClosedIcon />}
            </IconButton>
        </div>
        {strengthIndicator && <div className={style.strength_indicator} data-strength={strength}>
            {new Array(5).fill(0).map((_, i) => <div key={i} data-active={i < strength} className={style.bar} />)}
        </div>}

        {capsLocked && <Badge className={style.badge} size="sml">
            CAPS LOCK
        </Badge>}
    </div>;
}

PasswordField.defaultProps = {
    styles: {},
    size: 'med',
    strengthIndicator: false,
    disabled: false,
    required: false,
    error: null
};

// pass autocomplete value to input
// onEnter submit form
// indicator for when caps lock is on

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