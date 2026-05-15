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
