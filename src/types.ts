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

export type FluidComponents = {
    'combobox.content'?: FluidStyles;
    'combobox.option'?: FluidStyles;
    'action-menu'?: FluidStyles;
    badge?: FluidStyles;
    code?: FluidStyles;
    frame?: FluidStyles;
    key?: FluidStyles;
    swatch?: FluidStyles;
    table?: FluidStyles;
    text?: FluidStyles;
    timeline?: FluidStyles;
    toast?: FluidStyles;
    tooltip?: FluidStyles;
    'circular-progress'?: FluidStyles;
    halo?: FluidStyles;
    indicator?: FluidStyles;
    'progress-bar'?: FluidStyles;
    skeleton?: FluidStyles;
    spinner?: FluidStyles;
    button?: ButtonStyles;
    calendar?: FluidStyles;
    checkbox?: FluidStyles;
    chip?: FluidStyles;
    'color-field'?: FluidStyles;
    'color-picker'?: FluidStyles;
    'date-field'?: FluidStyles;
    field?: FluidStyles;
    'file-field'?: FluidStyles;
    hamburger?: FluidStyles;
    'number-field'?: FluidStyles;
    'password-field'?: FluidStyles;
    pincode?: FluidStyles;
    radio?: RadioStyles;
    segmented?: FluidStyles;
    select?: FluidStyles;
    slider?: FluidStyles;
    switch?: FluidStyles;
    textarea?: FluidStyles;
    toggle?: FluidStyles;
    'accordion.item'?: FluidStyles;
    'accordion.root'?: FluidStyles;
    'sidebar.header'?: FluidStyles;
    'sidebar.heading'?: FluidStyles;
    'sidebar.link'?: FluidStyles;
    'sidebar.root'?: FluidStyles;
    'sidebar.user'?: FluidStyles;
    combine?: FluidStyles;
    collapsible?: FluidStyles;
    container?: FluidStyles;
    'container-item'?: FluidStyles;
    cull?: FluidStyles;
    divider?: FluidStyles;
    drawer?: FluidStyles;
    modal?: FluidStyles;
    overlay?: FluidStyles;
    panel?: FluidStyles;
    scrollarea?: FluidStyles;
    'navigation-menu.root'?: FluidStyles;
    'navigation-menu.group'?: FluidStyles;
    'navigation-menu.link'?: FluidStyles;
    pagination?: FluidStyles;
    stepper?: FluidStyles;
    tabs?: FluidStyles;
}

export type FluidConfig = {
    theme?: PartialFluidTheme;
    components?: FluidComponents;
}

export {
    PopoverRootReference
};