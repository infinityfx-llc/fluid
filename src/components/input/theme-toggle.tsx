'use client';

import Toggle, { ToggleProps } from "./toggle";
import useFluid from "../../../src/hooks/use-fluid";
import { Icon } from "../../core/icons";

export default function ThemeToggle(props: Omit<ToggleProps, 'checkedContent' | 'checked'>) {
    const { appliedColorScheme, setColorScheme } = useFluid();

    return <Toggle {...props}
        checked={appliedColorScheme === 'dark'}
        onChange={e => {
            setColorScheme(e.target.checked ? 'dark' : 'light');
            props.onChange?.(e);
        }}
        checkedContent={<Icon type="dark" />}>
        <Icon type="light" />
    </Toggle>
}