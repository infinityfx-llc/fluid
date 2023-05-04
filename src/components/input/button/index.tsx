import useStyles from "@/src/hooks/use-styles";
import { forwardRef } from "react";

type FluidStyles = {
    [key: string]: React.CSSProperties
};

const Button = forwardRef(({ children, styles = {}, ...props }: { children: React.ReactNode; styles?: FluidStyles; } & React.HTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const classes = useStyles(styles, {
        '.button': {
            border: 'none',
            borderRadius: '4px',
            padding: '6px',
            backgroundColor: 'grey',
            color: 'white'
        }
    });

    return <button ref={ref} type="button" className={classes.button}>
        {children}
    </button>;
});

Button.displayName = 'Button';

export default Button;