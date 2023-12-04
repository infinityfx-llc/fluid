'use client';

import { FluidStyles, Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { LayoutGroup } from "@infinityfx/lively/layout";
import { useEffect, useState } from 'react';
import { createPortal } from "react-dom";
import { createStyles } from "../../core/style";
import { combineClasses } from "../../core/utils";
import useFocusTrap from "../../hooks/use-focus-trap";

const setBodyOverflow = (value: string) => {
    document.body.style.overflow = value;
    document.documentElement.style.overflow = value;
}

export type OverlayStyles = FluidStyles<'.tint'>;

export default function Overlay({ children, cc = {}, show, onClose }: { children?: React.ReactNode; cc?: Selectors<'tint'>; show: boolean; onClose: () => void; }) {
    const styles = createStyles('overlay', {
        '.wrapper': {
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 999
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

    const trap = useFocusTrap<HTMLDivElement>(show);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (mounted && show) {
            setBodyOverflow('hidden');
        } else
            if (!show) setBodyOverflow('');
        setMounted(true);

        function keypress(e: KeyboardEvent) {
            if (show && e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', keypress);

        return () => {
            window.removeEventListener('keydown', keypress);
            setBodyOverflow('');
        }
    }, [show]);

    return mounted ? createPortal(<LayoutGroup>
        <div ref={trap} className={style.wrapper}>
            {show && <div className={style.overlay}>
                <Animatable id="overlay" animate={{ opacity: [0, 1], duration: .25 }} triggers={[{ on: 'mount' }, { on: 'unmount', reverse: true }]}>
                    <div className={style.tint} onClick={onClose} />
                </Animatable>

                {children}
            </div>}
        </div>
    </LayoutGroup>, document.getElementById('__fluid') as HTMLElement) : null;
}