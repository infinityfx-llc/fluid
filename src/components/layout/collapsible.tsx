import { classes } from "@/src/core/utils";
import useStyles from "@/src/hooks/use-styles";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";

const Collapsible = forwardRef(({ children, shown, ...props }: { shown: boolean; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = useStyles({
        '.wrapper': {
            overflow: 'hidden',
            transition: 'max-height .35s'
        },

        '.content': {
            transition: 'opacity .35s'
        },

        '.content[data-collapsed="true"]': {
            opacity: 0
        }
    });

    const content = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState({ height: Number.MAX_VALUE });

    function resize() {
        if (content.current) setSize(content.current.getBoundingClientRect());
    }

    useLayoutEffect(() => {
        resize();

        const observer = new ResizeObserver(resize);
        if (content.current) observer.observe(content.current);

        return () => observer.disconnect();
    }, []);

    const styles = shown ? { maxHeight: size.height + 'px' } : { maxHeight: '0px' };

    return <div ref={ref} className={style.wrapper} style={{ ...styles, ...props.style }} aria-hidden={!shown}>
        <div ref={content} className={classes(style.content, props.className)} data-collapsed={!shown}>
            {children}
        </div>
    </div>;
});

Collapsible.displayName = 'Collapsible';

export default Collapsible;