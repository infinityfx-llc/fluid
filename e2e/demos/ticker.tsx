import { useState } from 'react';
import { Button, CardContent, Ticker, Annotation, Group } from '@/fluid';
import { LuMinus, LuPlus } from 'react-icons/lu';
import { Animate } from '@infinityfx/lively';

export default function () {
    const [value, setValue] = useState(1250);

    return <Animate animate={{
        opacity: [0, 1],
        delay: .25
    }}>
        <CardContent align="vertical" gap="med" style={{ justifyContent: 'center' }}>
            <Annotation label="Balance" style={{ minWidth: 'auto' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    marginBlock: '-.2em'
                }}>
                    <span>$</span> <Ticker
                        selective
                        value={value.toLocaleString()} />
                </div>
            </Annotation>

            <Group dividers style={{ alignSelf: 'center' }}>
                <Button
                    compact
                    variant="muted"
                    aria-label="decrement"
                    onClick={() => setValue(prev => Math.max(0, prev - 150))}>
                    <LuMinus />
                </Button>

                <Button
                    compact
                    variant="muted"
                    aria-label="increment"
                    onClick={() => setValue(prev => prev + 250)}>
                    <LuPlus />
                </Button>
            </Group>
        </CardContent>
    </Animate>;
}
