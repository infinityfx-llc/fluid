import { classes, combineClasses } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

const styles = createStyles('key', {
    '.key': {
        position: 'relative',
        fontWeight: 600,
        fontSize: 'var(--f-font-size-xsm)',
        color: 'var(--f-clr-grey-700)',
        backgroundColor: 'var(--f-clr-fg-100)',
        border: 'solid 1px var(--f-clr-fg-200)',
        borderRadius: 'var(--f-radius-sml)',
        padding: '.3em .5em'
    }
});

export type KeySelectors = Selectors<'key'>;

const Key = forwardRef(({ children, cc = {}, ...props }: {
    children: string;
    cc?: KeySelectors;
} & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props} className={classes(style.key, props.className)}>
        {children}
    </div>;
});

Key.displayName = 'Key';

export default Key;