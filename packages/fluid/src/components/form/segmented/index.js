import React, { useId, useState } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { mergeFallback } from '@core/utils/helper';
import { Morph } from '@infinityfx/lively/auto';

export default function Segmented({ children, styles, size, data, disabled, error, type, placeholder, label, onChange, className, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [selection, setSelection] = useState(0);

    return <div
        className={combine(
            style.segmented,
            style[size],
            className
        )}
        {...props}>
        {data.map((val, i) => {
            return <label key={val.value} className={combine(
                style.segment,
                val.disabled ? style.disabled : null
            )}>
                {val.label}
                <input type="radio" disabled={val.disabled} value={val.value} name="test" onChange={e => {
                    setSelection(i);
                }} />
            </label>;
        })}

        <div className={style.selectors}>
            {data.map((val, i) => {
                return <Morph noDeform active={selection === i} duration={0.4}>
                    <span className={style.selection}>
                        {val.label}
                    </span>
                </Morph>;
            })}
        </div>
    </div>;
}

Segmented.defaultProps = {
    styles: {},
    size: 'med',
    disabled: false,
    error: null,
    data: []
};