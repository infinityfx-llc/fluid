import { classes, combineClasses } from "../../../src/core/utils";
import { FluidSize, Selectors } from "../../../src/types";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

const Container = forwardRef(({ children, cc = {}, columns, spacing, ...props }: {
    cc?: Selectors<'content'>;
    columns: number;
    spacing?: FluidSize;
} & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('container', {
        '.container': {
            display: 'flex',
            flexWrap: 'wrap'
        }
    });
    const style = combineClasses(styles, cc);

    return <div ref={ref} {...props} className={classes(style.container, props.className)} style={{
        ...props.style,
        gap: spacing ? `var(--f-spacing-${spacing})` : undefined,
        ['--f-container-columns' as any]: columns,
        ['--f-container-spacing' as any]: spacing ? `var(--f-spacing-${spacing})` : '0px'
    }}>
        {children}
    </div>;
});

Container.displayName = 'Container';

export default Container;