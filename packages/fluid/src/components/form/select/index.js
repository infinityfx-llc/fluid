import React, { useEffect, useId, useRef, useState } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { is, mergeFallback } from '@core/utils/helper';
import { Animatable } from '@infinityfx/lively';
import { ChevronDown } from '@components/icons';
import { offClickOutside, onClickOutside } from '@core/utils';
import { Scrollbar } from '@components/navigation';

export default function Select({ children, styles, size, disabled, error, data, label, required, onChange, className, ...props }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [selected, setSelected] = useState('');
    const [selectionLabel, setSelectionLabel] = useState('');
    const selectRef = useRef();
    const options = useRef();
    const isOpen = useRef(false);
    const forId = useId();

    const select = (e, { label, value }) => {
        setSelected(value);
        setSelectionLabel(label);
        close();
        e.stopPropagation();
    };

    const open = () => {
        if (!isOpen.current) options.current.play('default');
        isOpen.current = true;
    };

    const close = () => {
        if (isOpen.current) options.current.play('default', { reverse: true, immediate: true });
        isOpen.current = false;
    };

    useEffect(() => {
        onClickOutside(selectRef.current, close);

        return () => offClickOutside(close);
    }, []);

    return <div {...props}>
        {label && <label htmlFor={forId} className={style.label}>{label} {required && '*'}</label>}
        <div
            ref={selectRef}
            className={combine(
                style.select,
                style[size]
            )}
            onClick={open}>
            <input className={style.input} type="text" placeholder="Test" value={selectionLabel} required={required} onChange={e => {
                setLabel(e.target.value);
                setSelected(null);
            }} />
            <ChevronDown className={style.icon} />

            <Animatable ref={options} lazy={false} animate={{ opacity: [0, 1], display: [{ start: 'none', set: 'block' }, 'block'], duration: .15 }}>
                <Scrollbar>
                    <div className={style.options}>
                        {data.map(option => {
                            if (!selected && !option.label.includes(selectionLabel)) return null;

                            return <Animatable onMount key={option.value + option.label} lazy={false} animate={{ opacity: [0, 1], duration: .15 }}>
                                <button className={style.option} onClick={e => select(e, option)}>
                                    {option.label}
                                </button>
                            </Animatable>;
                        })}
                    </div>
                </Scrollbar>
            </Animatable>
        </div>
    </div>;
}

Select.defaultProps = {
    styles: {},
    size: 'med',
    disabled: false,
    error: null,
    data: []
};