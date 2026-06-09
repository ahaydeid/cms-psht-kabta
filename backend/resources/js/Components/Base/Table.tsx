import { useMemo, useState, type ReactNode } from 'react';
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/cn';

type TableRootProps = {
    children: ReactNode;
    className?: string;
};

const Root = ({ children, className = '' }: TableRootProps) => {
    return <div className={cn('flex flex-col gap-4', className)}>{children}</div>;
};

type SectionHeaderProps = {
    actions?: ReactNode;
    subtitle?: ReactNode;
    title?: ReactNode;
};

const SectionHeader = ({ actions, subtitle, title }: SectionHeaderProps) => {
    if (!title && !subtitle && !actions) {
        return null;
    }

    return (
        <div className="space-y-3">
            {title || subtitle ? (
                <div>
                    {title ? <h2 className="text-xl font-bold text-zinc-800">{title}</h2> : null}
                    {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
                </div>
            ) : null}
            {actions ? <div>{actions}</div> : null}
        </div>
    );
};

type ControlsProps = {
    controlsEnd?: ReactNode;
    isServerSide?: boolean;
    placeholder?: string;
    rowsPerPage: number;
    searchTerm: string;
    setRowsPerPage: (value: number) => void;
    setSearchTerm: (value: string) => void;
};

const Controls = ({
    controlsEnd,
    isServerSide = false,
    placeholder = 'Cari...',
    rowsPerPage,
    searchTerm,
    setRowsPerPage,
    setSearchTerm,
}: ControlsProps) => {
    const showSearch = placeholder.trim().length > 0;

    return (
        <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max items-center justify-end gap-3 text-sm">
                {controlsEnd ? <div className="flex items-center gap-3">{controlsEnd}</div> : null}
                <select
                    className="rounded border border-zinc-200 bg-white px-3 py-2 text-zinc-700 outline-none focus:border-sky-400"
                    onChange={(event) => {
                        setRowsPerPage(Number(event.target.value));
                    }}
                    value={rowsPerPage}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
                {showSearch ? (
                    <input
                        className="w-64 rounded border border-zinc-200 bg-white px-3 py-2 outline-none focus:border-sky-400"
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={placeholder}
                        type="text"
                        value={searchTerm}
                    />
                ) : null}
            </div>
        </div>
    );
};

type ContainerProps = {
    children: ReactNode;
    className?: string;
};

const Container = ({ children, className = '' }: ContainerProps) => {
    return (
        <div className={cn('rounded border border-zinc-200 bg-white', className)}>
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">{children}</table>
            </div>
        </div>
    );
};

const Header = ({ children }: { children: ReactNode }) => {
    return (
        <thead>
            <tr className="h-12 bg-sky-100 text-zinc-700">{children}</tr>
        </thead>
    );
};

const Body = ({ children }: { children: ReactNode }) => {
    return <tbody>{children}</tbody>;
};

const Row = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
    return <tr className={cn('whitespace-nowrap transition-colors hover:bg-sky-50', className)}>{children}</tr>;
};

type ThProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
    children: ReactNode;
    stickyLeft?: boolean | string;
    stickyRight?: boolean;
};

const Th = ({ children, className = '', stickyLeft = false, stickyRight = false, ...props }: ThProps) => {
    const stickyLeftClass =
        typeof stickyLeft === 'string'
            ? `sticky ${stickyLeft} z-20 bg-sky-100 shadow-[8px_0_12px_-12px_rgba(15,23,42,0.2)]`
            : stickyLeft
              ? 'sticky left-0 z-20 bg-sky-100 shadow-[8px_0_12px_-12px_rgba(15,23,42,0.2)]'
              : '';

    return (
        <th
            className={cn(
                'whitespace-nowrap p-3 font-semibold text-zinc-700',
                stickyLeftClass,
                stickyRight ? 'sticky right-0 z-20 bg-sky-100 shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]' : '',
                className,
            )}
            {...props}
        >
            {children}
        </th>
    );
};

type SortHeaderProps = Omit<ThProps, 'onClick'> & {
    direction?: 'asc' | 'desc' | null;
    onToggle: () => void;
};

const SortHeader = ({ children, direction = null, onToggle, className = '', stickyLeft = false, stickyRight = false, ...props }: SortHeaderProps) => {
    const ariaSort = direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none';

    return (
        <Th aria-sort={ariaSort} className={className} stickyLeft={stickyLeft} stickyRight={stickyRight} {...props}>
            <button
                className="inline-flex w-full items-center gap-2 text-left text-inherit transition hover:text-sky-700"
                onClick={onToggle}
                type="button"
            >
                <span>{children}</span>
                {direction === 'asc' ? (
                    <ChevronUp className="h-4 w-4 shrink-0" />
                ) : direction === 'desc' ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                    <ArrowUpDown className="h-4 w-4 shrink-0 opacity-50" />
                )}
            </button>
        </Th>
    );
};

type TdProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
    children: ReactNode;
    stickyLeft?: boolean | string;
    stickyRight?: boolean;
};

const Td = ({ children, className = '', stickyLeft = false, stickyRight = false, ...props }: TdProps) => {
    const stickyLeftClass =
        typeof stickyLeft === 'string'
            ? `sticky ${stickyLeft} z-10 bg-white shadow-[8px_0_12px_-12px_rgba(15,23,42,0.15)]`
            : stickyLeft
              ? 'sticky left-0 z-10 bg-white shadow-[8px_0_12px_-12px_rgba(15,23,42,0.15)]'
              : '';

    return (
        <td
            className={cn(
                'whitespace-nowrap px-3 py-2 text-zinc-700',
                stickyLeftClass,
                stickyRight ? 'sticky right-0 z-10 bg-white shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.25)]' : '',
                className,
            )}
            {...props}
        >
            {children}
        </td>
    );
};

type PaginationProps = {
    isServerSide?: boolean;
    onPageChange?: (page: number) => void;
    page: number;
    setPage: (value: number | ((page: number) => number)) => void;
    totalPages: number;
};

const Pagination = ({ isServerSide = false, onPageChange, page, setPage, totalPages }: PaginationProps) => {
    return (
        <div className="flex items-center justify-end gap-3">
            <button
                className="cursor-pointer rounded border border-zinc-300 p-2 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={page === 1}
                onClick={() => {
                    if (isServerSide) {
                        onPageChange?.(Math.max(1, page - 1));
                        return;
                    }

                    setPage((currentPage) => Math.max(1, currentPage - 1));
                }}
                type="button"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm text-zinc-600">
                {page} dari {totalPages}
            </span>

            <button
                className="cursor-pointer rounded border border-zinc-300 p-2 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={page === totalPages}
                onClick={() => {
                    if (isServerSide) {
                        onPageChange?.(Math.min(totalPages, page + 1));
                        return;
                    }

                    setPage((currentPage) => Math.min(totalPages, currentPage + 1));
                }}
                type="button"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
};

export type DataTableColumn<TData> = {
    cell?: (row: TData, index: number) => ReactNode;
    header: ReactNode;
    key: keyof TData | string;
    searchable?: boolean;
    stickyLeft?: boolean | string;
    stickyRight?: boolean;
};

type DataTableProps<TData> = {
    actions?: ReactNode;
    columns: DataTableColumn<TData>[];
    controlsEnd?: ReactNode;
    currentPage?: number;
    data: TData[];
    emptyMessage?: string;
    getRowKey?: (row: TData, index: number) => string | number;
    leftActions?: ReactNode;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (value: number) => void;
    onSearchTermChange?: (value: string) => void;
    placeholder?: string;
    rowsPerPage?: number;
    searchTerm?: string;
    serverSide?: boolean;
    subtitle?: ReactNode;
    title?: ReactNode;
    totalPages?: number;
};

export function DataTable<TData extends Record<string, unknown>>({
    actions,
    columns,
    controlsEnd,
    currentPage,
    data,
    emptyMessage = 'Tidak ada data.',
    getRowKey,
    leftActions,
    onPageChange,
    onRowsPerPageChange,
    onSearchTermChange,
    placeholder = 'Cari...',
    rowsPerPage: controlledRowsPerPage,
    searchTerm: controlledSearchTerm,
    serverSide = false,
    subtitle,
    title,
    totalPages: controlledTotalPages,
}: DataTableProps<TData>) {
    const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);
    const [internalSearchTerm, setInternalSearchTerm] = useState('');
    const [internalPage, setInternalPage] = useState(1);
    const rowsPerPage = serverSide ? (controlledRowsPerPage ?? 10) : internalRowsPerPage;
    const searchTerm = serverSide ? (controlledSearchTerm ?? '') : internalSearchTerm;
    const page = serverSide ? (currentPage ?? 1) : internalPage;

    const filteredData = useMemo(() => {
        if (serverSide) {
            return data;
        }

        const keyword = searchTerm.trim().toLowerCase();

        if (!keyword) {
            return data;
        }

        return data.filter((row) =>
            columns
                .filter((column) => column.searchable !== false)
                .some((column) => String(row[column.key as keyof TData] ?? '').toLowerCase().includes(keyword)),
        );
    }, [columns, data, searchTerm, serverSide]);

    const totalPages = serverSide ? Math.max(1, controlledTotalPages ?? 1) : Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const safePage = Math.min(page, totalPages);
    const paginatedData = serverSide ? filteredData : filteredData.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

    return (
        <Root>
            <SectionHeader actions={actions} subtitle={subtitle} title={title} />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                {leftActions || <div />}
                <Controls
                    controlsEnd={controlsEnd}
                    isServerSide={serverSide}
                    placeholder={placeholder}
                    rowsPerPage={rowsPerPage}
                    searchTerm={searchTerm}
                    setRowsPerPage={(value) => {
                        if (serverSide) {
                            onRowsPerPageChange?.(value);
                            return;
                        }

                        setInternalRowsPerPage(value);
                        setInternalPage(1);
                    }}
                    setSearchTerm={(value) => {
                        if (serverSide) {
                            onSearchTermChange?.(value);
                            return;
                        }

                        setInternalSearchTerm(value);
                        setInternalPage(1);
                    }}
                />
            </div>
            <Container>
                <Header>
                    {columns.map((column) => (
                        <Th key={String(column.key)} stickyLeft={column.stickyLeft} stickyRight={column.stickyRight}>
                            {column.header}
                        </Th>
                    ))}
                </Header>
                <Body>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, index) => (
                            <Row key={getRowKey ? getRowKey(row, index) : index}>
                                {columns.map((column) => (
                                    <Td key={String(column.key)} stickyLeft={column.stickyLeft} stickyRight={column.stickyRight}>
                                        {column.cell ? column.cell(row, index) : String(row[column.key as keyof TData] ?? '-')}
                                    </Td>
                                ))}
                            </Row>
                        ))
                    ) : (
                        <Row>
                            <Td className="py-10 text-center text-zinc-500" colSpan={columns.length}>
                                {emptyMessage}
                            </Td>
                        </Row>
                    )}
                </Body>
            </Container>
            <Pagination
                isServerSide={serverSide}
                onPageChange={onPageChange}
                page={safePage}
                setPage={setInternalPage}
                totalPages={totalPages}
            />
        </Root>
    );
}

export const Table = {
    Body,
    Container,
    Controls,
    DataTable,
    Header,
    Pagination,
    Root,
    Row,
    SectionHeader,
    SortHeader,
    Td,
    Th,
};

export default Table;
