import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PublicLayout } from "./components/layout/PublicLayout";
import { Head } from "./runtime/inertia-shim";
import CalendarGrid from "./components/agenda/CalendarGrid";
import { addMonths, formatMonthName, formatYear } from "./lib/calendarDate";
import type { CalendarEvent } from "./components/agenda/AgendaModal";
import { API_BASE_URL } from "./lib/config";

type AgendaLegendItem = {
  id: string;
  label: string;
  kegiatan: string;
  tipe_hari: CalendarEvent["tipe_hari"];
  sortValue: string;
};

const mapApiToEvent = (item: any): CalendarEvent => {
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "";
    return timeStr.substring(0, 5);
  };

  const start = formatTime(item.waktu_mulai);
  const end = formatTime(item.waktu_selesai);
  const waktuStr = start ? `${start}${end ? " - " + end : ""}` : "00:00 - 23:59";

  return {
    id: `evt-${item.id}`,
    tanggal: item.tanggal,
    kegiatan: item.judul,
    tipe_hari: item.tipe_hari || "KEGIATAN",
    kategori: item.kategori || "Semua",
    waktu: waktuStr,
    detail: item.keterangan || "",
  };
};

export default function Agenda() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/agenda`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data.map(mapApiToEvent));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const legendItems = useMemo(() => buildLegendItems({ events, currentMonth }), [currentMonth, events]);

  const prevMonth = () => setCurrentMonth((prev) => addMonths(prev, -1));
  const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

  if (loading) {
    return (
      <PublicLayout>
        <Head title="Agenda" />
        <main className="min-h-dvh flex-1 px-4 py-10 sm:px-6 lg:px-8 bg-zinc-50 flex items-center justify-center">
          <div className="text-zinc-500 text-sm">Memuat data agenda...</div>
        </main>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Head title="Agenda" />
      <main className="min-h-dvh flex-1 px-4 py-10 sm:px-6 lg:px-8 bg-zinc-50">
        <div className="mx-auto w-full max-w-7xl">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Agenda Kegiatan</h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Kalender (Kolom Kiri) */}
            <div className="lg:col-span-8">
              <div className="mb-4 px-2">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-light text-zinc-600">
                    {formatMonthName(currentMonth)} <span className="font-normal text-zinc-600">{formatYear(currentMonth)}</span>
                  </h2>

                  <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={prevMonth} className="cursor-pointer bg-white rounded-full border border-zinc-200 p-2 text-zinc-800 transition-all hover:bg-zinc-100 focus:outline-none">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="cursor-pointer bg-white rounded-full border border-zinc-200 p-2 text-zinc-800 transition-all hover:bg-zinc-100 focus:outline-none">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-zinc-200 bg-white rounded overflow-hidden">
                <CalendarGrid currentMonth={currentMonth} today={today} events={events} />
              </div>
            </div>

            {/* Legenda/Daftar Agenda (Kolom Kanan) */}
            <section className="lg:col-span-4 space-y-4 lg:pt-[52px]">
              <h3 className="text-sm font-bold text-sky-800 uppercase px-1">Daftar Agenda Bulan Ini</h3>
              {legendItems.length === 0 ? (
                <div className="px-1 text-sm text-zinc-500 italic">Tidak ada agenda pada bulan ini.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {legendItems.map((item) => (
                    <div key={item.id} className="border-b border-zinc-200 pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-400 font-medium">{item.label}</p>
                        <p className="mt-0.5 text-sm font-semibold text-zinc-700 leading-snug">{item.kegiatan}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}

function buildLegendItems({ events, currentMonth }: { events: CalendarEvent[]; currentMonth: Date }): AgendaLegendItem[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  return events
    .filter((event) => {
      const date = new Date(event.tanggal);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .map((event) => {
      const date = new Date(event.tanggal);
      return {
        id: `agenda-${event.id}`,
        label: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(date),
        kegiatan: event.kegiatan ?? "Tanpa nama kegiatan",
        tipe_hari: event.tipe_hari,
        sortValue: event.tanggal,
      };
    })
    .sort((a, b) => a.sortValue.localeCompare(b.sortValue));
}

