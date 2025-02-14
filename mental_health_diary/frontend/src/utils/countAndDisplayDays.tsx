export function dayTitle(number: number): string {
    if (number > 10 && [11, 12, 13, 14].includes(number % 100)) return 'дней';
    const last_num = number % 10;
    if (last_num === 1) return 'день';
    if ([2, 3, 4].includes(last_num)) return 'дня';
    return 'дней';
}

export function daysSince(date: string): number {
    const registerDate = new Date(date);
    const today = new Date();
    const difference = today.getTime() - registerDate.getTime();
    const days = Math.floor(difference / (1000 * 3600 * 24));
    return days;
}