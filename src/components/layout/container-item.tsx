import { classes, combineClasses } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

const justify = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end'
};

const align = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end'
};

type ContainerItemProps<T> = {
    cc?: Selectors;
    alias?: keyof React.ReactHTML | React.JSXElementConstructor<T>;
    minWidth?: string | { [key in 'dsk' | 'lap' | 'tab' | 'mob']?: string; };
    alignHor?: 'left' | 'center' | 'right';
    alignVer?: 'top' | 'center' | 'bottom';
} & T;

function ContainerItemComponent<T extends React.HTMLAttributes<any>>({ children, cc = {}, alias = 'div', minWidth, alignHor, alignVer, ...props }: ContainerItemProps<T>, ref: React.ForwardedRef<any>) {
    const styles = createStyles('container-item', fluid => {
        const styles: any = {
            '.contained': {
                flexBasis: 'calc(100% / var(--f-container-columns) - var(--f-container-spacing) * (var(--f-container-columns) - 1) / var(--f-container-columns))',
                flexGrow: 1,
                display: 'flex',
                alignSelf: 'stretch',
                minWidth: 'var(--f-mw-dsk)'
            }
        };

        for (const key of ['lap', 'tab', 'mob'] as const) {
            styles[`@media (max-width: ${fluid.breakpoints[key]}px)`] = {
                '.contained': {
                    minWidth: `var(--f-mw-${key})`
                }
            }
        }

        return styles;
    });
    const style = combineClasses(styles, cc);

    const minWidths = typeof minWidth === 'string' ? { dsk: minWidth } : minWidth ?? {};
    const dskWidth = minWidths.dsk,
        lapWidth = minWidths.lap || dskWidth,
        tabWidth = minWidths.tab || lapWidth,
        mobWidth = minWidths.mob || tabWidth;

    const Alias = alias as any;

    return <Alias ref={ref} {...props} className={classes(style.contained, props.className)} style={{
        ...props.style,
        justifyContent: alignHor ? justify[alignHor] : undefined,
        alignItems: alignVer ? align[alignVer] : undefined,
        ['--f-mw-dsk' as any]: dskWidth,
        ['--f-mw-lap' as any]: lapWidth,
        ['--f-mw-tab' as any]: tabWidth,
        ['--f-mw-mob' as any]: mobWidth
    }}>
        {children}
    </Alias>;
}

const ContainerItem = forwardRef(ContainerItemComponent) as (<T extends React.HTMLAttributes<any>>(props: ContainerItemProps<T> & { ref?: React.ForwardedRef<any>; }) => ReturnType<typeof ContainerItemComponent>) & { displayName: string; };

ContainerItem.displayName = 'ContainerItem';

export default ContainerItem;