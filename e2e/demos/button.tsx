import { Button, CardContent } from '@/fluid';

export default function () {

    return <CardContent align="vertical" stretch>
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
    </CardContent>;
}
