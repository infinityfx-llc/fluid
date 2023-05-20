import React, { useEffect } from 'react';
import { Animatable } from '@infinityfx/lively';
import { useLink } from '@infinityfx/lively/hooks';
import useAudioSpectrum from '@hooks/audio-spectrum';
import defaultStyles from './style';
import useStyles from '@hooks/styles';

export default function AudioWaveform({ source, bands, mirrored, minFrequency, maxFrequency, ...props }) {
    const style = useStyles(defaultStyles);

    return <div {...props} className={style.spectrum}>
    </div>;
}

AudioWaveform.defaultProps = {
    bands: 5,
    mirrored: true, // todo
    minFrequency: 100,
    maxFrequency: 2000
};