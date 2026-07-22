'use client';

import { Selectors } from "../../../src/types";
import { Fragment, useId, useLayoutEffect, useRef, useState } from "react";
import Scrollarea from "../layout/scrollarea";
import Toggle from "../input/toggle";
import { createStyles } from "../../core/style";
import { ariaLabels, classes, combineClasses } from "../../core/utils";
import { Icon } from "../../core/icons";

// todo: variants?

const styles = createStyles('code', {
    '.wrapper': {
        fontSize: 'var(--f-font-size-sml)',
        backgroundColor: 'var(--f-clr-surface-200)',
        border: 'solid 1px var(--f-clr-surface-200)',
        borderRadius: 'var(--f-radius-med)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--f-clr-text-100)'
    },

    '.header': {
        padding: '.8em 1em',
        fontWeight: 500
    },

    '.body': {
        borderRadius: 'calc(var(--f-radius-med) - 1px)',
        backgroundColor: 'var(--f-clr-surface-100)',
        flexGrow: 1
    },

    '.code': {
        display: 'flex',
        paddingInline: '1em',
        minHeight: '100%'
    },

    '.numbers': {
        userSelect: 'none',
        textAlign: 'right',
        color: 'var(--f-clr-grey-500)',
        paddingBlock: '1em',
        paddingRight: '.5em',
        borderRight: 'solid 1px var(--f-clr-surface-200)'
    },

    '.tab': {
        display: 'inline-block',
        minWidth: '2em'
    },

    '.content': {
        width: 'max-content',
        paddingBlock: '1em'
    },

    '.content[data-numbered="true"]': {
        paddingLeft: '1em'
    },

    '.button__align': {
        position: 'absolute',
        zIndex: '99',
        right: '1em',
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        maxHeight: '100%'
    },

    '.wrapper .toggle': {
        marginBlock: '1em'
    },

    '.wrapper .toggle[data-checked="false"]': {
        background: 'var(--f-clr-bg-100)'
    }
});

export type CodeSelectors = Selectors<'wrapper' | 'header' | 'body' | 'code' | 'numbers' | 'tab' | 'content'>;

/**
 * Displays formatted code.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/code}
 */
export default function Code({ children, cc = {}, title, lineNumbers = true, dangerouslyInject, ...props }: {
    children: string;
    ref?: React.Ref<HTMLDivElement>;
    cc?: CodeSelectors;
    /**
     * @default true
     */
    lineNumbers?: boolean;
    /**
     * Allows for settings HTML content directly.
     * 
     * Should be used with **CAUTION**, since this could introduce XSS vulnerabilities.
     * 
     * @default false
     */
    dangerouslyInject?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const timeout = useRef<any>(undefined);
    const [copied, setCopied] = useState(false);

    useLayoutEffect(() => () => clearTimeout(timeout.current), []);

    return <div {...props} className={classes(style.wrapper, props.className)}>
        {title && <div className={style.header}>
            {title}
        </div>}
        <Scrollarea className={style.body}>
            <code className={style.code}>
                {lineNumbers && <div className={style.numbers}>
                    {children.split(/\n/).map((_, i) => <Fragment key={i}>
                        {i + 1} <br />
                    </Fragment>)}
                </div>}
                <Scrollarea direction="horizontal" behavior="shift">
                    <pre
                        id={id}
                        className={style.content}
                        data-numbered={lineNumbers}
                        dangerouslySetInnerHTML={dangerouslyInject ? { __html: children } : undefined}>
                        {dangerouslyInject ? undefined : children}
                    </pre>
                </Scrollarea>
            </code>
        </Scrollarea>

        <div className={style.button__align}>
            <Toggle
                compact
                readOnly
                checked={copied}
                cc={{
                    ...cc,
                    toggle: style.toggle
                }}
                aria-label={ariaLabels.copy}
                onClick={() => {
                    clearTimeout(timeout.current);

                    // copy code content to clipboard
                    const range = document.createRange(),
                        el = document.getElementById(id) as HTMLDivElement;
                    range.selectNodeContents(el);
                    document.getSelection()?.addRange(range);

                    try {
                        navigator.clipboard.writeText(el.innerText);
                    } catch (ex) {
                        document.execCommand('copy');
                    }

                    // toggle copy button visual state
                    setCopied(true);
                    timeout.current = setTimeout(() => setCopied(false), 2000);
                }}>
                <Icon type="copy" />
                <Icon type="check" />
            </Toggle>
        </div>
    </div>;
}