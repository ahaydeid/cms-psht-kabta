import { Head } from '@inertiajs/react';
import {
    CalendarCheck,
    ClipboardList,
    Building2,
    UsersRound,
} from 'lucide-react';
import { useState } from 'react';

import { AdminLayout } from '@/Layouts/AdminLayout';
import { cn } from '@/lib/cn';

type Stats = {
    artikels_count: number;
    galeris_count: number;
    jadwals_count: number;
    rantings_count: number;
    anggota_count: number;
    pesan_unread_count: number;
};

type TrendItem = {
    label: string;
    value: number;
};

type RantingWargaItem = {
    name: string;
    value: number;
};

type DashboardProps = {
    stats: Stats;
    mediaTrend: TrendItem[];
    rantingWarga: RantingWargaItem[];
};

function DonutChart({
    data,
    innerRadius = 50,
    outerRadius = 72,
    size = 160,
}: {
    data: Array<{ colorClass: string; name: string; value: number }>;
    innerRadius?: number;
    outerRadius?: number;
    size?: number;
}) {
    const [hoveredItem, setHoveredItem] = useState<{
        name: string;
        value: number;
        percentage: number;
        x: number;
        y: number;
    } | null>(null);

    const fallbackData = data.every((item) => item.value === 0)
        ? data.map((item) => ({ ...item, value: 1 }))
        : data;
    const total = fallbackData.reduce((sum, item) => sum + item.value, 0);
    const radius = (innerRadius + outerRadius) / 2;
    const circumference = 2 * Math.PI * radius;
    let accumulated = 0;

    // Hitung total warga riil dari data asli
    const realTotal = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <>
            <svg className="-rotate-90" height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
                {fallbackData.map((item) => {
                    const percentage = (item.value / total) * 100;
                    const dashArray = (percentage / 100) * circumference;
                    const offset = (accumulated / 100) * circumference;
                    accumulated += percentage;

                    const realPercentage = realTotal > 0 ? (item.value / realTotal) * 100 : 0;

                    return (
                        <circle
                            className={cn(item.colorClass, "cursor-pointer transition-all duration-200 hover:opacity-80")}
                            cx={size / 2}
                            cy={size / 2}
                            fill="transparent"
                            key={item.name}
                            onMouseEnter={(e) => {
                                setHoveredItem({
                                    name: item.name,
                                    value: item.value,
                                    percentage: realPercentage,
                                    x: e.clientX,
                                    y: e.clientY,
                                });
                            }}
                            onMouseMove={(e) => {
                                setHoveredItem((prev) =>
                                    prev ? { ...prev, x: e.clientX, y: e.clientY } : null
                                );
                            }}
                            onMouseLeave={() => setHoveredItem(null)}
                            r={radius}
                            stroke="currentColor"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={-offset}
                            strokeWidth={outerRadius - innerRadius}
                        />
                    );
                })}
            </svg>

            {hoveredItem && (
                <div
                    className="fixed z-[9999] pointer-events-none rounded bg-zinc-900/95 px-2.5 py-1.5 text-xs text-zinc-100 shadow-lg border border-zinc-700/30 transition-all duration-75"
                    style={{
                        left: hoveredItem.x + 12,
                        top: hoveredItem.y - 12,
                    }}
                >
                    <div className="font-semibold text-white">Ranting {hoveredItem.name}</div>
                    <div className="text-zinc-300 mt-0.5">
                        {hoveredItem.value === 0 ? (
                            '-'
                        ) : (
                            <>
                                <strong className="font-bold text-white">{hoveredItem.value}</strong> Warga
                            </>
                        )}{' '}
                        ({hoveredItem.percentage.toFixed(1).replace('.0', '')}%)
                    </div>
                </div>
            )}
        </>
    );
}

function LineTrendChart({ data, height = 220 }: { data: Array<{ label: string; value: number }>; height?: number }) {
    const max = Math.max(...data.map((item) => item.value), 1);
    const padding = 18;
    const width = 640;
    const coordinates = data.map((item, index) => {
        const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((item.value / max) * (height - padding * 2) + padding);

        return { x, y };
    });
    const curvedPath = coordinates.reduce((path, point, index) => {
        if (index === 0) {
            return `M ${point.x} ${point.y}`;
        }

        const previous = coordinates[index - 1];
        const controlOffset = (point.x - previous.x) * 0.28;

        return `${path} C ${previous.x + controlOffset} ${previous.y}, ${point.x - controlOffset} ${point.y}, ${point.x} ${point.y}`;
    }, '');
    const areaPath = `${curvedPath} L ${coordinates[coordinates.length - 1]?.x ?? width - padding} ${height - padding} L ${coordinates[0]?.x ?? padding} ${height - padding} Z`;

    return (
        <div className="h-full w-full">
            <svg className="h-full w-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
                <defs>
                    <linearGradient id="latihan-trend-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {[0, 25, 50, 75, 100].map((value) => (
                    <line
                        key={value}
                        stroke="#e4e4e7"
                        strokeDasharray="4 4"
                        x1={padding}
                        x2={width - padding}
                        y1={height - ((value / 100) * (height - padding * 2) + padding)}
                        y2={height - ((value / 100) * (height - padding * 2) + padding)}
                    />
                ))}

                <path d={areaPath} fill="url(#latihan-trend-fill)" />
                <path d={curvedPath} fill="none" stroke="#6366f1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />

                {coordinates.map(({ x, y }, index) => (
                    <circle cx={x} cy={y} fill="#6366f1" key={data[index].label} r="2" />
                ))}
            </svg>
            <div className="mt-2 flex justify-between px-2">
                {data.map((item) => (
                    <span className="text-[10px] font-medium text-zinc-400" key={item.label}>
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

const COLOR_PALETTE = [
    { colorClass: 'text-sky-400', dotClass: 'bg-sky-400' },
    { colorClass: 'text-emerald-400', dotClass: 'bg-emerald-400' },
    { colorClass: 'text-amber-400', dotClass: 'bg-amber-400' },
    { colorClass: 'text-rose-400', dotClass: 'bg-rose-400' },
    { colorClass: 'text-violet-400', dotClass: 'bg-violet-400' },
    { colorClass: 'text-indigo-400', dotClass: 'bg-indigo-400' },
    { colorClass: 'text-fuchsia-400', dotClass: 'bg-fuchsia-400' },
];

export default function Dashboard({ stats, mediaTrend, rantingWarga }: DashboardProps) {
    const cards = [
        {
            helper: 'Warga terdaftar',
            icon: UsersRound,
            label: 'Warga',
            surfaceClass: 'bg-sky-100',
            iconClass: 'text-sky-500/10',
            value: stats.anggota_count || 0,
        },
        {
            helper: 'Ranting organisasi',
            icon: Building2,
            label: 'Ranting',
            surfaceClass: 'bg-rose-100',
            iconClass: 'text-rose-500/10',
            value: stats.rantings_count || 0,
        },
        {
            helper: 'Jadwal latihan aktif',
            icon: CalendarCheck,
            label: 'Jadwal Latihan',
            surfaceClass: 'bg-emerald-100',
            iconClass: 'text-emerald-500/10',
            value: stats.jadwals_count || 0,
        },
        {
            helper: 'Pesan belum dibaca',
            icon: ClipboardList,
            label: 'Pesan Kontak',
            surfaceClass: 'bg-violet-100',
            iconClass: 'text-violet-500/10',
            value: stats.pesan_unread_count || 0,
        },
    ];

    const komposisiRanting = (rantingWarga || []).map((item, idx) => {
        const palette = COLOR_PALETTE[idx % COLOR_PALETTE.length];
        return {
            ...item,
            colorClass: palette.colorClass,
            dotClass: palette.dotClass,
        };
    });

    const totalWarga = stats.anggota_count || 0;

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div className={`relative min-h-32 overflow-hidden rounded-lg p-4 ${card.surfaceClass}`} key={card.label}>
                            <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/30" />
                            <div className="relative z-10 flex h-full flex-col justify-between">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">{card.label}</p>
                                    <p className="mt-1 text-3xl font-extrabold text-zinc-900">{card.value}</p>
                                </div>
                                <p className="mt-2 text-[10px] font-medium text-zinc-500">{card.helper}</p>
                            </div>
                            <card.icon className={`absolute -right-6 -bottom-6 h-20 w-20 shrink-0 ${card.iconClass}`} strokeWidth={1.2} />
                        </div>
                    ))}
                </div>

                <section className="space-y-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Statistik</h2>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                        <div className="rounded-lg border border-zinc-200 bg-white p-5 lg:col-span-2">
                            <h3 className="mb-4 flex items-center justify-between text-sm font-bold text-zinc-700">
                                <span>Tren Publikasi Media</span>
                                <span className="text-indigo-500 text-xs font-semibold">6 Bulan Terakhir</span>
                            </h3>
                            <div className="h-60">
                                <LineTrendChart data={mediaTrend} />
                            </div>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-5 lg:col-span-2">
                            <h3 className="mb-4 text-sm font-bold text-zinc-700">Komposisi Warga per Ranting</h3>
                            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-64">
                                <div className="relative flex items-center justify-center shrink-0">
                                    <DonutChart data={komposisiRanting} size={220} innerRadius={70} outerRadius={98} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-2xl font-extrabold text-zinc-800">{totalWarga}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Warga</span>
                                    </div>
                                </div>
                                <div className="w-full space-y-2 max-h-56 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                                    {komposisiRanting.length === 0 ? (
                                        <div className="text-center text-xs text-zinc-400 py-2">Tidak ada data ranting</div>
                                    ) : (
                                        komposisiRanting.map((item) => (
                                            <div className="flex items-center justify-between text-xs border-b border-zinc-50 pb-1.5 last:border-0" key={item.name}>
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${item.dotClass}`} />
                                                    <span className="font-medium text-zinc-600 truncate max-w-[200px]">{item.name}</span>
                                                </div>
                                                <span className="font-normal text-zinc-600">
                                                    {item.value === 0 ? (
                                                        '-'
                                                    ) : (
                                                        <>
                                                            <strong className="font-bold text-zinc-800">{item.value}</strong> Warga
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
