import { classes, combineClasses } from "../../../../src/core/utils";
import { Selectors } from "../../../../src/types";
import { createStyles } from "../../../core/style";

const styles = createStyles('indicator-root', {
    '.container': {
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0
    }
});

export type IndicatorRootSelectors = Selectors<'container'>;

/**
 * Displays an activity indicator at the corner of an element.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/indicator}
 */
export default function Root({ children, cc = {}, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: IndicatorRootSelectors;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div
        {...props}
        className={classes(
            style.container,
            props.className
        )}>
        {children}
    </div>;
}