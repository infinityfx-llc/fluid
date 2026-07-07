'use client';

import { Selectors } from "../../../src/types";
import { Animate, LayoutGroup } from "@infinityfx/lively";
import { useEffect, useState, useRef } from 'react';
import { createPortal } from "react-dom";
import { createStyles } from "../../core/style";
import { combineClasses } from "../../core/utils";
import useFocusTrap from "../../hooks/use-focus-trap";

const OverlayData = {
    count: 0
};

const toggleScroll = (value: boolean) => document.documentElement.style.overflowY = value ? '' : 'hidden';

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
        backgroundColor: 'color-mix(in srgb, var(--f-clr-bg-100) 65%, transparent)',
        backdropFilter: 'blur(6px)'
    },

    '.overlay > *:not(:first-child)': {
        isolation: 'isolate'
    }
});

export type OverlaySelectors = Selectors<'tint'>;

/**
 * Displays content overlayed onto the page.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/overlay}
 */
export default function Overlay({ children, cc = {}, show, onClose }: {
    children?: React.ReactNode;
    cc?: OverlaySelectors;
    show: boolean;
    onClose: () => void;
}) {
    const style = combineClasses(styles, cc);

    const previous = useRef(false);
    const trap = useFocusTrap<HTMLDivElement>(show);
    const [mounted, setMounted] = useState(false);
    const [opened, setOpened] = useState(false); // not ideal solution..

    useEffect(() => {
        if (!show) setOpened(false);
    }, [show]);

    useEffect(() => {
        setMounted(true);

        if (previous.current !== show) OverlayData.count += show ? 1 : -1; // update the amount of open overlays
        previous.current = show;

        if (mounted && show) {
            toggleScroll(false); // disable page scrolling when overlay opens

            if (trap.current) trap.current.style.zIndex = (OverlayData.count + 999).toString(); // update the zIndex position based on the amount of open overlays
        }

        if (!show && !OverlayData.count) toggleScroll(true); // enable page scrolling again if no more overlays are open

        function keypress(e: KeyboardEvent) {
            if (show && e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', keypress);

        return () => {
            window.removeEventListener('keydown', keypress);

            if (show && show === previous.current) {
                OverlayData.count--;
                previous.current = false;
            }

            if (!OverlayData.count) toggleScroll(true); // enable page scrolling again if no more overlays are open
        }
    }, [show]);

    return mounted ? createPortal(<LayoutGroup>
        <div ref={trap} className={style.wrapper}>
            {show && <div
                className={style.overlay}
                style={{
                    pointerEvents: opened ? undefined : 'none'
                }}>
                <Animate
                    key="tint"
                    correction="none"
                    clips={{
                        mount: { opacity: [0, 1], duration: .25 },
                        unmount: { opacity: [0, 1], duration: .25 }
                    }}
                    triggers={{
                        mount: ['mount'],
                        unmount: [{ on: 'unmount', reverse: true }]
                    }}
                    onAnimationEnd={name => name === 'mount' && setOpened(true)}>
                    <div className={style.tint} onClick={onClose} />
                </Animate>

                {children}
            </div>}
        </div>
    </LayoutGroup>, document.getElementById('__fluid') as HTMLElement) : null;
}