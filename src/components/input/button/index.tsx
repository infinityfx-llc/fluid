import { forwardRef } from "react";

type FluidStyles<T extends string> = {
    [key in T]: React.CSSProperties
};

const defaultStyles: FluidStyles<'button'> = {
    button: {
        border: 'none',
        borderRadius: 4,
        padding: 6,
        backgroundColor: 'grey',
        color: 'white'
    }
};

const Button = forwardRef(({ children, styles = defaultStyles, ...props }: { children: React.ReactNode; styles?: FluidStyles<'button'>; } & React.HTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {

    return <button ref={ref} type="button" style={styles.button}>
        {children}
    </button>;
});

Button.displayName = 'Button';

export default Button;