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

    const dayConfig = schedule[today];

    if (!dayConfig || dayConfig.closed) return false;

    const [openH, openM] = dayConfig.open.split(':').map(Number);
    const [closeH, closeM] = dayConfig.close.split(':').map(Number);

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = openH * 60 + openM;
    const closeTime = closeH * 60 + closeM;

    return currentTime >= openTime && currentTime <= closeTime;
}
