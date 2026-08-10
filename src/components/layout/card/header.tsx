import { Selectors } from "../../../../src/types";
import { classes } from "../../../../src/utils";
import { createStyles } from "../../../core/style";
import { combineClasses } from "../../../core/utils";

const styles = createStyles('card-header', {
    '.header': {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 'var(--f-spacing-sml)'
    },

    '.center': {
        alignItems: 'center'
    },

    '.p__bottom': {
        paddingBottom: 'inherit'
    },

    '.p__top': {
        paddingTop: 'inherit'
    }
});

export type CardHeaderSelectors = Selectors<'header' | 'p__bottom' | 'p__top'>;

export default function Header({ children, cc = {}, pad, center, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: CardHeaderSelectors;
        /**
         * When set adds spacing below or above the header.
         */
        pad?: 'bottom' | 'top';
        center?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div
        {...props}
        className={classes(
            style.header,
            center && style.center,
            pad && style[`p__${pad}`],
            props.className
        )}>
        {children}
    </div>;
}

Header.displayName = 'CardHeader';