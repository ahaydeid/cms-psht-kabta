import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

type Option = {
    value: string;
    label: string;
    disabled?: boolean;
};

type ComboboxProps = {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    className?: string;
};

export function Combobox({ options, value, onChange, placeholder = 'Pilih...', error, className }: ComboboxProps) {
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
                    "flex items-center justify-between w-full rounded border bg-white px-4 py-2 text-sm text-zinc-950 transition-all cursor-text",
                    error ? "border-red-600 bg-red-50" : "border-zinc-200 hover:border-zinc-300",
                    isOpen && "ring-1 ring-yellow-400/30 border-yellow-400"
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
                    className="w-full bg-transparent outline-none placeholder:text-zinc-400"
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
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden flex flex-col rounded-md border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5">
                    <div className="overflow-y-auto py-1">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-zinc-500 text-center">Tidak ditemukan.</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "px-4 py-2 text-sm transition-colors",
                                        option.disabled 
                                            ? "text-zinc-400 italic cursor-not-allowed bg-zinc-50/50" 
                                            : "cursor-pointer hover:bg-yellow-50 hover:text-yellow-900",
                                        option.value === value && !option.disabled && "bg-yellow-50 font-medium text-yellow-900"
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (option.disabled) return;
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
            {error && <p className="mt-1 ml-1 text-[10px] font-medium text-red-600 md:text-xs">{error}</p>}
        </div>
    );
}
