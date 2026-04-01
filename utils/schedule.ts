export interface DaySchedule {
    open: string;
    close: string;
    closed: boolean;
}

export type WeeklySchedule = Record<string, DaySchedule>;

export function isOpenNow(schedule: WeeklySchedule): boolean {
    if (!schedule) return false;

    // Forzar la hora a la Zona Horaria de México (San Juan del Río)
    const options = { timeZone: 'America/Mexico_City', hour12: false };
    const dateString = new Date().toLocaleString('en-US', options);
    const nowLocal = new Date(dateString);

    const days = [
        'domingo',
        'lunes',
        'martes',
        'miercoles',
        'jueves',
        'viernes',
        'sabado',
    ];
    const today = days[nowLocal.getDay()];
    const daySchedule = schedule[today];

    if (!daySchedule || daySchedule.closed) return false;

    const [openH, openM] = daySchedule.open.split(':').map(Number);
    const [closeH, closeM] = daySchedule.close.split(':').map(Number);

    const currentMinutes = nowLocal.getHours() * 60 + nowLocal.getMinutes();
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}
