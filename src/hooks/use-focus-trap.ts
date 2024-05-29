import { useEffect, useRef } from "react"
import { getFocusable } from "../core/utils";

export default function useFocusTrap<T extends HTMLElement>(active?: boolean) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!ref.current || !active) return;

        function keydown(e: KeyboardEvent) {
            if (e.key === 'Tab' && ref.current) {
                e.preventDefault();

                let elements = getFocusable(ref.current), index = 0;
                elements.forEach((el, i) => {
                    if (el === document.activeElement) index = i + (e.shiftKey ? -1 : 1);
                });

                (elements[(index < 0 ? elements.length + index : index) % elements.length] as HTMLElement)?.focus();
            }
        }

        ref.current.addEventListener('keydown', keydown);

        return () => ref.current?.removeEventListener('keydown', keydown);
    }, [active]);

    return ref;
}