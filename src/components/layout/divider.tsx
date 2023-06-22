import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { FluidSize, FluidStyles } from "@/src/types";
import { forwardRef } from "react";

const Divider = forwardRef(({ styles = {}, vertical = false, label, labelPosition = 'center', size = 'med', ...props }:
    {
        styles?: FluidStyles;
        vertical?: boolean;
        label?: string;
        labelPosition?: 'start' | 'center' | 'end';
        size?: FluidSize;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles(styles, {
        '.divider': {
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--f-spacing-xsm)',
            fontSize: 'var(--f-font-size-xsm)',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: 'var(--f-clr-grey-300)',
            paddingBlock: `var(--f-spacing-${size})`
        },

        '.divider[data-vertical="true"]': {
            writingMode: 'vertical-lr'
        },

        '.line': {
            backgroundColor: 'var(--f-clr-grey-300)',
            flexGrow: 1
        },

        '.divider[data-vertical="false"] .line': {
            height: '1px'
        },

        '.divider[data-vertical="true"] .line': {
            width: '1px'
        },
    });

    return <div ref={ref} {...props} role="separator" aria-orientation={vertical ? 'vertical' : 'horizontal'} className={classes(style.divider, props.className)} data-vertical={vertical}>
        {label && labelPosition !== 'start' && <div className={style.line} />}

        {label}

        {!(label && labelPosition === 'end') && <div className={style.line} />}
    </div>;
});

Divider.displayName = 'Divider';

export default Divider;