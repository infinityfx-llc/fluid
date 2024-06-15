'use client';

import { Selectors } from "../../../src/types";
import { Animatable } from "@infinityfx/lively";
import { LayoutGroup } from "@infinityfx/lively/layout";
import { useEffect, useState, useRef } from 'react';
import { createPortal } from "react-dom";
import { createStyles } from "../../core/style";
import { combineClasses } from "../../core/utils";
import useFocusTrap from "../../hooks/use-focus-trap";

const OverlayData = {
    count: 0
};

const toggleScroll = (value: boolean) => {
    const isScrollable = document.documentElement.scrollHeight > document.documentElement.clientHeight; // also do for hor scrolling?

    document.documentElement.style.overflowY = value ? '' : 'hidden';
    document.body.style.overflowY = value || !isScrollable ? '' : 'scroll';
}

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

export type OverlaySelectors = Selectors<'tint'>;

export default function Overlay({ children, cc = {}, show, onClose }: {
    children?: React.ReactNode;
    cc?: OverlaySelectors;
    show: boolean;
    onClose: () => void;
}) {
    const style = combineClasses(styles, cc);

    const previous = useRef(show);
    const trap = useFocusTrap<HTMLDivElement>(show);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (previous.current !== show) OverlayData.count += show ? 1 : -1;
        previous.current = show;

        if (mounted && show) {
            toggleScroll(false);

            if (trap.current) trap.current.style.zIndex = (OverlayData.count + 999).toString();
        }

        if (!show && !OverlayData.count) toggleScroll(true);

        function keypress(e: KeyboardEvent) {
            if (show && e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', keypress);

        return () => {
            window.removeEventListener('keydown', keypress);
            if (!OverlayData.count) toggleScroll(true);
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