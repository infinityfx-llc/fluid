'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { useMemo, useState } from "react";
import Scrollarea from "../layout/scrollarea";
import Button from "../input/button";
import Checkbox from "../input/checkbox";
import { ActionMenuRoot, ActionMenuMenu, ActionMenuTrigger } from "./action-menu";
import { createStyles } from "../../core/style";
import { Icon } from "../../core/icons";
import Interactable from "../feedback/interactable";

// TODO: variants: default | minimal/light mabye?

const formatHeading = (val: any) => ('' + val).charAt(0).toUpperCase() + ('' + val).slice(1).replace(/[a-z][A-Z]/g, '$1 $2');

const styles = createStyles('table', {
    '.container': {
        backgroundColor: 'var(--f-clr-surface-200)',
        borderRadius: 'var(--f-radius-med)',
        border: 'solid 1px var(--f-clr-surface-300)'
    },

    '.table': {
        height: '100%',
        minWidth: 'max-content',
        padding: '.25em',
        paddingTop: 0
    },

    '.body': {
        gap: '1px',
        borderRadius: 'var(--f-radius-sml)',
        overflow: 'hidden'
    },

    '.row': {
        position: 'relative',
        display: 'grid',
        alignItems: 'baseline',
        padding: '.6em',
        gap: 'var(--f-spacing-sml)',
        color: 'var(--f-clr-text-100)'
    },

    '.body .row': {
        background: 'var(--f-clr-surface-100)'
    },

    '.body .cell': {
        paddingInline: '.4rem',
    },

    '.collapsed': {
        minWidth: '2rem',
        display: 'flex'
    },

    '.header': {
        fontSize: '.9em',
        fontWeight: 700
    },

    '.label': {
        position: 'relative',
        borderRadius: 'var(--f-radius-sml)',
        color: 'var(--f-clr-grey-700)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xxs)',
        width: 'max-content',
        padding: '.2rem .4rem'
    },

    '.label:enabled': {
        cursor: 'pointer'
    },

    '.row .checkbox': {
        borderColor: 'var(--f-clr-grey-300)'
    },

    '.row .checkmark': {
        stroke: 'var(--f-clr-text-200)'
    },

    '.empty': {
        gridColumn: '-1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--f-clr-surface-100)',
        padding: '.6em',
        textAlign: 'center',
        color: 'var(--f-clr-grey-700)',
        fontWeight: 600,
        flexGrow: 1
    },

    '@supports (grid-template-columns: subgrid)': {
        '.table': {
            display: 'grid',
            gridTemplateColumns: 'var(--grid-columns)',
            gridAutoRows: 'auto 1fr'
        },

        '.group': {
            display: 'grid',
            gridTemplateColumns: 'subgrid',
            gridColumn: '-1 / 1'
        },

        '.row': {
            gridTemplateColumns: 'subgrid',
            gridColumn: '-1 / 1'
        },

        '.cell': {
            maxWidth: 'var(--max-column-width)'
        }
    },

    '@supports not (grid-template-columns: subgrid)': {
        '.table': {
            display: 'flex',
            flexDirection: 'column'
        },

        '.body': {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1
        },

        '.row': {
            gridTemplateColumns: 'var(--fallback-columns)'
        }
    }
});

export type TableSelectors = Selectors<'table' | 'container' | 'group' | 'row' | 'cell' | 'collapsed' | 'header' | 'label' | 'checkbox' | 'checkmark' | 'empty'>;

type TableProps<T> = {
    ref?: React.Ref<HTMLDivElement>;
    cc?: TableSelectors;
    data: T[];
    columns: (keyof T)[];
    maxColumnWidth?: string;
    selectable?: boolean;
    sortable?: boolean | (keyof T)[];
    selected?: number[];
    onSelect?: (selected: number[]) => void;
    columnFormatters?: {
        [column in keyof T]?: (value: T[column]) => React.ReactNode;
    };
    rowActions?: (row: T, index: number) => React.ReactNode;
    /**
     * Message to display when no data is defined.
     * 
     * @default "Nothing to display"
     */
    emptyMessage?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>;

/**
 * A table displaying data.
 * 
 * @see {@link https://fluid.infinityfx.dev/docs/components/table}
 */
export default function Table<T extends { [key: string]: string | number | Date; }>({ cc = {}, data, columns, maxColumnWidth = 'auto', selectable, sortable, selected, onSelect,
    columnFormatters = {}, rowActions, emptyMessage = 'Nothing to display', ...props }: TableProps<T>) {
    const style = combineClasses(styles, cc);

    const [column, setColumn] = useState('');
    const [sorting, setSorting] = useState<'nil' | 'asc' | 'dsc'>('nil');
    const [selectedIndices, setSelectedIndices] = selected !== undefined ? [selected] : useState<number[]>([]);

    function updateSelected(value: number[]) {
        setSelectedIndices?.(value);
        onSelect?.(value);
    }

    // get a sorted list of rows according to the specified sorting
    const rows = useMemo(() => {
        return sorting === 'nil' ?
            data :
            data.toSorted((a, b) => {
                if (b[column] < a[column]) return sorting === 'asc' ? 1 : -1;
                if (b[column] > a[column]) return sorting === 'asc' ? -1 : 1;

                return 0;
            });
    }, [sorting, column, data]);

    return <Scrollarea
        {...props}
        direction="horizontal"
        behavior="shift"
        className={classes(style.container, props.className)}
        data-fb>
        <div
            role="grid"
            className={style.table}
            style={{
                ['--max-column-width' as any]: `max(${maxColumnWidth}, ${100 / columns.length}%)`,
                ['--grid-columns' as any]: `${selectable ? 'auto' : ''} repeat(${columns.length}, minmax(min-content, ${maxColumnWidth})) ${rowActions ? 'auto' : ''}`,
                ['--fallback-columns' as any]: `${selectable ? 'auto' : ''} repeat(${columns.length}, 1fr) ${rowActions ? 'auto' : ''}`
            }}>
            <div role="rowgroup" className={style.group}>
                <div
                    role="row"
                    className={classes(style.row, style.header)}>
                    {selectable && <div className={style.collapsed}>
                        <Checkbox
                            size="xsm"
                            color="var(--f-clr-text-100)"
                            cc={{
                                checkbox: style.checkbox,
                                checkmark: style.checkmark
                            }}
                            intermediate={selectedIndices.length !== rows.length}
                            checked={!!selectedIndices.length}
                            onChange={e => {
                                // select or deselect all rows
                                if (!e.target.checked) return updateSelected([]);

                                updateSelected(new Array(rows.length).fill(0).map((_, i) => i));
                            }} />
                    </div>}

                    {columns.map((col, i) => {
                        const sort = Array.isArray(sortable) ? sortable.includes(col) : sortable;

                        // returns a column header button
                        return <div
                            key={i}
                            role="columnheader"
                            className={style.cell}>
                            <Interactable
                                disabled={!sort}
                                className={style.label}
                                onClick={() => {
                                    // if sorting is enabled for this column, toggles between ascending, descending and no sorting
                                    setColumn(col as string);

                                    if (column !== col || sorting === 'nil') {
                                        setSorting('asc');
                                    } else
                                        if (sorting === 'asc') {
                                            setSorting('dsc');
                                        } else {
                                            setSorting('nil');
                                        }
                                }}>
                                {formatHeading(col)}

                                {sort && <>
                                    {(column !== col || sorting === 'nil') && <Icon type="sort" />}
                                    {column === col && sorting === 'asc' && <Icon type="sortAscend" />}
                                    {column === col && sorting === 'dsc' && <Icon type="sortDescend" />}
                                </>}
                            </Interactable>
                        </div>;
                    })}

                    {rowActions ? <div className={style.collapsed} /> : null}
                </div>
            </div>

            <div role="rowgroup" className={classes(style.group, style.body)}>
                {rows.map((row, i) => {

                    return <Interactable
                        key={i}
                        as="div"
                        role="row"
                        highlightColor="var(--f-clr-primary-300)"
                        className={style.row}>
                        {selectable && <div className={style.collapsed}>
                            <Checkbox
                                size="xsm"
                                color="var(--f-clr-text-100)"
                                cc={{ checkbox: style.checkbox, checkmark: style.checkmark }}
                                checked={selectedIndices.includes(i)}
                                onChange={e => {
                                    // select or deselect the i'th row
                                    const updated = selectedIndices.slice();
                                    e.target.checked ? updated.push(i) : updated.splice(updated.indexOf(i), 1);

                                    updateSelected(updated);
                                }} />
                        </div>}

                        {columns.map((col, i) => {
                            // format row data into string values
                            const formatter = columnFormatters[col] || (val => val.toString());

                            return <div
                                key={i}
                                role="cell"
                                className={style.cell}>
                                {formatter(row[col])}
                            </div>;
                        })}

                        {rowActions?.length ? <div className={style.collapsed}>
                            <ActionMenuRoot>
                                <ActionMenuTrigger>
                                    <Button compact variant="minimal" size="sml" style={{ marginLeft: 'auto' }}>
                                        <Icon type="more" />
                                    </Button>
                                </ActionMenuTrigger>

                                <ActionMenuMenu>
                                    {rowActions(rows[i], i)}
                                </ActionMenuMenu>
                            </ActionMenuRoot>
                        </div> : null}
                    </Interactable>;
                })}

                {!rows.length && <div className={style.empty}>
                    {emptyMessage}
                </div>}
            </div>
        </div>
    </Scrollarea>;
}