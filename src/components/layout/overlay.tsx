'use client';

import useStyles from "@/src/hooks/use-styles";
import { FluidStyles } from "@/src/types";
import { Animatable } from "@infinityfx/lively";
import { LayoutGroup } from "@infinityfx/lively/layout";
// import { createFocusTrap, FocusTrap } from "focus-trap";
import { useEffect, useRef, useState } from 'react';
import { createPortal } from "react-dom";

export type OverlayStyles = FluidStyles<'.tint'>;

export default function Overlay({ children, styles = {}, show, onClose }: { children?: React.ReactNode; styles?: OverlayStyles; show: boolean; onClose: () => void; }) {
    const style = useStyles(styles, {
        '.overlay': {
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
        },

        '.tint': {
            zIndex: -1,
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgb(0, 0, 0, .35)'
        }
    });

    // const trap = useRef<FocusTrap>();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (mounted && show) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else
            if (!show) {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        setMounted(true);

        function keypress(e: KeyboardEvent) {
            if (show && e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', keypress);

        return () => window.removeEventListener('keydown', keypress);
    }, [show]);

    return mounted ? createPortal(<LayoutGroup adaptive={false}>
        {/* {show && <div ref={el => {
            if (el && !trap.current) {
                trap.current = createFocusTrap(el);
                trap.current.activate();
            }

            if (!el && trap.current) {
                trap.current.deactivate();
                trap.current = undefined;
            }
        }} className={style.overlay}> */}
        {show && <div className={style.overlay}>
            {children}

            <Animatable key="overlay" animate={{ opacity: [0, 1], duration: .25 }} unmount triggers={[{ on: 'mount' }]}>
                <div className={style.tint} onClick={onClose} />
            </Animatable>
        </div>}
    </LayoutGroup>, document.getElementById('__fluid') as HTMLElement) : null;
}