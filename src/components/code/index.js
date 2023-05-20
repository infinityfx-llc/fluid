import React, { Fragment } from 'react';
import { combine } from '@core/utils/css';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { mergeFallback } from '@core/utils';
import { IconButton } from '@components/buttons';
import { CopyIcon } from '@components/icons';

export default function Code({ value, styles }) { // WIP!!!
    const style = useStyles(mergeFallback(styles, defaultStyles));
    const lines = value.split(/\n/g);

    return <div className={style.block}>
        <div className={style.numbering}>
            {new Array(lines.length).fill(0).map((_, i) => {
                return <Fragment key={i}>
                    {i + 1}<br />
                </Fragment>;
            })}
        </div>
        <div className={style.code}>
            {lines.map((line, i) => {
                return <div key={i} className={style.line} dangerouslySetInnerHTML={{
                    __html: line.replace(/\t/g, `<span class="${style.tab}"></span>`)
                }} />;
            })}
        </div>
        <IconButton size="sml" className={style.button}>
            <CopyIcon />
        </IconButton>
    </div>;
}

Code.defaultProps = {
    styles: {},
    value: ''
}