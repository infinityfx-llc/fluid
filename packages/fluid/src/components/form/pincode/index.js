import React, { useId, useRef, useState } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';

export default function Pincode({ children, styles, size, length, disabled, required, error, label, onChange, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [value, setValue] = useState('');
    const inputRefs = useRef([]);
    const forId = useId();

    const change = (e, i) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        const num = val.charAt(val.length - 1);

        const code = value.length <= i ? value + num : value.slice(0, i) + num + value.slice(i + 1);
        if (is.function(onChange)) onChange(e); //set correct value here

        setValue(code);

        if (val.length) {
            inputRefs.current[Math.min(code.length, i + 1)]?.focus();
        } else
        if (value.length >= i) {
            inputRefs.current[i - 1]?.focus();
        }
    };

    return <div
        {...props}>
        {label && <label htmlFor={forId} className={style.label}>{label} {required && '*'}</label>}
        <div className={combine(
            style.pincode,
            style[size],
            disabled ? style.disabled : null,
            error ? style.error : null
        )}>
            {new Array(length).fill(0).map((_, i) => {
                return <input key={i} ref={el => inputRefs.current[i] = el} type="text" className={style.input} disabled={disabled} value={value.charAt(i)} onChange={e => change(e, i)} />;
            })}

            <input id={forId} type="hidden" required={required} value={value} />
        </div>
    </div>;
}

Pincode.defaultProps = {
    styles: {},
    size: 'med',
    length: 4,
    disabled: false,
    required: false,
    error: null
};

// add dash in middle optional