import { Button, Group, Tooltip } from '@/fluid';
import { Animate } from '@infinityfx/lively';
import { LuBold, LuItalic, LuUnderline } from 'react-icons/lu';

export default function () {

    return <Group>
        <Animate animate={{
            opacity: [0, 1],
            translate: ['0px 8px', '0px 0px']
        }}>
            <Tooltip content="Default tooltip" position="top">
                <Button variant="neutral" aria-label="bold">
                    <LuBold />
                </Button>
            </Tooltip>

            <Tooltip content="Inverted tooltip" variant="inverted">
                <Button variant="neutral" aria-label="italic">
                    <LuItalic />
                </Button>
            </Tooltip>

            <Tooltip content="Underline (ctrl + u)">
                <Button variant="neutral" aria-label="underline">
                    <LuUnderline />
                </Button>
            </Tooltip>
        </Animate>
    </Group>;
}
