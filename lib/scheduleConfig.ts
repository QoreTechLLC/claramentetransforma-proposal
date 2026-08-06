// Central place to tune the coach's availability, session length and price.
// Edit this file (not the components) when the coach's schedule changes.

export const scheduleConfig = {
  timeZone: "America/New_York",
  sessionDurationMinutes: 60,
  sessionPriceLabel: "USD $80",
  sessionModality: "Online (Google Meet)",
  // 0 = Sunday ... 6 = Saturday. Hours are in 24h "HH:mm" in the timeZone above.
  workingHours: {
    1: { start: "09:00", end: "18:00" }, // Monday
    2: { start: "09:00", end: "18:00" }, // Tuesday
    3: { start: "09:00", end: "18:00" }, // Wednesday
    4: { start: "09:00", end: "18:00" }, // Thursday
    5: { start: "09:00", end: "16:00" }, // Friday
  } as Record<number, { start: string; end: string } | undefined>,
  // How many days out clients are allowed to book.
  bookingWindowDays: 45,
};
