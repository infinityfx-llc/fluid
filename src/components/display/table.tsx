'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import { Selectors } from "../../../src/types";
import { useState } from "react";
import Halo from "../feedback/halo";
import Scrollarea from "../layout/scrollarea";
import Button from "../input/button";
import Checkbox from "../input/checkbox";
import ActionMenu from "./action-menu/index";
import { createStyles } from "../../core/style";
import { Icon } from "../../core/icons";

// variants: default | minimal/light mabye?

const styles = createStyles('table', {
    '.table': {
        backgroundColor: 'var(--f-clr-fg-100)',
        borderRadius: 'var(--f-radius-sml)',
        border: 'solid 1px var(--f-clr-fg-200)',
        display: 'flex'
    },

    '.rows': {
        minWidth: 'max-content',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
    },

    '.row': {
        position: 'relative',
        display: 'grid',
        gridAutoFlow: 'column',
        alignItems: 'center',
        padding: '.6em',
        gap: 'var(--f-spacing-sml)',
        color: 'var(--f-clr-text-100)'
    },

    '.row:not(:last-child)': {
        borderBottom: 'solid 1px var(--f-clr-fg-200)'
    },

    '.row > *:not(.collapsed)': {
        whiteSpace: 'nowrap'
    },

    '.row > [role="gridcell"]': {
        paddingInline: '.4rem'
    },

    '.collapsed': {
        minWidth: '2rem',
        display: 'flex'
    },

    '.header': {
        fontSize: '.9em',
        fontWeight: 700,
        background: 'var(--f-clr-fg-200)'
    },

    '.label': {
        position: 'relative',
        borderRadius: 'var(--f-radius-sml)',
        color: 'var(--f-clr-grey-700)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--f-spacing-xxs)',
        width: 'max-content',
        padding: '.2rem .4rem',
        border: 'none',
        background: 'none',
        outline: 'none'
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
        alignSelf: 'center',
        marginBlock: 'auto',
        padding: '.6em',
        color: 'var(--f-clr-grey-700)',
        fontWeight: 600
    }
});

export type TableSelectors = Selectors<'table' | 'rows' | 'row' | 'collapsed' | 'header' | 'label' | 'checkbox' | 'checkmark'>;

type TableProps<T> = {
    ref?: React.Ref<HTMLDivElement>;
    cc?: TableSelectors;
    data: T[];
    columns: (keyof T)[];
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
export default function Table<T extends { [key: string]: string | number | Date; }>({ cc = {}, data, columns, selectable, sortable, selected, onSelect,
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
    const rows = sorting !== 'nil' ?
        data.slice().sort((a, b) => {
            if (b[column] < a[column]) return sorting === 'asc' ? 1 : -1;
            if (b[column] > a[column]) return sorting === 'asc' ? -1 : 1;

            return 0;
        }) : data;

    const gridTemplateColumns = `${selectable ? 'auto' : ''} repeat(${columns.length}, 1fr) ${rowActions ? 'auto' : ''}`;

    return <Scrollarea
        {...props}
        role="grid"
        horizontal
        behavior="shift"
        className={classes(style.table, props.className)}
        data-fb>
        <div role="rowgroup" className={style.rows}>
            <div role="row" className={classes(style.row, style.header)} style={{ gridTemplateColumns }}>
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
                    return <div key={i} role="columnheader">
                        <Halo disabled={!sort}>
                            <button
                                className={style.label}
                                type="button"
                                disabled={!sort}
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
                                {col as string}

                                {(column !== col || sorting === 'nil') && sort && <Icon type="sort" />}
                                {column === col && sorting === 'asc' && <Icon type="sortAscend" />}
                                {column === col && sorting === 'dsc' && <Icon type="sortDescend" />}
                            </button>
                        </Halo>
                    </div>;
                })}

                {rowActions ? <div className={style.collapsed} /> : null}
            </div>

            {rows.map((row, i) => {

                return <Halo key={i} disabled={!selectable}>
                    <div role="row" className={style.row} style={{ gridTemplateColumns }}>
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

                            return <div key={i} role="gridcell">
                                {formatter(row[col])}
                            </div>;
                        })}

                        {rowActions?.length ? <div className={style.collapsed}>
                            <ActionMenu.Root>
                                <ActionMenu.Trigger>
                                    <Button compact variant="minimal" size="sml" style={{ marginLeft: 'auto' }}>
                                        <Icon type="more" />
                                    </Button>
                                </ActionMenu.Trigger>

                                <ActionMenu.Menu>
                                    {rowActions(rows[i], i)}
                                </ActionMenu.Menu>
                            </ActionMenu.Root>
                        </div> : null}
                    </div>
                </Halo>;
            })}

            {!rows.length && <div className={style.empty}>{emptyMessage}</div>}
        </div>
    </Scrollarea>;
}