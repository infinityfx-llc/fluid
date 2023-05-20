import useStyles from "@/src/hooks/use-styles";
import { Animatable } from "@infinityfx/lively";
import { LayoutGroup } from "@infinityfx/lively/layout";
import { useEffect, useState } from 'react';
import { createPortal } from "react-dom";

export default function Overlay({ children, show, onClose }: { children?: React.ReactNode; show: boolean; onClose: () => void; }) {
    const style = useStyles({
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        function keypress(e: KeyboardEvent) {
            if (show && e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', keypress);

        return () => window.removeEventListener('keydown', keypress);
    }, [show]);

    return mounted ? createPortal(<LayoutGroup adaptive={false}>
        {show && <div className={style.overlay}>
            {children}

            <Animatable animate={{ opacity: [0, 1], duration: .25 }} unmount triggers={[{ on: 'mount' }]}>
                <div className={style.tint} onClick={onClose} />
            </Animatable>
        </div>}
    </LayoutGroup>, document.body) : null;
}