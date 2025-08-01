import { cloneElement, useId } from "react";
import { classes, combineClasses } from "../../core/utils";
import { createStyles } from "../../core/style";
import { Selectors } from "../../types";
import Collapsible from "../layout/collapsible";

const styles = createStyles('annotation', {
    '.wrapper': {
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--f-clr-text-100)',
        minWidth: 'min(100vw, 12em)',
        ['--width' as any]: '100%'
    },

    '.s__xsm': {
        fontSize: 'var(--f-font-size-xxs)'
    },

    '.s__sml': {
        fontSize: 'var(--f-font-size-xsm)'
    },

    '.s__med': {
        fontSize: 'var(--f-font-size-sml)'
    },

    '.s__lrg': {
        fontSize: 'var(--f-font-size-med)'
    },

    '.label, .error': {
        fontSize: '.8em',
        fontWeight: 500
    },

    '.label': {
        paddingBottom: 'var(--f-spacing-xxs)'
    },

    '.error': {
        color: 'var(--f-clr-error-100)',
        paddingTop: 'var(--f-spacing-xxs)'
    }
});

export type AnnotationSelectors = Selectors<'wrapper' | 'label' | 'error' | 's__xsm' | 's__sml' | 's__med' | 's__lrg'>;

/**
 * Displays a label or error message for an input field.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/annotation}
 */
export default function Annotation({ children, cc = {}, label, error, ...props }: {
    ref?: React.Ref<HTMLDivElement>;
    children: React.ReactElement<any>;
    cc?: AnnotationSelectors;
    label?: string;
    error?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const size = children.props.size || 'med';
    const required = !!children.props.required;

    return <div
        {...props}
        className={classes(
            style.wrapper,
            style[`s__${size}`],
            props.className
        )}>
        {label && <div id={id} className={style.label}>
            {label}{required ? ' *' : ''}
        </div>}

        {cloneElement(children, {
            'aria-labelledby': label ? id : undefined,
            'data-fc': true
        })}

        <Collapsible shown={!!error}>
            <div className={style.error}>
                {error}
            </div>
        </Collapsible>
    </div>;
}