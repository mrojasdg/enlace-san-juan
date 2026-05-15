export interface DaySchedule {
    open: string;
    close: string;
    closed: boolean;
}

export type WeeklySchedule = Record<string, DaySchedule>;

export function isOpenNow(schedule: WeeklySchedule): boolean {
    if (!schedule) return false;

    const now = new Date();
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const today = days[now.getDay()];
    const daySchedule = schedule[today];

    if (!daySchedule || daySchedule.closed) return false;

    const [openH, openM] = daySchedule.open.split(':').map(Number);
    const [closeH, closeM] = daySchedule.close.split(':').map(Number);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}
