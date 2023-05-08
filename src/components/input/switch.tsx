import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef } from 'react';

const Switch = forwardRef(({ styles = {} }: { styles?: FluidStyles }) => {
    const style = useStyles(styles, {
        '.switch': {
            position: 'relative',
            height: '1.6em',
            width: '2.8em',
            padding: '.2em',
            aspectRatio: 2,
            backgroundColor: 'red',
            borderRadius: 'var(--f-radius-sml)'
        },

        '.switch input': {
            position: 'absolute',
            visibility: 'hidden'
        },

        '.handle': {
            borderRadius: 'var(--f-radius-sml)',
            height: '100%',
            aspectRatio: 1,
            backgroundColor: 'green',
            transition: 'translate .25s'
        },

        '.switch input:checked + .handle': {
            translate: '100% 0%'
        }
    });

    return <label className={style.switch}>
        <input type="checkbox" />

        <div className={style.handle} />
    </label>;
});

Switch.displayName = 'Switch';

export default Switch;