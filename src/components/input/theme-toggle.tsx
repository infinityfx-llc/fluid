'use client';

import Toggle, { ToggleProps } from "./toggle";
import useFluid from "../../../src/hooks/use-fluid";
import { Icon } from "../../core/icons";

/**
 * A toggle button which switches between a light and dark color theme.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/theme-toggle}
 */
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