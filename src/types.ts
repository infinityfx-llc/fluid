import type { ButtonStyles } from "./components/input/button";
import type { RadioStyles } from "./components/input/radio";
import type { PopoverRootReference } from "./components/layout/popover/root";
import { PartialFluidTheme } from "./core/theme";

export type FluidStyles<T extends string = string> = {
    [key in (T | string & {})]?: React.CSSProperties | {
        [key: string]: React.CSSProperties
    }
};

export type Selectors<T extends string = string> = {
    [key in T]: string;
};

export type FluidSize = 'xsm' | 'sml' | 'med' | 'lrg';

export type FluidBreakpoint = 'mob' | 'tab' | 'lap' | 'dsk';

export type FluidInputvalue = string | number | readonly string[] | undefined;

export type FluidError = null | boolean | string;

export type FluidConfig = {
    theme?: PartialFluidTheme;
    components?: {
        Button?: ButtonStyles;
        Radio?: RadioStyles;
    }
}

export {
    PopoverRootReference
};