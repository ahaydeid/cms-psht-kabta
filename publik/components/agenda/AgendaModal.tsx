"use client";

import Modal from "@/components/common/Modal";
import { formatFullDate } from "@/lib/calendarDate";

export interface CalendarEvent {
  id: string;
  tanggal: string;
  kegiatan: string | null;
  tipe_hari: "KEGIATAN" | "PENTING" | "LIBUR";
  kategori: string | null;
  waktu?: string;
  detail?: string;
}

interface Props {
  date: Date;
  events: CalendarEvent[];
  onClose: () => void;
}

export default function AgendaModal({ date, events, onClose }: Props) {
  const fullDate = formatFullDate(date);

  return (
    <Modal
      isOpen
      onClose={onClose}
      showCloseButton={false}
      panelClassName="max-w-lg rounded-lg"
      bodyClassName="min-h-0"
      closeOnBackdrop
    >
      <div>
        <div className="border-b border-gray-100 bg-slate-50 px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col justify-center">
              <h2 className="font-semibold text-sky-800">Agenda Kegiatan</h2>
              <p className="text-xs leading-tight text-gray-500">
                {fullDate.charAt(0).toUpperCase() + fullDate.slice(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto bg-white p-2">
          {events.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm italic text-slate-400">Tidak ada kegiatan pada tanggal ini.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="rounded-xs border border-slate-100 bg-slate-50/20 p-3 transition-colors hover:bg-slate-50">
                  <p className="text-sm font-semibold leading-snug text-slate-800">
                    {event.kegiatan ?? "Tanpa Nama Kegiatan"}
                  </p>

                  {event.waktu ? (
                    <p className="mt-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-400">Jam:</span> {event.waktu}
                    </p>
                  ) : null}
                  {event.detail ? (
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      <span className="font-medium text-slate-400">Keterangan:</span> {event.detail}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 bg-white px-4 py-3">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
