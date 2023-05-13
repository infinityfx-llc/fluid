import { forwardRef } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import Toggle from "./toggle";
import useFluid from "@/src/hooks/use-fluid";

const ThemeToggle = forwardRef(() => {
    const { colorScheme, setColorScheme } = useFluid();

    return <Toggle checked={colorScheme === 'dark'} onChange={e => setColorScheme(e.target.checked ? 'dark' : 'light')} checkedContent={<MdDarkMode />}>
        <MdLightMode />
    </Toggle>
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;