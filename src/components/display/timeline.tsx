import { classes } from '@/src/core/utils';
import useStyles from '@/src/hooks/use-styles';
import { FluidStyles } from '@/src/types';
import { forwardRef, Children } from 'react';

const Timeline = forwardRef(({ children, styles = {}, active, horizontal = false, uniform, reverse, ...props }: { styles?: FluidStyles; active: number; horizontal?: boolean; uniform?: boolean; reverse?: boolean; } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const len = Children.count(children);

    const style = useStyles(styles, {
        '.timeline': {
            display: 'grid',
            color: 'var(--f-clr-text-100)',
            fontSize: 'var(--f-font-size-sml)',
        },

        '.timeline[data-horizontal="true"]': {
            gridAutoFlow: 'column'
        },

        '.timeline[data-uniform="true"]': {
            gridAutoColumns: '1fr',
            gridAutoRows: '1fr'
        },

        '.event': {
            position: 'relative',
            display: 'flex',
            gap: 'var(--f-spacing-sml)',
            flexGrow: 1
        },

        '.timeline[data-horizontal="true"] .event': {
            flexDirection: 'column'
        },

        '.event:not(:last-child)': {
            paddingBottom: 'var(--f-spacing-med)'
        },

        '.timeline[data-horizontal="true"] .event:not(:last-child)': {
            paddingRight: 'var(--f-spacing-med)'
        },

        '.timeline[data-horizontal="false"] .segment': {
            display: 'flex',
            width: '1.5em',
            justifyContent: 'center'
        },

        '.timeline[data-horizontal="true"] .segment': {
            display: 'flex',
            height: '1.5em',
            alignItems: 'center'
        },

        '.bullet': {
            position: 'relative',
            height: '1.5em',
            width: '1.5em',
            borderRadius: '999px',
            border: 'solid .25em var(--f-clr-grey-200)',
            zIndex: 1,
            transition: 'border-color .25s'
        },

        '.bullet[data-active="true"]': {
            borderColor: 'var(--f-clr-primary-100)'
        },

        '.bullet::after': {
            content: '""',
            position: 'absolute',
            inset: '3px',
            borderRadius: '999px',
            backgroundColor: 'var(--f-clr-primary-100)',
            opacity: 0,
            transition: 'opacity .25s'
        },

        '.bullet[data-active="true"]::after': {
            opacity: 1
        },

        '.progress': {
            position: 'absolute',
            flexGrow: 1,
            backgroundColor: 'var(--f-clr-grey-200)',
            transition: 'background-color .25s'
        },

        '.timeline[data-horizontal="false"] .progress': {
            height: 'calc(100% - 1.25em)',
            width: '.25em',
            bottom: '-.125em'
        },

        '.timeline[data-horizontal="true"] .progress': {
            width: 'calc(100% - 1.25em)',
            height: '.25em',
            right: '-.125em'
        },

        '.progress[data-active="true"]': {
            backgroundColor: 'var(--f-clr-primary-100)'
        },
    });

    return <div ref={ref} {...props} className={classes(style.timeline, props.className)} data-uniform={uniform} data-horizontal={horizontal}>
        {Children.map(children, (child, i) => {
            return <div className={style.event}>
                <div className={style.segment}>
                    <div className={style.bullet} data-active={(reverse ? len - 1 - i : i) < active} />

                    {i < len - 1 && <div className={style.progress} data-active={reverse ? len - 1 - i < active : i < active - 1} />}
                </div>

                {child}
            </div>;
        })}
    </div>;
});

Timeline.displayName = 'Timeline';

export default Timeline;