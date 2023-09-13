import { classes, combineClasses } from "../../../src/core/utils";
import { FluidStyles, Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { LayoutGroup } from "@infinityfx/lively/layout";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

const Collapsible = forwardRef(({ children, cc = {}, shown, ...props }: { cc?: Selectors<'content'>; shown: boolean; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('collapsible', {
        '.content': {
            transition: 'opacity .35s',
            overflow: 'hidden'
        },

        '.content[aria-hidden="true"]': {
            opacity: 0
        }
    });
    const style = combineClasses(styles, cc);

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