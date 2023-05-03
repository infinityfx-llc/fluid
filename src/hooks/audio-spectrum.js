import { useCallback, useEffect, useRef } from 'react';
import useAudioContext from './audio-context';

export default function useAudioSpectrum(audio, { bands, minFrequency, maxFrequency }) {
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

        for (let i = 0; i < bands; i++) {
            const idx = minIndex + i * ((maxIndex - minIndex) / bands);
            const low = Math.floor(idx);
            const diff = idx - low;
            spectrum[i] = 100 + (array[low] * (1 - diff) + array[Math.ceil(idx)] * diff);
        }

        return spectrum.map(val => Math.max(0.1, val / 70));
    }, [source, analyser]);

    const resume = () => context.state == 'suspended' && context.resume();

    useEffect(() => {
        if (!(audio.current instanceof Audio) || !context) return;

        if (!analyser.current) {
            analyser.current = new AnalyserNode(context, {
                fftSize: 2048,
                smoothingTimeConstant: 0.8
            });
            analyser.current.connect(context.destination);
        }

        audio.current.addEventListener('play', resume);
        source.current = context.createMediaElementSource(audio.current); // allow for simultaniously same source
        source.current.connect(analyser.current);

        return () => audio.current?.removeEventListener('play', resume);
    }, [audio, context]);

    return get;
}