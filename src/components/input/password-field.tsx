import { useState, forwardRef, useMemo } from 'react';
import Field, { FieldProps } from "./field";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FluidInputvalue } from '@/src/types';
import Toggle from './toggle';
import { ProgressBar } from '../feedback';

const colors = ['#eb2a1c', '#eb2a1c', '#e8831e', '#f0d030', '#fff952', '#5aff54'];

const PasswordField = forwardRef(({ children, styles = {}, strengthBar = false, ...props }: { strengthBar?: boolean; } & FieldProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const [value, setValue] = props.value !== undefined ? [props.value] : useState<FluidInputvalue>(children || '');
    const [visible, setVisible] = useState(false);

    const strength = useMemo(() => {
        let strength = 0;

        for (const regx of [/[a-z]/, /[A-Z]/, /\d/, /\W|_/, new RegExp(`.{${props.minLength || 10},}`)]) {
            if (regx.test(value?.toString() || '')) strength++;
        }

        return strength;
    }, [value, props.minLength]);

    return <div>
        <Field ref={ref} {...props} type={visible ? 'text' : 'password'} value={value} onChange={e => {
            setValue?.(e.target.value);
            props.onChange?.(e);
        }}
            right={<Toggle round={props.round} variant="minimal" disabled={props.disabled} alternate={<MdVisibilityOff />} checked={visible} onChange={e => setVisible(e.target.checked)} styles={{
                '.toggle': {
                    marginRight: '.3em'
                }
            }}>
                <MdVisibility />
            </Toggle>} />

        {strengthBar && <ProgressBar value={strength / 5} color={colors[strength]} style={{ width: '100%', marginTop: 'var(--f-spacing-xsm)' }} />}
    </div>;
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;