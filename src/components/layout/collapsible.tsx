import { classes, combineClasses } from "../../../src/core/utils";
import { FluidStyles, Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { LayoutGroup } from "@infinityfx/lively/layout";
import { forwardRef } from "react";
import { createStyles } from "../../core/style";

const Collapsible = forwardRef(({ children, cc = {}, shown, ...props }: { cc?: Selectors<'content'>; shown: boolean; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const styles = createStyles('collapsible', {
        '.content': {
            overflow: 'hidden'
        }
    });
    const style = combineClasses(styles, cc);

    return <LayoutGroup>
        <Animatable id="collapsible" cachable={['height', 'opacity']} adaptive>
            <div ref={ref} {...props} aria-hidden={!shown} className={classes(style.content, props.className)} style={{ ...props.style, height: shown ? undefined : '0px', opacity: shown ? 1 : 0 }}>
                {children}
            </div>
        </Animatable>
    </LayoutGroup>;
});

Collapsible.displayName = 'Collapsible';

export default Collapsible;