import type { ButtonStyles } from "./components/input/button";
import type { RadioStyles } from "./components/input/radio";
import type { PopoverRootReference } from "./components/layout/popover/root";
import { PartialFluidTheme } from "./core/theme";

type SharedKeys<T, P> = keyof Omit<T | P, keyof (Omit<T, keyof P> & Omit<P, keyof T>)>;

type MergeObjects<T, P> = T & P & { [K in SharedKeys<T, P>]: Merged<T[K], P[K]> };

export type Merged<T, P> = [T, P] extends [{ [key: string]: unknown }, { [key: string]: unknown }] ? MergeObjects<T, P> : T & P;

export type FluidStyles<T extends string = string> = {
    [key in (T | string & {})]?: React.CSSProperties | {
        [key: string]: React.CSSProperties | undefined
    }
};

export type Selectors<T extends string = string> = {
    [key in (T | string & {})]?: string;
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