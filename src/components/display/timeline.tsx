import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { forwardRef, Children } from 'react';
import { createStyles } from '../../core/style';

const styles = createStyles('timeline', {
    '.timeline': {
        display: 'grid',
        fontSize: 'var(--f-font-size-sml)',
    },

    '.timeline[data-horizontal="true"]': {
        gridAutoFlow: 'column'
    },

    '.timeline.uniform': {
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
        border: 'solid 3px var(--f-clr-grey-200)',
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
        transition: 'background-color .25s',
        borderRadius: '99px'
    },

    '.timeline[data-horizontal="false"] .progress': {
        height: 'calc(100% - 1.5em - 6px)',
        width: '3px',
        bottom: '3px'
    },

    '.timeline[data-horizontal="true"] .progress': {
        width: 'calc(100% - 1.5em - 6px)',
        height: '3px',
        right: '3px'
    },

    '.progress[data-active="true"]': {
        backgroundColor: 'var(--f-clr-primary-100)'
    },
});

export type TimelineSelectors = Selectors<'timeline' | 'event' | 'bullet' | 'progress'>;

const Timeline = forwardRef(({ children, cc = {}, active, horizontal = false, uniform, reverse, ...props }:
    {
        cc?: TimelineSelectors;
        active: number;
        horizontal?: boolean;
        uniform?: boolean;
        reverse?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const style = combineClasses(styles, cc);
    const len = Children.count(children);

    return <div ref={ref} {...props}
        className={classes(
            style.timeline,
            uniform && style.uniform,
            props.className
        )}
        data-horizontal={horizontal}>

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