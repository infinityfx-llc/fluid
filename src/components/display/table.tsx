'use client';

import { classes, combineClasses } from "../../../src/core/utils";
import { FluidStyles, Selectors } from "../../../src/types";
import { forwardRef, useState } from "react";
import Halo from "../feedback/halo";
import Scrollarea from "../layout/scrollarea";
import Button from "../input/button";
import Checkbox from "../input/checkbox";
import { MdArrowDownward, MdArrowUpward, MdMoreVert, MdSort } from "react-icons/md";
import ActionMenu, { ActionMenuOption } from "./action-menu";
import { createStyles } from "../../core/style";

export type TableStyles = FluidStyles<'.table' | '.rows' | '.row' | '.collapsed' | '.header' | '.label' | '.checkbox' | '.checkmark'>;

type TableProps<T> = {
    cc?: Selectors<'table' | 'rows' | 'row' | 'collapsed' | 'header' | 'label' | 'checkbox' | 'checkmark'>;
    data: T[];
    columns: (keyof T)[];
    selectable?: boolean;
    sortable?: boolean | (keyof T)[];
    selected?: number[];
    onSelect?: (selected: number[]) => void;
    columnFormatters?: {
        [column in keyof T]?: (value: T[column]) => React.ReactNode;
    };
    rowActions?: (row: T, index: number) => ActionMenuOption[];
} & React.HTMLAttributes<HTMLDivElement>;

// variants: default | minimal/light mabye?

function TableComponent<T extends { [key: string]: string | number | Date; }>({ cc = {}, data, columns, selectable, sortable, selected, onSelect, columnFormatters = {}, rowActions, ...props }: TableProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
    const styles = createStyles('table', {
        '.table': {
            backgroundColor: 'var(--f-clr-fg-100)',
            borderRadius: 'var(--f-radius-sml)',
            overflow: 'hidden',
            border: 'solid 1px var(--f-clr-fg-200)'
        },
    
        '.rows': {
            minWidth: 'max-content',
            display: 'flex',
            flexDirection: 'column'
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
        }
    });
    const style = combineClasses(styles, cc);

    const [column, setColumn] = useState<string>('');
    const [sorting, setSorting] = useState<'nil' | 'asc' | 'dsc'>('nil');
    const [selectedIndices, setSelectedIndices] = selected !== undefined ? [selected] : useState<number[]>([]);

    function updateSelected(value: number[]) {
        setSelectedIndices?.(value);
        onSelect?.(value);
    }

    const rows = sorting !== 'nil' ?
        data.slice().sort((a, b) => {
            if (b[column] < a[column]) return sorting === 'asc' ? 1 : -1;
            if (b[column] > a[column]) return sorting === 'asc' ? -1 : 1;

            return 0;
        }) : data;

    const gridTemplateColumns = `${selectable ? 'auto' : ''} repeat(${columns.length}, 1fr) ${rowActions ? 'auto' : ''}`;

    return <Scrollarea {...props} ref={ref} horizontal role="grid" className={classes(style.table, props.className)}>
        <div role="rowgroup" className={style.rows}>
            <div role="rowheader" className={classes(style.row, style.header)} style={{ gridTemplateColumns }}>
                {selectable && <div className={style.collapsed}>
                    <Checkbox size="xsm" color="var(--f-clr-text-100)" cc={{ checkbox: style.checkbox, checkmark: style.checkmark }} checked={selectedIndices.length === rows.length} onChange={e => {
                        if (!e.target.checked) return updateSelected([]);

                        updateSelected(new Array(rows.length).fill(0).map((_, i) => i));
                    }} />
                </div>}

                {columns.map((col, i) => {
                    const sort = Array.isArray(sortable) ? sortable.includes(col) : sortable;

                    return <div key={i} role="columnheader">
                        <Halo disabled={!sort}>
                            <button disabled={!sort} className={style.label} onClick={() => {
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

                                {(column !== col || sorting === 'nil') && sort && <MdSort />}
                                {column === col && sorting === 'asc' && <MdArrowUpward />}
                                {column === col && sorting === 'dsc' && <MdArrowDownward />}
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
                            <Checkbox size="xsm" color="var(--f-clr-text-100)" cc={{ checkbox: style.checkbox, checkmark: style.checkmark }} checked={selectedIndices.includes(i)} onChange={e => {
                                const updated = selectedIndices.slice();
                                e.target.checked ? updated.push(i) : updated.splice(updated.indexOf(i), 1);

                                updateSelected(updated);
                            }} />
                        </div>}

                        {columns.map((col, i) => {
                            const formatter = columnFormatters[col] || (val => val.toString());

                            return <div key={i} role="gridcell">
                                {formatter(row[col])}
                            </div>;
                        })}

                        {rowActions ? <div className={style.collapsed}>
                            <ActionMenu options={rowActions(rows[i], i)}>
                                <Button variant="minimal" style={{ marginLeft: 'auto' }}>
                                    <MdMoreVert />
                                </Button>
                            </ActionMenu>
                        </div> : null}
                    </div>
                </Halo>;
            })}
        </div>
    </Scrollarea>;
}

const Table = forwardRef(TableComponent) as (<T extends { [key: string]: string | number | Date; }>(props: TableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement>; }) => ReturnType<typeof TableComponent>) & { displayName: string; };

Table.displayName = 'Table';

export default Table;