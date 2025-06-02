'use client';

import { Selectors } from "../../../src/types";
import { Fragment, useId, useState } from "react";
import Scrollarea from "../layout/scrollarea";
import Toggle from "../input/toggle";
import { createStyles } from "../../core/style";
import { classes, combineClasses } from "../../core/utils";
import { Icon } from "../../core/icons";

const styles = createStyles('code', {
    '.wrapper': {
        fontSize: 'var(--f-font-size-sml)',
        borderRadius: 'var(--f-radius-med)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--f-clr-text-100)'
    },

    '.header': {
        backgroundColor: 'var(--f-clr-primary-400)',
        padding: '.8em 1em',
        fontWeight: 500
    },

    '.body': {
        backgroundColor: 'var(--f-clr-fg-100)',
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
        borderRight: 'solid 1px var(--f-clr-fg-200)'
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
    lineNumbers?: boolean;
    dangerouslyInject?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const style = combineClasses(styles, cc);

    const id = useId();
    const [copied, setCopied] = useState(false);

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
                <Scrollarea horizontal behavior="shift">
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
                checkedContent={<Icon type="check" />}
                checked={copied}
                cc={{
                    toggle: style.toggle,
                    ...cc
                }}
                aria-label="Copy code"
                onClick={() => {
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
                    setTimeout(() => setCopied(false), 2000);
                }}>
                <Icon type="copy" />
            </Toggle>
        </div>
    </div>;
}