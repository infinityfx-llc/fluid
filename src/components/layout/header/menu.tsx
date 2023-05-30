import { forwardRef, useState } from "react";
import { Hamburger } from "../../input";
import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { LayoutGroup } from "@infinityfx/lively/layout";
import { Animatable } from "@infinityfx/lively";
import { Pop } from "@infinityfx/lively/animations";
import Scrollarea from "../scrollarea";

const Menu = forwardRef(({ styles = {}, children, ...props }: { styles?: FluidStyles; } & React.HTMLAttributes<HTMLButtonElement>, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const style = useStyles(styles, {
        '.hamburger': {
            zIndex: 1
        },

        '.menu': {
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'var(--f-clr-fg-100)',
            transformOrigin: 'right',
            paddingInline: '18rem',
            paddingTop: '5rem',
            display: 'flex'
        },

        '.content': {
            flexGrow: 1
        }
    });

    const [open, setOpen] = useState(false);

    return <>
        <Hamburger ref={ref} {...props} open={open} onClick={() => setOpen(!open)} className={style.hamburger} />

        <LayoutGroup adaptive={false}>
            {open && <Animatable animate={{ scale: ['0% 100%', '100% 100%'], duration: .6 }} unmount triggers={[{ on: 'mount' }]}>
                <div className={style.menu}>
                    <Scrollarea className={style.content}>
                        <Animatable animate={Pop}>
                            {children}
                        </Animatable>
                    </Scrollarea>
                </div>
            </Animatable>}
        </LayoutGroup>
    </>;
});

Menu.displayName = 'Header.Menu';

export default Menu;