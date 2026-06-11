import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

type Option = {
    value: string;
    label: string;
    disabled?: boolean;
};

type PublicComboboxProps = {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export function PublicCombobox({ options, value, onChange, placeholder = 'Pilih...', className }: PublicComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = useMemo(() => options.find((o) => o.value === value), [options, value]);

    useEffect(() => {
        if (!isOpen) {
            setSearch(selectedOption ? selectedOption.label : '');
        }
    }, [selectedOption, isOpen]);

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        const lowerSearch = search.toLowerCase();
        return options.filter((o) => o.label.toLowerCase().includes(lowerSearch));
    }, [options, search]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch(selectedOption ? selectedOption.label : '');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedOption]);

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <div 
                className={cn(
                    "flex items-center justify-between w-full rounded-lg border bg-white px-4 py-3 text-sm text-zinc-950 transition-all cursor-text",
                    "border-zinc-300 hover:border-zinc-400",
                    isOpen && "ring-2 ring-brand-yellow/30 border-brand-yellow-dark"
                )}
                onClick={() => {
                    setIsOpen(true);
                    setSearch('');
                    inputRef.current?.focus();
                }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full bg-transparent outline-none placeholder:text-zinc-400 text-sm"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearch('');
                    }}
                />
                <ChevronDown 
                    className={cn("size-4 text-zinc-400 transition-transform shrink-0 ml-2 cursor-pointer", isOpen && "rotate-180")} 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                />
            </div>
            
            {isOpen && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 w-full overflow-hidden flex flex-col rounded-lg border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5">
                    <div className="overflow-y-auto py-1">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-zinc-500 text-center">Tidak ditemukan.</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "px-4 py-2.5 text-sm transition-colors cursor-pointer",
                                        "hover:bg-zinc-50 hover:text-brand-yellow-dark",
                                        option.value === value && "bg-yellow-50 font-medium text-brand-yellow-dark"
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(option.value);
                                        setSearch(option.label);
                                        setIsOpen(false);
                                    }}
                                >
                                    {option.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
