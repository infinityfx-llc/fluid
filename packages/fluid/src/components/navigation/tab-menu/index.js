import React, { useState } from 'react';
import { mergeFallback } from '@core/utils';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { Focus } from '@components/feedback';
import { Morph } from '@infinityfx/lively/auto';
import FluidComponent from '@core/component';

// export default function TabMenu({ children, styles, size, options }) {
//     const style = useStyles(mergeFallback(styles, defaultStyles));
//     const [active, setActive] = useState(0);

//     return <nav className={style.menu}>
//         {options.map((name, i) => {
//             return <div key={i} className={style.option}>
//                 <Focus element="button" size="fil" className={style.button} data-active={active == i} onClick={() => setActive(i)}>
//                     {name}
//                 </Focus>
//                 <Morph noDeform duration={0.35} active={active == i}>
//                     <div className={style.line} />
//                 </Morph>
//             </div>;
//         })}
//     </nav>;
// }

const TabMenu = FluidComponent((props, restProps, ref) => {
    const style = useStyles(mergeFallback(props.styles, defaultStyles));
    const [active, setActive] = useState(0);

    return <nav {...restProps} className={style.menu} ref={ref}>
        {props.options.map((name, i) => {
            return <div key={i} className={style.option}>
                <Focus element="button" size="fil" className={style.button} data-active={active == i} onClick={() => setActive(i)}>
                    {name}
                </Focus>
                <Morph noDeform duration={0.35} active={active == i}>
                    <div className={style.line} />
                </Morph>
            </div>;
        })}
    </nav>;
});

TabMenu.defaultProps ={
    styles: {},
    size: 'med',
    options: []
};

export default TabMenu;