'use client';

import { FluidStyles, Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { LayoutGroup } from "@infinityfx/lively/layout";
import { useEffect, useState, useRef } from 'react';
import { createPortal } from "react-dom";
import { createStyles } from "../../core/style";
import { classes, combineClasses } from "../../core/utils";
import useFocusTrap from "../../hooks/use-focus-trap";

const toggleScroll = (value: boolean) => {
    const isScrollable = document.documentElement.scrollHeight > document.documentElement.clientHeight;
    
    document.body.style.position = value ? '' : 'fixed';
    document.documentElement.style.overflowY = value || !isScrollable ? '' : 'scroll';
}

export type OverlayStyles = FluidStyles<'.tint'>;

export default function Overlay({ children, cc = {}, show, onClose }: { children?: React.ReactNode; cc?: Selectors<'tint'>; show: boolean; onClose: () => void; }) {
    const styles = createStyles('overlay', {
        '.wrapper': {
            position: 'fixed',
            top: 0,
            left: 0
        },

        '.overlay': {
            position: 'absolute',
            width: '100vw',
            height: '100dvh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },

        '.tint': {
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgb(0, 0, 0, .35)'
        }
    });
    const style = combineClasses(styles, cc);

    const index = useRef(0);
    const trap = useFocusTrap<HTMLDivElement>(show);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (mounted && show) {
            toggleScroll(false);

            index.current = document.getElementsByClassName('__fluid__overlay').length;
            
            if (trap.current) trap.current.style.zIndex = (index.current + 999).toString();
        } else
            if (!show && !index.current) toggleScroll(true);
        setMounted(true);

        function keypress(e: KeyboardEvent) {
            if (show && e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', keypress);

        return () => {
            window.removeEventListener('keydown', keypress);
            if (!index.current) toggleScroll(true);
        }
    }, [show]);

    return mounted ? createPortal(<LayoutGroup>
        <div ref={trap} className={style.wrapper}>
            {show && <div className={classes(style.overlay, '__fluid__overlay')}>
                <Animatable id="overlay" animate={{ opacity: [0, 1], duration: .25 }} triggers={[{ on: 'mount' }, { on: 'unmount', reverse: true }]}>
                    <div className={style.tint} onClick={onClose} />
                </Animatable>

                {children}
            </div>}
        </div>
    </LayoutGroup>, document.getElementById('__fluid') as HTMLElement) : null;
}