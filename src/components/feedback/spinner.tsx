import { classes } from "../../../src/core/utils";
import useStyles from "../../../src/hooks/use-styles";
import { FluidStyles } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { forwardRef } from "react";

const Spinner = forwardRef(({ styles = {}, color = 'var(--f-clr-text-100)', ...props }: { styles?: FluidStyles; } & Omit<React.HTMLAttributes<SVGSVGElement>, 'children'>, ref: React.ForwardedRef<SVGSVGElement>) => {
    const style = useStyles(styles, {
        '.spinner': {
            stroke: color
        }
    });

    return <svg {...props} ref={ref} className={classes(style.spinner, props.className)} viewBox="0 0 100 100" width="1em" height="1em">
        <Animatable animate={{ rotate: ['0deg', '720deg'], strokeLength: [0.75, 0.25, 0.75], repeat: Infinity, easing: 'linear', duration: 2 }} triggers={[{ on: 'mount' }]}>
            <circle r={43} cx={50} cy={50} fill="none" strokeWidth={14} style={{ transformOrigin: '50% 50%' }} />
        </Animatable>
    </svg>;
});

Spinner.displayName = 'Spinner';

export default Spinner;