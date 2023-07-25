'use client';

import { forwardRef } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import Toggle, { ToggleProps } from "./toggle";
import useFluid from "@/src/hooks/use-fluid";

const ThemeToggle = forwardRef((props: Omit<ToggleProps, 'checkedContent' | 'checked'>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { colorScheme, setColorScheme } = useFluid();

    return <Toggle ref={ref} {...props} checked={colorScheme === 'dark'} onChange={e => {
        setColorScheme(e.target.checked ? 'dark' : 'light');
        props.onChange?.(e);
    }} checkedContent={<MdDarkMode />}>
        <MdLightMode />
    </Toggle>
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;