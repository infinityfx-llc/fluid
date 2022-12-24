import React, { useState } from 'react';
import { combine, mergeFallback } from '@core/utils';
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

const TabMenu = FluidComponent((props, ref) => {
    const { styles, domProps } = props;
    const [active, setActive] = useState(0);

    return <nav {...domProps} className={combine(props.className, styles.menu)} ref={ref} data-size={props.size}>
        {props.options.map((name, i) => {
            return <div key={i} className={styles.option}>
                <Focus element="button" size="fil" className={styles.button} data-active={active == i} onClick={() => setActive(i)}>
                    {name}
                </Focus>
                <Morph noDeform duration={0.35} active={active == i}>
                    <div className={styles.line} />
                </Morph>
            </div>;
        })}
    </nav>;
},
    defaultStyles
);

TabMenu.defaultProps = {
    options: []
};

export default TabMenu;