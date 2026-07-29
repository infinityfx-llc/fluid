import { Selectors } from "../../../../src/types";
import { classes } from "../../../../src/utils";
import { createStyles } from "../../../core/style";
import { combineClasses } from "../../../core/utils";

const styles = createStyles('box-header', {
    '.header': {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 'var(--f-spacing-sml)'
    },

    '.p__bottom': {
        paddingBottom: 'inherit'
    },

    '.p__top': {
        paddingTop: 'inherit'
    }
});

export type BoxHeaderSelectors = Selectors<'header' | 'p__bottom' | 'p__top'>;

export default function Header({ children, cc = {}, pad, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: BoxHeaderSelectors;
        pad?: 'bottom' | 'top';
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div
        {...props}
        className={classes(
            style.header,
            pad && style[`p__${pad}`],
            props.className
        )}>
        {children}
    </div>;
}

Header.displayName = 'BoxHeader';