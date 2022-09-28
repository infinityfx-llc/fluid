import { useCallback, useEffect, useRef } from 'react';
import { is } from '@core/utils/helper';
import useAudioContext from './audio-context';

export default function useAudioSpectrum(audio, { bands = 16, minFrequency = 80, maxFrequency = 2000 } = {}) {
    const context = useAudioContext();
    const source = useRef();
    const analyser = useRef();

    const spectrum = new Array(bands).fill(0.1);
    const array = new Float32Array(1024);
    const minIndex = Math.floor((minFrequency / 24000) * 1024);
    const maxIndex = Math.floor((maxFrequency / 24000) * 1024);

    const get = useCallback(() => {
        if (!analyser.current) return spectrum;

        analyser.current.getFloatFrequencyData(array);

        let max = 0;
        for (let i = 0; i < bands; i++) {
            const idx = minIndex + i * ((maxIndex - minIndex) / bands);
            const low = Math.floor(idx);
            const diff = idx - low;
            spectrum[i] = 100 + (array[low] * (1 - diff) + array[Math.ceil(idx)] * diff);
            max = Math.max(spectrum[i], max);
        }

        return spectrum.map(val => val / max);
    }, [source, analyser]);

    const resume = () => context.state == 'suspended' && context.resume();

    useEffect(() => {
        audio = is.object(audio) && 'current' in audio ? audio.current : audio;
        if (!(audio instanceof Audio) || !context) return;

        if (!analyser.current) {
            analyser.current = new AnalyserNode(context, {
                fftSize: 2048,
                smoothingTimeConstant: 0
            });
            analyser.current.connect(context.destination);
        }

        audio.addEventListener('play', resume);
        source.current = context.createMediaElementSource(audio);
        source.current.connect(analyser.current);

        return () => audio.removeEventListener('play', resume);
    }, [audio, context]);

    return get;
}