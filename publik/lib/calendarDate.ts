export function formatMonthName(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        month: "long",
    }).format(date);
}

export function formatYear(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
    }).format(date);
}

export function formatFullDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
}

export function toIsoDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function addMonths(date: Date, amount: number) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getDaysInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function createCalendarDate(baseMonth: Date, dayNumber: number) {
    return new Date(baseMonth.getFullYear(), baseMonth.getMonth(), dayNumber);
}
