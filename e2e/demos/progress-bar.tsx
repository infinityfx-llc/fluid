import { useState } from 'react';
import { Button, CardContent, ProgressBar, Annotation } from '@/fluid';
import { Animate } from '@infinityfx/lively';

export default function () {
    const [progress, setProgress] = useState(0.25);

    return <CardContent align="vertical" gap="med">
        <Animate animate={{
            opacity: [0, 1],
            translate: ['0px 8px', '0px 0px']
        }}>
            <Annotation label={`Progress ${Math.round(progress * 100)}%`}>
                <ProgressBar value={progress} />
            </Annotation>

            <Button
                compact
                variant="muted"
                onClick={() => setProgress(prev => (prev >= 1 ? 0.25 : Math.min(1, prev + 0.35)))}>
                Increase progress
            </Button>
        </Animate>
    </CardContent>;
}
