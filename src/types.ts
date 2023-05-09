export type FluidStyles = {
    [key: string]: React.CSSProperties | {
        [key: string]: React.CSSProperties
    }
};

export type Selectors<T extends string = any> = {
    [key in T]: string;
};

export type FluidSize = 'sml' | 'med' | 'lrg';

export type FluidError = null | boolean | string;