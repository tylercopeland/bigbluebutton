/**
 * Reads a typed time: minutes ("7"), "mm:ss" or "hh:mm:ss"
 * @returns The time in seconds, or null when it isn't a valid time
 */
export const parseTime = (text: string, maxSeconds: number): number | null => {
  const parts = text.trim().split(':');
  if (parts.length > 3 || !parts.every((part) => /^\d{1,4}$/.test(part))) return null;
  const numbers = parts.map(Number);
  const [hours, minutes, seconds] = parts.length === 1
    ? [0, numbers[0], 0]
    : [0, ...numbers].slice(-3);
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? Math.min(total, maxSeconds) : null;
};

export default { parseTime };
