import { classes, combineClasses } from "../../../src/core/utils";
import { FluidStyles, Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

export type KeyStyles = FluidStyles<'.key' | '.key::after'>;

const Key = forwardRef(({ children, cc = {}, ...props }: { children: string; cc?: Selectors<'key'>; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('key', {
        '.key': {
            position: 'relative',
            fontWeight: 700,
            fontSize: 'var(--f-font-size-xsm)',
            color: 'var(--f-clr-grey-600)',
            backgroundColor: 'var(--f-clr-grey-300)',
            borderRadius: 'var(--f-radius-sml)',
            padding: '.2em .5em .4em .5em',
            zIndex: 0
        },
    
        '.key::after': {
            content: '""',
            position: 'absolute',
            backgroundColor: 'var(--f-clr-grey-200)',
            borderRadius: 'calc(var(--f-radius-sml) - 2px)',
            inset: '2px 2px calc(2px + .2em) 2px',
            zIndex: -1
        }
    });
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props} className={classes(style.key, props.className)}>
        {children}
    </div>;
});

Key.displayName = 'Key';

export default Key;