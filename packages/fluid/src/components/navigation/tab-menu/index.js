import React, { Children, cloneElement, useRef, useState } from 'react';
import { mergeFallback } from '@core/utils';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { Focus } from '@components/feedback';
import { Morph } from '@infinityfx/lively/auto';

export default function TabMenu({ children, styles, size, options }) {
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const [active, setActive] = useState(0);

    return <nav className={style.menu}>
        {options.map((name, i) => {
            return <div className={style.option}>
                <Focus element="button" size="fil" className={style.button} onClick={() => setActive(i)}>
                    {name}
                </Focus>
                <Morph noDeform duration={0.35} active={active === i}>
                    <div className={style.line} />
                </Morph>
            </div>;
        })}
    </nav>;
}

TabMenu.defaultProps = {
    styles: {},
    size: 'med',
    options: []
};

// always active??