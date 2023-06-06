import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { Animatable } from "@infinityfx/lively";
import { LayoutGroup } from "@infinityfx/lively/layout";
import { forwardRef } from "react";

const Collapsible = forwardRef(({ children, shown, ...props }: { shown: boolean; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles({
        '.content': {
            transition: 'opacity .35s',
            overflow: 'hidden'
        },

        '.content[aria-hidden="true"]': {
            opacity: 0
        }
    });

    return <LayoutGroup>
        <Animatable key="collapsible" cachable={['height']}>
            <div ref={ref} {...props} className={classes(style.content, props.className)} aria-hidden={!shown} style={{ height: shown ? undefined : '0px' }}>
                {children}
            </div>
        </Animatable>
    </LayoutGroup>;
});

Collapsible.displayName = 'Collapsible';

export default Collapsible;