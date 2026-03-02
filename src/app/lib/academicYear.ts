/**
 * Returns the academic year for a given date string, using the April–March cycle.
 * e.g. "2025-08-15" → "2025–2026", "2026-02-10" → "2025–2026"
 */
export function getAcademicYear(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Unknown';
    const month = d.getMonth(); // 0-indexed: 0=Jan … 3=Apr … 11=Dec
    const year = d.getFullYear();
    // April (3) onwards → academic year starts this calendar year
    // Jan–March (0–2) → academic year started previous calendar year
    const startYear = month >= 3 ? year : year - 1;
    return `${startYear}–${startYear + 1}`;
}
