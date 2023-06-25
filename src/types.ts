import type { PopoverRootReference } from "./components/layout/popover/root";

export type FluidStyles = {
    [key: string]: React.CSSProperties | {
        [key: string]: React.CSSProperties
    }
};

export type Selectors<T extends string = any> = {
    [key in T]: string;
};

export type FluidSize = 'xsm' | 'sml' | 'med' | 'lrg';

export type FluidBreakpoint = 'mob' | 'tab' | 'lap' | 'dsk';

export type FluidInputvalue = string | number | readonly string[] | undefined;

export type FluidError = null | boolean | string;

export {
    PopoverRootReference
};