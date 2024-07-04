import type { PopoverRootReference } from "./components/layout/popover/root";
import type { FluidIcon } from "./core/icons";
import { PartialFluidTheme } from "./core/theme";

export type FluidColorScheme = 'light' | 'dark' | 'system';

export type FluidSize = 'xsm' | 'sml' | 'med' | 'lrg';

export type FluidBreakpoint = 'mob' | 'tab' | 'lap' | 'dsk';

export type FluidInputvalue = string | number | readonly string[] | undefined;

export type FluidError = null | boolean | string;

type SharedKeys<T, P> = keyof Omit<T | P, keyof (Omit<T, keyof P> & Omit<P, keyof T>)>;

type MergeObjects<T, P> = T & P & { [K in SharedKeys<T, P>]: Merged<T[K], P[K]> };

export type Merged<T, P> = [T, P] extends [{ [key: string]: unknown }, { [key: string]: unknown }] ? MergeObjects<T, P> : T & P;

export type FluidStyles<T extends string = string> = {
    [key in (T | string & {})]?: React.CSSProperties | {
        [key: string]: React.CSSProperties | undefined
    }
}

export type Selectors<T extends string = string> = {
    [key in (T | string & {})]?: string;
}

type FluidSelectorStyles<T> = FluidStyles<T extends Selectors<infer K> ? `.${K}` : never>;

export type FluidComponents = {
    'combobox.content'?: FluidSelectorStyles<import('./components/display/combobox/content').ComboboxContentSelectors>;
    'combobox.option'?: FluidSelectorStyles<import('./components/display/combobox/option').ComboboxOptionSelectors>;
    'action-menu.menu'?: FluidSelectorStyles<import('./components/display/action-menu/menu').ActionMenuMenuSelectors>;
    'action-menu.group'?: FluidSelectorStyles<import('./components/display/action-menu/group').ActionMenuGroupSelectors>;
    'action-menu.item'?: FluidSelectorStyles<import('./components/display/action-menu/item').ActionMenuItemSelectors>;
    'action-menu.heading'?: FluidSelectorStyles<import('./components/display/action-menu/heading').ActionMenuHeadingSelectors>;
    badge?: FluidSelectorStyles<import('./components/display/badge').BadgeSelectors>;
    code?: FluidSelectorStyles<import('./components/display/code').CodeSelectors>;
    frame?: FluidSelectorStyles<import('./components/display/frame').FrameSelectors>;
    key?: FluidSelectorStyles<import('./components/display/key').KeySelectors>;
    swatch?: FluidSelectorStyles<import('./components/display/swatch').SwatchSelectors>;
    table?: FluidSelectorStyles<import('./components/display/table').TableSelectors>;
    ticker?: FluidSelectorStyles<import('./components/display/ticker').TickerSelectors>;
    timeline?: FluidSelectorStyles<import('./components/display/timeline').TimelineSelectors>;
    toast?: FluidSelectorStyles<import('./components/display/toast').ToastSelectors>;
    tooltip?: FluidSelectorStyles<import('./components/display/tooltip').TooltipSelectors>;
    'circular-progress'?: FluidSelectorStyles<import('./components/feedback/circular-progress').CircularProgressSelectors>;
    halo?: FluidSelectorStyles<import('./components/feedback/halo').HaloSelectors>;
    indicator?: FluidSelectorStyles<import('./components/feedback/indicator').IndicatorSelectors>;
    'progress-bar'?: FluidSelectorStyles<import('./components/feedback/progress-bar').ProgressBarSelectors>;
    skeleton?: FluidSelectorStyles<import('./components/feedback/skeleton').SkeletonSelectors>;
    button?: FluidSelectorStyles<import('./components/input/button').ButtonSelectors>;
    calendar?: FluidSelectorStyles<import('./components/input/calendar').CalendarSelectors>;
    checkbox?: FluidSelectorStyles<import('./components/input/checkbox').CheckboxSelectors>;
    chip?: FluidSelectorStyles<import('./components/input/chip').ChipSelectors>;
    'color-field'?: FluidSelectorStyles<import('./components/input/field').FieldSelectors>;
    'color-picker'?: FluidSelectorStyles<import('./components/input/color-picker').ColorPickerSelectors>;
    'date-field'?: FluidSelectorStyles<import('./components/input/field').FieldSelectors>;
    field?: FluidSelectorStyles<import('./components/input/field').FieldSelectors>;
    'file-field'?: FluidSelectorStyles<import('./components/input/file-field').FileFieldSelectors>;
    hamburger?: FluidSelectorStyles<import('./components/input/hamburger').HamburgerSelectors>;
    'number-field'?: FluidSelectorStyles<import('./components/input/field').FieldSelectors>;
    'password-field'?: FluidSelectorStyles<import('./components/input/field').FieldSelectors>;
    pincode?: FluidSelectorStyles<import('./components/input/pincode').PincodeSelectors>;
    radio?: FluidSelectorStyles<import('./components/input/radio').RadioSelectors>;
    segmented?: FluidSelectorStyles<import('./components/input/segmented').SegmentedSelectors>;
    select?: FluidSelectorStyles<import('./components/input/select').SelectSelectors>;
    slider?: FluidSelectorStyles<import('./components/input/slider').SliderSelectors>;
    switch?: FluidSelectorStyles<import('./components/input/switch').SwitchSelectors>;
    textarea?: FluidSelectorStyles<import('./components/input/textarea').TextareaSelectors>;
    toggle?: FluidSelectorStyles<import('./components/input/toggle').ToggleSelectors>;
    'accordion.item'?: FluidSelectorStyles<import('./components/layout/accordion/item').AccordionItemSelectors>;
    'accordion.root'?: FluidSelectorStyles<import('./components/layout/accordion/root').AccordionRootSelectors>;
    'sidebar.heading'?: FluidSelectorStyles<import('./components/layout/sidebar/heading').SidebarHeadingSelectors>;
    'sidebar.item'?: FluidSelectorStyles<import('./components/layout/sidebar/item').SidebarItemSelectors>;
    'sidebar.root'?: FluidSelectorStyles<import('./components/layout/sidebar/root').SidebarRootSelectors>;
    'sidebar.toggle'?: FluidSelectorStyles<import('./components/layout/sidebar/toggle').SidebarToggleSelectors>;
    'sidebar.user'?: FluidSelectorStyles<import('./components/layout/sidebar/user').SidebarUserSelectors>;
    collapsible?: FluidSelectorStyles<import('./components/layout/collapsible').CollapsibleSelectors>;
    combine?: FluidSelectorStyles<import('./components/layout/combine').CombineSelectors>;
    cull?: FluidStyles;
    divider?: FluidSelectorStyles<import('./components/layout/divider').DividerSelectors>;
    drawer?: FluidSelectorStyles<import('./components/layout/drawer').DrawerSelectors>;
    modal?: FluidSelectorStyles<import('./components/layout/modal').ModalSelectors>;
    overlay?: FluidSelectorStyles<import('./components/layout/overlay').OverlaySelectors>;
    panel?: FluidSelectorStyles<import('./components/layout/panel').PanelSelectors>;
    scrollarea?: FluidSelectorStyles<import('./components/layout/scrollarea').ScrollareaSelectors>;
    'navigation-menu.root'?: FluidSelectorStyles<import('./components/navigation/navigation-menu/root').NavigationMenuRootSelectors>;
    'navigation-menu.group'?: FluidSelectorStyles<import('./components/navigation/navigation-menu/group').NavigationMenuGroupSelectors>;
    'navigation-menu.link'?: FluidSelectorStyles<import('./components/navigation/navigation-menu/link').NavigationMenuLinkSelectors>;
    pagination?: FluidSelectorStyles<import('./components/navigation/pagination').PaginationSelectors>;
    stepper?: FluidSelectorStyles<import('./components/navigation/stepper').StepperSelectors>;
    tabs?: FluidSelectorStyles<import('./components/navigation/tabs').TabsSelectors>;
}

export type FluidConfig = {
    cssOutput?: 'automatic' | 'manual';
    paths?: string[];
    theme?: PartialFluidTheme;
    components?: FluidComponents;
    icons?: {
        [key in FluidIcon]?: React.JSXElementConstructor<any>;
    };
}

export {
    PopoverRootReference
}