'use client';

import { useState, forwardRef, useMemo } from 'react';
import Field, { FieldProps } from "./field";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FluidInputvalue } from '@/src/types';
import Toggle from './toggle';
import ProgressBar from '../feedback/progress-bar';
import useInputProps from '@/src/hooks/use-input-props';
import { useStyles } from '@/src/hooks';
import { classes } from '@/src/core/utils';

const colors = ['#eb2a1c', '#eb2a1c', '#e8831e', '#f0d030', '#fff952', '#5aff54'];

// optimize prop splitting
const PasswordField = forwardRef(({ styles = {}, strengthBar = false, size, round, error, showError, icon, label, left, right, defaultValue, onEnter, ...props }: { strengthBar?: boolean; } & Omit<FieldProps, 'type'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.container': {
            minWidth: 'clamp(0px, 12em, 100vw)'
        },

        '.error': {
            fontSize: '.8em',
            fontWeight: 500,
            color: 'var(--f-clr-error-100)'
        }
    });

    const [value, setValue] = props.value !== undefined ? [props.value] : useState<FluidInputvalue>(defaultValue || '');
    const [visible, setVisible] = useState(false);

    const strength = useMemo(() => {
        let strength = 0;

        for (const regx of [/[a-z]/, /[A-Z]/, /\d/, /\W|_/, new RegExp(`.{${props.minLength || 10},}`)]) {
            if (regx.test(value?.toString() || '')) strength++;
        }

        return strength;
    }, [value, props.minLength]);

    const [split, rest] = useInputProps(props);

    return <div ref={ref} {...rest} className={classes(style.container, props.className)}>
        <Field {...split} type={visible ? 'text' : 'password'} round={round} size={size} error={error} icon={icon} label={label} left={left} value={value}
            onEnter={onEnter}
            styles={{
                '.wrapper': {
                    width: '100%'
                }
            }}
            onChange={e => {
                setValue?.(e.target.value);
                props.onChange?.(e);
            }}
            right={<Toggle round={round} size={size} variant="minimal" disabled={props.disabled} checkedContent={<MdVisibilityOff />} checked={visible} onChange={e => setVisible(e.target.checked)} style={{
                marginRight: '.3em'
            }}>
                <MdVisibility />
            </Toggle>} />

        {strengthBar && <ProgressBar value={strength / 5} color={colors[strength]} styles={{
            '.track': {
                width: '100%',
                marginTop: 'var(--f-spacing-xsm)'
            }
        }} />}

        {typeof error === 'string' && showError && error.length ? <div className={style.error}>{error}</div> : null}
    </div>;
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;