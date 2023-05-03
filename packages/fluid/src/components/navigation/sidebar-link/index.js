import React, { useEffect, useRef } from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { mergeFallback } from '@core/utils';
import { MailIcon } from '@components/icons';
import { Focus } from '@components/feedback';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';

export default function SidebarLink({ children, styles, active, collapsed }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [link, setLink] = useLink(active ? 1 : 0);
    const ref = useRef();

    useEffect(() => setLink(active ? 1 : 0), [active]);
    useEffect(() => {
        collapsed ? ref.current.play('default') : ref.current.play('default', { reverse: true });
    }, [collapsed]);
    const w = `${children.length * 0.5}em`; // TEMP SOLUTION

    return <div className={style.link} data-active={active}>
        <Focus size="fil" className={style.focus}>
            <MailIcon className={style.icon} />
            {/* <Animatable onMount={collapsed} ref={ref} lazy={false} initial={{ origin: { x: 0, y: 0.5 } }} animate={{ opacity: [1, 0, 0], width: [w, w, 0], marginLeft: ['1.2rem', '1.2rem', 0] }}> */}
            <Animatable onMount={collapsed} ref={ref} lazy={false} initial={{ origin: { x: 0, y: 0.5 } }} animate={{ opacity: [1, 0, 0], width: [w, w, 0], marginLeft: ['16px', '16px', 0] }}>
                <span>
                    <span style={{ width: w, position: 'absolute' }}>
                        {children}
                    </span>
                </span>
            </Animatable>
        </Focus>

        <Animatable onMount noDeform lazy={false} animate={{ scale: link(val => ({ x: 1, y: val })) }}>
            <div className={style.line} />
        </Animatable>
    </div>;
}

SidebarLink.defaultProps = {
    styles: {},
    active: false,
    collapsed: false
}

// LIVELY ERROR: d.emtopx is not a function