'use client';

import { Selectors } from '../../../../src/types';
import { createStyles } from '../../../core/style';
import { classes, combineClasses } from '../../../core/utils';

const styles = createStyles('action-menu.heading', {
    '.heading': {
        padding: '.4rem .8rem .4rem .8rem',
        fontWeight: 800,
        fontSize: '.7em',
        color: 'var(--f-clr-grey-500)'
    }
});

export type ActionMenuHeadingSelectors = Selectors<'option'>;

export default function Heading({ children, cc = {}, className, ...props }:
    {
        ref?: React.ForwardedRef<HTMLDivElement>;
        cc?: ActionMenuHeadingSelectors;
    } & React.HTMLAttributes<HTMLDivElement>) {
    const style = combineClasses(styles, cc);

    return <div {...props} className={classes(style.heading, className)}>
        {children}
    </div>;
}

Heading.displayName = 'ActionMenu.Heading';