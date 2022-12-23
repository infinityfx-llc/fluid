import React, { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';
import useStyles from '@hooks/styles';
import defaultStyles from './style';
import { mergeRefs } from '@core/utils';

export default function Frame({ children, size, footnote, loader, aspect }) {
    const style = useStyles(defaultStyles);
    const isLoadable = isValidElement(children) && (children.type == 'img' || children.type == 'video');
    const [loaded, setLoaded] = useState(!(loader && isLoadable));
    const ref = useRef();

    useEffect(() => {
        if (ref.current.complete || ref.current.readyState >= 4) load();
    }, []);

    const load = () => setLoaded(true);

    return <div>
        <div className={style.frame} data-size={size} data-loaded={loaded} style={{ aspectRatio: aspect }}>
            {isLoadable ? cloneElement(children, {
                ref: mergeRefs(children.props.ref, ref),
                onLoad: e => {
                    children.props.onLoad?.(e);
                    load();
                },
                onCanPlayThrough: e => {
                    children.props.onCanPlayThrough?.(e);
                    load();
                }
            }) : children}
        </div>

        {footnote.length ? <div className={style.footnote}>{footnote}</div> : null}
    </div>;
}

Frame.defaultProps = {
    size: 'med',
    aspect: 3 / 2,
    footnote: '',
    loader: true
};

// could have loading indicator for images or videos
// rounded edges
// background cover
// optional bottom text (citing)
// different aspect ratios
// change loader to Animatable element