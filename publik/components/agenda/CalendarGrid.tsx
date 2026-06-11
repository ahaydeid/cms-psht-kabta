"use client";

import { useState } from "react";
import AgendaModal, { type CalendarEvent } from "./AgendaModal";
import { createCalendarDate, getDaysInMonth, isSameDay, startOfMonth, toIsoDate } from "@/lib/calendarDate";

interface Props {
  currentMonth: Date;
  today: Date;
  events: CalendarEvent[];
}

export default function CalendarGrid({ currentMonth, today, events }: Props) {
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const trimLabel = (value: string, max: number) => (value.length > max ? `${value.slice(0, max).trimEnd()}...` : value);

  const getEventDotClass = (tipe: CalendarEvent["tipe_hari"]) => {
    switch (tipe) {
      case "LIBUR":
        return "bg-rose-500";
      case "PENTING":
        return "bg-amber-500";
      default:
        return "bg-sky-500";
    }
  };

  const firstDayOfMonth = startOfMonth(currentMonth);
  const startDay = firstDayOfMonth.getDay();
  const days: Date[] = [];

  const daysInMonth = getDaysInMonth(currentMonth);
  const totalSlots = Math.ceil((startDay + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalSlots; i++) {
    const dayNumber = i - startDay + 1;
    days.push(createCalendarDate(currentMonth, dayNumber));
  }

  const openModal = (date: Date) => {
    const formatted = toIsoDate(date);
    const filtered = events.filter((event) => event.tanggal === formatted);
    setSelectedDate(date);
    setSelectedEvents(filtered);
  };

  const closeModal = () => {
    setSelectedEvents(null);
    setSelectedDate(null);
  };

  return (
    <>
      <div className="grid grid-cols-7 border-b border-slate-100">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((dayLabel) => (
          <div key={dayLabel} className="py-4 text-center text-xs font-medium text-slate-600">
            {dayLabel}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t border-white bg-white">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isToday = isSameDay(date, today);
          const isSunday = date.getDay() === 0;

          const todayEvents = events.filter((event) => event.tanggal === toIsoDate(date));
          const isLibur = todayEvents.some((event) => event.tipe_hari === "LIBUR") || isSunday;

          let bgColor = "bg-white";
          if (!isCurrentMonth) {
            bgColor = "bg-white";
          } else if (isLibur) {
            bgColor = "bg-rose-50/50";
          }

          return (
            <div
              key={index}
              onClick={() => isCurrentMonth && openModal(date)}
              className={`aspect-square overflow-hidden border-r border-b border-gray-100 p-1.5 transition-all ${bgColor} ${
                isCurrentMonth ? "cursor-pointer hover:bg-slate-50" : "pointer-events-none opacity-20"
              }`}
            >
              {isCurrentMonth ? (
                <div className="flex h-full flex-col justify-between">
                  <div className="flex justify-start">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        isToday ? "bg-sky-600 text-white" : isSunday ? "text-rose-500" : "text-slate-400"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  <div className="mt-0.5 min-h-0 overflow-hidden">
                    {todayEvents.length > 0 ? (
                      <div className="flex min-w-0 items-center gap-1 rounded px-0.5 py-0 transition-colors hover:bg-white/50">
                        <div
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            todayEvents.length > 1 ? "bg-slate-500" : getEventDotClass(todayEvents[0]!.tipe_hari)
                          }`}
                        />
                        <p
                          className={`min-w-0 truncate text-[8px] leading-tight ${
                            todayEvents.length > 1 ? "text-slate-500" : "text-slate-600"
                          }`}
                        >
                          {todayEvents.length > 1
                            ? trimLabel(`x${todayEvents.length} kegiatan`, 16)
                            : trimLabel(todayEvents[0]!.kegiatan ?? "Tanpa kegiatan", 16)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {selectedDate ? <AgendaModal date={selectedDate} events={selectedEvents || []} onClose={closeModal} /> : null}
    </>
  );
}
