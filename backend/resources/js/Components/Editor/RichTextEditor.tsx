import { useEffect, useMemo, useRef, useState } from 'react';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    ChevronDown,
    Edit3,
    Expand,
    Shrink,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Image as ImageIcon,
    Italic,
    Link2,
    List,
    ListOrdered,
    Pilcrow,
    Quote,
    Redo,
    RemoveFormatting,
    Strikethrough,
    Underline,
    Undo,
    SeparatorHorizontal,
    Table2,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/Components/ui';
import { cn } from '@/lib/cn';

type RichTextEditorProps = {
    content: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    footerActions?: ReactNode;
};

type BlockFormat = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote' | 'pre';

type AlignFormat = 'left' | 'center' | 'right' | 'justify';

const headingOptions: Array<{ label: string; value: BlockFormat; icon: typeof Pilcrow }> = [
    { label: 'Paragraf', value: 'p', icon: Pilcrow },
    { label: 'Heading 1', value: 'h1', icon: Heading1 },
    { label: 'Heading 2', value: 'h2', icon: Heading2 },
    { label: 'Heading 3', value: 'h3', icon: Heading3 },
    { label: 'Heading 4', value: 'h4', icon: Heading4 },
    { label: 'Quote', value: 'blockquote', icon: Quote },
    { label: 'Code block', value: 'pre', icon: Code },
];

const alignOptions: Array<{ label: string; value: AlignFormat; icon: typeof AlignLeft }> = [
    { label: 'Rata kiri', value: 'left', icon: AlignLeft },
    { label: 'Rata tengah', value: 'center', icon: AlignCenter },
    { label: 'Rata kanan', value: 'right', icon: AlignRight },
    { label: 'Rata penuh', value: 'justify', icon: AlignJustify },
];

const blockTagMap: Record<BlockFormat, string> = {
    p: 'P',
    h1: 'H1',
    h2: 'H2',
    h3: 'H3',
    h4: 'H4',
    blockquote: 'BLOCKQUOTE',
    pre: 'PRE',
};

const isSelectionInside = (root: HTMLElement, node: Node | null) => {
    return !!node && root.contains(node);
};

const applyBlockFormat = (editor: HTMLElement, format: BlockFormat) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!isSelectionInside(editor, range.commonAncestorContainer)) return;

    const block = document.createElement(format === 'p' ? 'p' : format);

    if (range.collapsed) {
        block.innerHTML = '<br />';
        range.insertNode(block);
        const nextRange = document.createRange();
        nextRange.setStart(block, 0);
        nextRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(nextRange);
        return;
    }

    const extracted = range.extractContents();
    block.appendChild(extracted);
    if (!block.textContent?.trim()) {
        block.innerHTML = '<br />';
    }
    range.insertNode(block);
    selection.removeAllRanges();
    selection.addRange(range);
};

const applyAlignFormat = (editor: HTMLElement, align: AlignFormat) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!isSelectionInside(editor, range.commonAncestorContainer)) return;

    const block = (range.startContainer.nodeType === Node.ELEMENT_NODE
        ? (range.startContainer as HTMLElement)
        : (range.startContainer.parentElement?.closest('p,h1,h2,h3,h4,blockquote,pre,div,li,td,th') as HTMLElement | null)
    ) ?? editor;

    block.style.textAlign = align;
};

const sanitizeHtml = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const allowedTags = new Set([
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'a', 'h1', 'h2', 'h3', 'h4',
        'blockquote', 'pre', 'code', 'ul', 'ol', 'li', 'hr', 'img', 'div', 'span', 'table', 'thead',
        'tbody', 'tr', 'th', 'td', 'figure', 'figcaption'
    ]);

    const walk = (node: Node): Node | null => {
        if (node.nodeType === Node.TEXT_NODE) return node.cloneNode();

        if (node.nodeType !== Node.ELEMENT_NODE) return null;

        const element = node as HTMLElement;
        if (!allowedTags.has(element.tagName.toLowerCase())) {
            const fragment = document.createDocumentFragment();
            Array.from(element.childNodes).forEach((child) => {
                const sanitized = walk(child);
                if (sanitized) fragment.appendChild(sanitized);
            });
            return fragment;
        }

        const clone = element.cloneNode(false) as HTMLElement;

        Array.from(element.attributes).forEach((attribute) => {
            const name = attribute.name.toLowerCase();
            if (name.startsWith('on')) return;
            if (name === 'style') {
                const style = attribute.value
                    .split(';')
                    .map((part) => part.trim())
                    .filter(Boolean)
                    .filter((part) => {
                        const [key] = part.split(':');
                        return ['text-align', 'width', 'height', 'max-width', 'float', 'display', 'margin'].includes(key.trim());
                    })
                    .join('; ');
                if (style) clone.setAttribute('style', style);
                return;
            }
            if (['href', 'src', 'alt', 'title', 'target', 'rel', 'width', 'height'].includes(name)) {
                clone.setAttribute(name, attribute.value);
            }
        });

        Array.from(element.childNodes).forEach((child) => {
            const sanitized = walk(child);
            if (sanitized) clone.appendChild(sanitized);
        });

        return clone;
    };

    const wrapper = document.createElement('div');
    Array.from(doc.body.childNodes).forEach((child) => {
        const sanitized = walk(child);
        if (sanitized) wrapper.appendChild(sanitized);
    });

    return wrapper.innerHTML
        .replace(/<([a-z0-9]+)><\/\1>/gi, '<$1><br /></$1>')
        .replace(/<p>\s*<br \/>\s*<\/p>/gi, '<p><br /></p>');
};

export function RichTextEditor({ content, onChange, placeholder = 'Tulis isi berita di sini...', className, footerActions }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [isLinkOpen, setIsLinkOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [blockFormat, setBlockFormat] = useState<BlockFormat>('p');
    const [alignFormat, setAlignFormat] = useState<AlignFormat>('left');

    useEffect(() => {
        if (!editorRef.current) return;
        if (editorRef.current.innerHTML !== content) {
            editorRef.current.innerHTML = content || '';
        }
    }, [content]);

    const syncContent = () => {
        if (!editorRef.current) return;
        const next = sanitizeHtml(editorRef.current.innerHTML);
        if (next !== content) onChange(next);
    };

    const exec = (command: string, value?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        syncContent();
    };

    const insertLink = () => {
        if (!linkUrl.trim()) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (!editorRef.current || !isSelectionInside(editorRef.current, range.commonAncestorContainer)) return;

        const text = linkText.trim();
        const anchor = document.createElement('a');
        anchor.href = linkUrl.trim();
        anchor.target = '_blank';
        anchor.rel = 'noreferrer noopener';
        anchor.className = 'text-yellow-700 underline decoration-yellow-500 underline-offset-2';

        if (range.collapsed) {
            anchor.textContent = text || linkUrl.trim();
            range.insertNode(anchor);
        } else {
            const extracted = range.extractContents();
            anchor.appendChild(extracted);
            range.insertNode(anchor);
        }

        selection.removeAllRanges();
        setIsLinkOpen(false);
        setLinkUrl('');
        setLinkText('');
        syncContent();
    };

    const insertImage = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const alt = file.name.substring(0, file.name.lastIndexOf('.')) || 'Gambar';

            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch('/admin/berita/upload-image', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken || '',
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Gagal mengunggah gambar');
                }

                const data = await response.json();
                if (!data.url) {
                    throw new Error('URL gambar tidak ditemukan');
                }

                const img = document.createElement('img');
                img.src = data.url;
                img.alt = alt;
                img.className = 'mx-auto block max-w-full rounded-md my-4';

                editorRef.current?.focus();
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    if (editorRef.current && isSelectionInside(editorRef.current, range.commonAncestorContainer)) {
                        range.insertNode(img);
                        syncContent();
                        return;
                    }
                }

                editorRef.current?.appendChild(img);
                syncContent();
            } catch (err) {
                console.error('Gagal mengunggah gambar:', err);
            }
        };
        fileInput.click();
    };

    const insertTable = () => {
        const rows = Number(window.prompt('Jumlah baris tabel', '3') ?? '3');
        const cols = Number(window.prompt('Jumlah kolom tabel', '3') ?? '3');

        if (!Number.isFinite(rows) || !Number.isFinite(cols) || rows < 1 || cols < 1) return;

        const table = document.createElement('table');
        table.className = 'my-4 w-full border-collapse text-sm';

        const tbody = document.createElement('tbody');
        for (let row = 0; row < rows; row += 1) {
            const tr = document.createElement('tr');
            for (let col = 0; col < cols; col += 1) {
                const td = document.createElement('td');
                td.className = 'border border-zinc-300 px-3 py-2 align-top';
                td.innerHTML = '&nbsp;';
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        editorRef.current?.focus();
        editorRef.current?.appendChild(table);
        syncContent();
    };

    const blockLabel = useMemo(() => blockTagMap[blockFormat], [blockFormat]);

    const editorBody = (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="sticky top-0 z-10 flex flex-col gap-2 border-b border-zinc-200 bg-white pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <select
                                aria-label="Format blok"
                                className="h-9 appearance-none rounded border border-zinc-200 bg-white pl-3 pr-9 text-sm text-zinc-900 outline-none transition focus:border-yellow-400"
                                value={blockFormat}
                                onChange={(e) => {
                                    const next = e.target.value as BlockFormat;
                                    setBlockFormat(next);
                                    if (editorRef.current) applyBlockFormat(editorRef.current, next);
                                }}
                            >
                                {headingOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-zinc-400" />
                        </div>

                        <ToolbarButton label="Bold" onClick={() => exec('bold')} icon={<Bold className="size-4" />} />
                        <ToolbarButton label="Italic" onClick={() => exec('italic')} icon={<Italic className="size-4" />} />
                        <ToolbarButton label="Underline" onClick={() => exec('underline')} icon={<Underline className="size-4" />} />
                        <ToolbarButton label="Strike" onClick={() => exec('strikeThrough')} icon={<Strikethrough className="size-4" />} />
                        <ToolbarButton label="Clear formatting" onClick={() => exec('removeFormat')} icon={<RemoveFormatting className="size-4" />} />
                        <ToolbarButton label="Bullet list" onClick={() => exec('insertUnorderedList')} icon={<List className="size-4" />} />
                        <ToolbarButton label="Numbered list" onClick={() => exec('insertOrderedList')} icon={<ListOrdered className="size-4" />} />
                        <ToolbarButton label="Blockquote" onClick={() => applyBlockFormat(editorRef.current ?? document.body, 'blockquote')} icon={<Quote className="size-4" />} />
                        <ToolbarButton label="Code block" onClick={() => applyBlockFormat(editorRef.current ?? document.body, 'pre')} icon={<Code className="size-4" />} />
                        <ToolbarButton label="Horizontal rule" onClick={() => exec('insertHorizontalRule')} icon={<SeparatorHorizontal className="size-4" />} />
                        <ToolbarButton label="Insert table" onClick={insertTable} icon={<Table2 className="size-4" />} />
                        <ToolbarButton label="Insert image" onClick={insertImage} icon={<ImageIcon className="size-4" />} />
                        <ToolbarButton label="Insert link" onClick={() => setIsLinkOpen((value) => !value)} icon={<Link2 className="size-4" />} />
                        <ToolbarButton label="Undo" onClick={() => exec('undo')} icon={<Undo className="size-4" />} />
                        <ToolbarButton label="Redo" onClick={() => exec('redo')} icon={<Redo className="size-4" />} />

                        <div className="h-6 w-px bg-zinc-200 mx-1 self-center" />

                        {alignOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <ToolbarButton
                                    key={option.value}
                                    active={alignFormat === option.value}
                                    label={option.label}
                                    onClick={() => {
                                        setAlignFormat(option.value);
                                        if (editorRef.current) applyAlignFormat(editorRef.current, option.value);
                                    }}
                                    icon={<Icon className="size-4" />}
                                />
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 rounded border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500">
                        <Edit3 className="size-4 text-zinc-400" />
                        <span>Format: {blockLabel}</span>
                        {!isFullScreen ? (
                            <button
                                aria-label="Luaskan editor"
                                className="ml-1 inline-flex size-8 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
                                onClick={() => setIsFullScreen(true)}
                                type="button"
                                title="Luaskan editor"
                            >
                                <Expand className="size-4" />
                            </button>
                        ) : (
                            <button
                                aria-label="Kecilkan editor"
                                className="ml-1 inline-flex h-8 items-center gap-1.5 rounded border border-zinc-200 bg-white px-2.5 font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
                                onClick={() => setIsFullScreen(false)}
                                type="button"
                                title="Kecilkan editor"
                            >
                                <Shrink className="size-4 animate-pulse" />
                                <span>Kecilkan</span>
                            </button>
                        )}
                    </div>
                </div>

                {isLinkOpen ? (
                    <div className="flex flex-col gap-2 rounded border border-zinc-200 bg-zinc-50 p-3 lg:flex-row lg:items-end">
                        <label className="flex-1 space-y-1">
                            <span className="block text-xs font-medium text-zinc-600">URL tautan</span>
                            <input
                                className="w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-yellow-400"
                                placeholder="https://..."
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                            />
                        </label>
                        <label className="flex-1 space-y-1">
                            <span className="block text-xs font-medium text-zinc-600">Teks tautan</span>
                            <input
                                className="w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-yellow-400"
                                placeholder="Teks yang ditampilkan"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                            />
                        </label>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsLinkOpen(false)}>Batal</Button>
                            <Button variant="primary" onClick={insertLink}>Sisipkan</Button>
                        </div>
                    </div>
                ) : null}
            </div>

            <div
                ref={editorRef}
                className={cn(
                    'min-h-0 flex-1 overflow-y-auto rounded border border-zinc-200 bg-white px-4 py-4 text-sm leading-7 text-zinc-900 outline-none md:px-5',
                    isFullScreen ? 'pb-24' : '',
                    !content.trim()
                        ? "after:pointer-events-none after:block after:text-sm after:text-zinc-400 after:content-[attr(data-placeholder)]"
                        : '',
                )}
                contentEditable
                suppressContentEditableWarning
                onBlur={syncContent}
                onInput={syncContent}
                onKeyUp={syncContent}
                onMouseUp={syncContent}
                data-placeholder={placeholder}
                spellCheck
                style={{ whiteSpace: 'normal' }}
            />
        </div>
    );

    return (
        <div
            className={cn(
                'flex flex-col gap-3',
                isFullScreen
                    ? 'fixed inset-0 z-50 bg-white p-3 sm:p-4 h-screen w-screen overflow-hidden'
                    : 'h-full min-h-0',
                className
            )}
        >
            {editorBody}

            {isFullScreen && footerActions ? (
                <div className="absolute bottom-6 right-6 z-40 flex gap-3">
                    {footerActions}
                </div>
            ) : null}
        </div>
    );
}

type ToolbarButtonProps = {
    active?: boolean;
    icon: ReactNode;
    label: string;
    onClick: () => void;
};

function ToolbarButton({ active = false, icon, label, onClick }: ToolbarButtonProps) {
    return (
        <button
            aria-label={label}
            className={cn(
                'inline-flex h-9 items-center justify-center rounded border px-2.5 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950',
                active ? 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-900 hover:text-white' : 'border-zinc-200 bg-white',
            )}
            onClick={onClick}
            type="button"
            title={label}
        >
            {icon}
        </button>
    );
}
