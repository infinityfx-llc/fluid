import { classes, combineClasses } from '../../../src/core/utils';
import { Selectors } from '../../../src/types';
import { Children } from 'react';
import { createStyles } from '../../core/style';

const styles = createStyles('timeline', {
    '.timeline': {
        display: 'grid'
    },

    '.d__horizontal': {
        gridAutoFlow: 'column'
    },

    '.timeline.uniform': {
        gridAutoColumns: '1fr',
        gridAutoRows: '1fr'
    },

    '.event': {
        display: 'flex',
        gap: 'var(--f-spacing-sml)'
    },

    '.d__horizontal .event': {
        flexDirection: 'column'
    },

    '.event:not(:first-child) .content': {
        alignSelf: 'center'
    },

    '.event:last-child .content': {
        alignSelf: 'flex-end'
    },

    '.d__horizontal .event:not(:first-child) .content': {
        paddingLeft: 'var(--f-spacing-xsm)'
    },

    '.d__horizontal .event:not(:last-child) .content': {
        paddingRight: 'var(--f-spacing-xsm)'
    },

    '.d__vertical.overflow .event:last-child .content': {
        alignSelf: 'flex-start',
        paddingTop: '6px'
    },

    '.axis': {
        display: 'flex',
        gap: '3px',
        alignItems: 'center'
    },

    '.d__vertical .axis': {
        flexDirection: 'column'
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

    '.bullet::after': {
        content: '""',
        position: 'absolute',
        inset: '3px',
        borderRadius: '999px',
        backgroundColor: 'var(--f-clr-primary-100)',
        opacity: 0,
        transition: 'opacity .25s'
    },

    '.bullet[data-active="true"]': {
        borderColor: 'var(--f-clr-primary-100)'
    },

    '.bullet[data-active="true"]::after': {
        opacity: 1
    },

    '.segment': {
        height: '3px',
        backgroundColor: 'var(--f-clr-grey-200)',
        transition: 'background-color .25s',
        flexGrow: 1
    },

    '.overflow .event:last-child .segment': {
        flexGrow: 0
    },

    '.d__horizontal .segment': {
        height: '3px',
        minWidth: '3px'
    },

    '.d__vertical .segment': {
        width: '3px',
        minHeight: '3px',
        writingMode: 'vertical-lr'
    },

    '.segment:first-child': {
        borderStartEndRadius: '99px',
        borderEndEndRadius: '99px'
    },

    '.segment:last-child': {
        borderEndStartRadius: '99px',
        borderStartStartRadius: '99px'
    },

    '.segment[data-active="true"]': {
        backgroundColor: 'var(--f-clr-primary-100)'
    }
});

export type TimelineSelectors = Selectors<'timeline' | 'uniform' | 'overflow' | 'd__horizontal' | 'd__vertical' | 'event' | 'content' | 'axis' | 'bullet' | 'segment'>;

/**
 * An ordered timeline of events.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/timeline}
 */
export default function Timeline({ children, cc = {}, active, direction = 'horizontal', uniform, reverse, overflow = false, ...props }:
    {
        ref?: React.Ref<HTMLDivElement>;
        cc?: TimelineSelectors;
        /**
         * How many entries should be marked as completed.
         */
        active: number;
        direction?: 'horizontal' | 'vertical';
        /**
         * Whether all entries should be equal size, regardless of their content.
         * 
         * @default false
         */
        uniform?: boolean;
        /**
         * Show completion status in reverse order.
         * 
         * @default false
         */
        reverse?: boolean;
        /**
         * Lets the last event's content overflow past it's bullet point.
         * 
         * @default false
         */
        overflow?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);
    const childArray = Children.toArray(children);

    return <div {...props}
        className={classes(
            style.timeline,
            style[`d__${direction}`],
            uniform && style.uniform,
            overflow && style.overflow,
            props.className
        )}>

        {childArray.map((child, i) => {
            const index = reverse ? childArray.length - 1 - i : i;

            return <div key={i} className={style.event}>
                <div className={style.axis}>
                    {i !== 0 && <div className={style.segment} data-active={reverse ? index + 1 < active : index < active} />}
                    <div className={style.bullet} data-active={index < active} />
                    {i !== childArray.length - 1 && <div className={style.segment} data-active={reverse ? index < active : index + 1 < active} />}
                </div>

                <div className={style.content}>
                    {child}
                </div>
            </div>;
        })}
    </div>;
}