export const convertUTCToLocal = (date: string, time?: string) => {
    if (!date) return '—'; // Handle missing date

    const dateTimeStr = time ? `${date}T${time}Z` : `${date}T00:00:00Z`;
    const localDate = new Date(dateTimeStr);

    if (isNaN(localDate.getTime())) {
        console.error(`Invalid date/time received: ${dateTimeStr}`);
        return 'Invalid date';
    }

    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(localDate);
};