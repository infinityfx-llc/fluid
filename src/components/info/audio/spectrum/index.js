import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';
import React, { useEffect } from 'react';
import useAudioSpectrum from '@hooks/audio-spectrum';
import { is, throttle } from '@core/utils/helper';
import style from './style.module.css';

export default function AudioSpectrum({ src, bands = 5, ...props }) {
    const getSpectrum = useAudioSpectrum(src, { bands, minFrequency: 100, maxFrequency: 2000 });
    const [link, setLink] = useLink(getSpectrum());

    const test = throttle(() => {
        setLink(getSpectrum(), 0.05);
    }, 50);

    let frame;
    const update = () => {
        test();

        frame = requestAnimationFrame(update);
    };

    const suspend = () => cancelAnimationFrame(frame);

    useEffect(() => {
        const audio = is.object(src) && 'current' in src ? src.current : src;
        if (!(audio instanceof Audio)) return;

        audio.addEventListener('play', update);
        audio.addEventListener('pause', suspend);
        audio.addEventListener('ended', suspend);

        return () => {
            audio.removeEventListener('play', update);
            audio.removeEventListener('pause', suspend);
            audio.removeEventListener('ended', suspend);
        }
    }, [src]);

    return <div className={style.spectrum} {...props}>
        {new Array(bands).fill(0).map((_, i) => {
            return <Animatable key={i} noDeform lazy={false} animate={{ interpolate: 'ease', scale: link(val => ({ y: val[i] })) }}>
                <div></div>
            </Animatable>;
        })}
    </div>;
}