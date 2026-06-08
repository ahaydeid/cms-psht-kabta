import React, { useEffect, useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

interface TableRootProps {
    children: React.ReactNode;
    className?: string;
}

const Root = ({ children, className = "" }: TableRootProps) => {
    return <div className={`flex flex-col gap-4 ${className}`}>{children}</div>;
};

interface TableControlsProps {
    rowsPerPage: number;
    setRowsPerPage: (value: number) => void;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    placeholder?: string;
}

const Controls = ({
    rowsPerPage,
    setRowsPerPage,
    searchTerm,
    setSearchTerm,
    placeholder = "Cari...",
}: TableControlsProps) => {
    const showSearch = placeholder.trim().length > 0;
    const [inputValue, setInputValue] = useState(searchTerm);

    useEffect(() => {
        setInputValue(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        if (inputValue === searchTerm) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setSearchTerm(inputValue);
        }, 350);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [inputValue, searchTerm, setSearchTerm]);

    return (
        <div className="flex text-sm items-center gap-3 pb-1 justify-end ml-auto">
            <select
                value={rowsPerPage}
                onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                }}
                className="border border-zinc-200 px-3 py-2 rounded bg-white text-zinc-700 outline-none focus:border-yellow-600"
            >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>

            {showSearch && (
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                    className="w-64 border border-zinc-200 bg-white px-3 py-2 rounded focus:outline-none focus:border-yellow-600"
                />
            )}
        </div>
    );
};

interface TableContainerProps {
    children: React.ReactNode;
    className?: string;
}

const Container = ({ children, className = "" }: TableContainerProps) => {
    return (
        <div className={`rounded border border-zinc-200 bg-white ${className}`}>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    {children}
                </table>
            </div>
        </div>
    );
};

const Header = ({ children }: { children: React.ReactNode }) => {
    return (
        <thead>
            <tr className="bg-zinc-100 text-zinc-700 h-12">{children}</tr>
        </thead>
    );
};

const Body = ({ children }: { children: React.ReactNode }) => {
    return <tbody>{children}</tbody>;
};

const Row = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <tr className={`border-b whitespace-nowrap border-zinc-200 hover:bg-zinc-50 transition-colors ${className}`}>{children}</tr>
    );
};

interface TableThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
    stickyRight?: boolean;
}

const Th = ({ children, className = "", stickyRight = false, ...props }: TableThProps) => {
    return (
        <th 
            className={`p-3 whitespace-nowrap text-zinc-600 font-semibold ${
                stickyRight
                    ? "sticky right-0 z-20 bg-zinc-100 shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]"
                    : ""
            } ${className}`}
            {...props}
        >
            {children}
        </th>
    );
};

interface TableSortHeaderProps extends Omit<TableThProps, "onClick"> {
    direction?: "asc" | "desc" | null;
    onToggle: () => void;
}

const SortHeader = ({ children, direction = null, onToggle, className = "", stickyRight = false, ...props }: TableSortHeaderProps) => {
    const ariaSort = direction === "asc"
        ? "ascending"
        : direction === "desc"
            ? "descending"
            : "none";

    return (
        <Th
            className={className}
            stickyRight={stickyRight}
            aria-sort={ariaSort}
            {...props}
        >
            <button
                type="button"
                onClick={onToggle}
                className="inline-flex w-full items-center gap-2 text-left text-inherit transition hover:text-yellow-600 cursor-pointer"
            >
                <span>{children}</span>
                {direction === "asc" ? (
                    <ChevronUp className="h-4 w-4 shrink-0" />
                ) : direction === "desc" ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                    <ArrowUpDown className="h-4 w-4 shrink-0 opacity-50" />
                )}
            </button>
        </Th>
    );
};

interface TableTdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
    stickyRight?: boolean;
}

const Td = ({ children, className = "", stickyRight = false, ...props }: TableTdProps) => {
    return (
        <td 
            className={`py-2 px-3 text-zinc-700 whitespace-nowrap ${
                stickyRight
                    ? "sticky right-0 z-10 bg-white shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.25)]"
                    : ""
            } ${className}`}
            {...props}
        >
            {children}
        </td>
    );
};

interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: (value: number | ((p: number) => number)) => void;
}

const Pagination = ({ page, totalPages, setPage }: PaginationProps) => {
    return (
        <div className="flex justify-end items-center gap-3">
            <button
                onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-zinc-300 rounded bg-white hover:bg-zinc-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm text-zinc-600">
                {page} dari {totalPages}
            </span>

            <button
                onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-2 border border-zinc-300 rounded bg-white hover:bg-zinc-100 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
};

export const Table = {
    Root,
    Controls,
    Container,
    Header,
    Th,
    SortHeader,
    Td,
    Body,
    Row,
    Pagination,
};
