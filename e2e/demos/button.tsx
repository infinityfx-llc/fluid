import { Button, CardContent } from '@/fluid';
import { Animate } from '@infinityfx/lively';

export default function () {

    return <CardContent align="vertical" stretch>
        <Animate animate={{
            opacity: [0, 1],
            translate: ['0px 8px', '0px 0px']
        }}>
            <Button>
                Default button
            </Button>

            <Button variant="inverted">
                Inverted button
            </Button>

            <Button variant="muted">
                Muted button
            </Button>

            <Button variant="minimal">
                Minimal button
            </Button>
        </Animate>
    </CardContent>;
}