import React, { useId, useState } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { MinusIcon, PlusIcon } from '@components/icons';
import { Focus } from '@components/feedback';

export default function NumberField({ children, styles, size, step, disabled, required, error, label, onChange, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [value, setValue] = useState('');
    const forId = useId();

    return <div
        {...props}>
        {label && <label htmlFor={forId} className={style.label}>{label} {required && '*'}</label>}
        <div className={combine(
            style.field,
            style[size],
            disabled ? style.disabled : null,
            error ? style.error : null
        )}>
            <Focus element="button" size="fil" disabled={disabled} className={combine(style.button, style.left)} onClick={() => {
                setValue((parseFloat(value) || 0) - step);
            }}>
                <MinusIcon />
            </Focus>
            <input id={forId} type="number" disabled={disabled} required={required} className={style.input} value={value} onChange={e => {
                if (is.function(onChange)) onChange(e);
                setValue(e.target.value);
            }} />
            <Focus element="button" size="fil" disabled={disabled} className={combine(style.button, style.right)} onClick={() => {
                setValue((parseFloat(value) || 0) + step);
            }}>
                <PlusIcon />
            </Focus>
        </div>
    </div>;
}

NumberField.defaultProps = {
    styles: {},
    size: 'med',
    step: 1,
    disabled: false,
    required: false,
    error: null
};