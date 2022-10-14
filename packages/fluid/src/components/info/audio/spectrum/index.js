import React, { useEffect } from 'react';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';
import useAudioSpectrum from '@hooks/audio-spectrum';
import defaultStyles from './style';
import useStyles from '@hooks/styles';

export default function AudioSpectrum({ source, bands, mirrored, minFrequency, maxFrequency, ...props }) {
    const style = useStyles(defaultStyles);
    const getSpectrum = useAudioSpectrum(source, { bands, minFrequency, maxFrequency });
    const [link, setLink] = useLink(getSpectrum());

    let frame;
    const update = () => { // maybe implement new hook ?
        setLink(getSpectrum());

        frame = requestAnimationFrame(update);
    };

    const suspend = () => {
        cancelAnimationFrame(frame);
        setLink(new Array(bands).fill(0.1), 0.35);
    };

    useEffect(() => {
        const audio = source.current;
        if (!(audio instanceof Audio)) return;

        audio.addEventListener('play', update);
        audio.addEventListener('pause', suspend);
        audio.addEventListener('ended', suspend);

        return () => {
            if (!audio) return;

            audio.removeEventListener('play', update);
            audio.removeEventListener('pause', suspend);
            audio.removeEventListener('ended', suspend);
        }
    }, [source]);

    return <div {...props} className={style.spectrum}>
        {new Array(bands).fill(0).map((_, i) => {
            return <Animatable key={i} noDeform lazy={false} animate={{ scale: link(val => ({ y: val[i] })) }}>
                <div className={style.band}></div>
            </Animatable>;
        })}
    </div>;
}

AudioSpectrum.defaultProps = {
    bands: 5,
    mirrored: true, // todo
    minFrequency: 100,
    maxFrequency: 2000
};