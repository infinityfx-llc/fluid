'use client';

import { forwardRef } from "react";
import Toggle, { ToggleProps } from "./toggle";
import useFluid from "../../../src/hooks/use-fluid";
import { Icon } from "../../core/icons";

const ThemeToggle = forwardRef((props: Omit<ToggleProps, 'checkedContent' | 'checked'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { appliedColorScheme, setColorScheme } = useFluid();

    return <Toggle ref={ref} {...props} checked={appliedColorScheme === 'dark'} onChange={e => {
        setColorScheme(e.target.checked ? 'dark' : 'light');
        props.onChange?.(e);
    }} checkedContent={<Icon type="dark" />}>
        <Icon type="light" />
    </Toggle>
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;