import { google } from "googleapis";
import { randomUUID } from "crypto";
import { fromZonedTime, toZonedTime, format } from "date-fns-tz";
import { scheduleConfig } from "./scheduleConfig";

// ---------------------------------------------------------------------------
// OAuth2 client, authorized ONCE against the coach's Google Workspace / Gmail
// calendar. See README.md -> "Google Calendar setup" for how to obtain the
// refresh token below. After that one-time step, everything here is fully
// automatic — no further human approval is needed to create events.
// ---------------------------------------------------------------------------
function getOAuthClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } =
    process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error(
      "Missing Google Calendar credentials. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REFRESH_TOKEN (see README.md)."
    );
  }

  const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // redirect URI used only during the one-time token setup
  );
  oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return oAuth2Client;
}

function getCalendarClient() {
  return google.calendar({ version: "v3", auth: getOAuthClient() });
}

function getCalendarId() {
  return process.env.GOOGLE_CALENDAR_ID || "primary";
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

/** Builds the list of candidate "HH:mm" slot start times for a given weekday. */
function buildDaySlots(dateStr: string): string[] {
  const weekday = toZonedTime(
    fromZonedTime(`${dateStr}T12:00:00`, scheduleConfig.timeZone),
    scheduleConfig.timeZone
  ).getDay();

  const hours = scheduleConfig.workingHours[weekday];
  if (!hours) return [];

  const slots: string[] = [];
  const [startH, startM] = hours.start.split(":").map(Number);
  const [endH, endM] = hours.end.split(":").map(Number);
  const duration = scheduleConfig.sessionDurationMinutes;

  let cursorMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (cursorMinutes + duration <= endMinutes) {
    const h = Math.floor(cursorMinutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (cursorMinutes % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    cursorMinutes += duration;
  }
  return slots;
}

/** Returns the "HH:mm" slots on `dateStr` (YYYY-MM-DD) that are still free. */
export async function getAvailableSlots(dateStr: string): Promise<string[]> {
  const candidateSlots = buildDaySlots(dateStr);
  if (candidateSlots.length === 0) return [];

  const dayStartUtc = fromZonedTime(
    `${dateStr}T00:00:00`,
    scheduleConfig.timeZone
  );
  const dayEndUtc = fromZonedTime(
    `${dateStr}T23:59:59`,
    scheduleConfig.timeZone
  );

  const calendar = getCalendarClient();
  const freebusy = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStartUtc.toISOString(),
      timeMax: dayEndUtc.toISOString(),
      timeZone: scheduleConfig.timeZone,
      items: [{ id: getCalendarId() }],
    },
  });

  const busyPeriods =
    freebusy.data.calendars?.[getCalendarId()]?.busy?.map((b) => ({
      start: new Date(b.start as string).getTime(),
      end: new Date(b.end as string).getTime(),
    })) ?? [];

  const duration = scheduleConfig.sessionDurationMinutes;

  return candidateSlots.filter((slot) => {
    const slotStart = fromZonedTime(
      `${dateStr}T${slot}:00`,
      scheduleConfig.timeZone
    ).getTime();
    const slotEnd = slotStart + duration * 60_000;

    // Don't offer slots already in the past.
    if (slotStart < Date.now()) return false;

    return !busyPeriods.some(
      (busy) => slotStart < busy.end && slotEnd > busy.start
    );
  });
}

// ---------------------------------------------------------------------------
// Booking creation
// ---------------------------------------------------------------------------

export interface BookingInput {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  email: string;
  notes?: string;
}

export interface BookingResult {
  eventId: string;
  meetLink: string;
  startTime: string; // human readable, in scheduleConfig.timeZone
}

/**
 * Creates the calendar event for the requested slot. Because the request
 * includes `conferenceData.createRequest`, Google Calendar generates a fresh
 * Google Meet link automatically the moment the event is created — no manual
 * step by the coach is needed.
 */
export async function createBooking(
  input: BookingInput
): Promise<BookingResult> {
  const { date, time, name, email, notes } = input;

  // Re-validate the slot is still free right before booking (avoids a race
  // between two people booking the same slot at nearly the same time).
  const stillAvailable = await getAvailableSlots(date);
  if (!stillAvailable.includes(time)) {
    throw new Error("SLOT_TAKEN");
  }

  const startUtc = fromZonedTime(`${date}T${time}:00`, scheduleConfig.timeZone);
  const endUtc = new Date(
    startUtc.getTime() + scheduleConfig.sessionDurationMinutes * 60_000
  );

  const calendar = getCalendarClient();
  const response = await calendar.events.insert({
    calendarId: getCalendarId(),
    conferenceDataVersion: 1,
    sendUpdates: "all", // emails the confirmation + Meet link to the client automatically
    requestBody: {
      summary: `Sesión Personalizada — ${name}`,
      description: notes
        ? `Reservado desde el sitio web.\n\nNotas del cliente:\n${notes}`
        : "Reservado desde el sitio web.",
      start: { dateTime: startUtc.toISOString(), timeZone: scheduleConfig.timeZone },
      end: { dateTime: endUtc.toISOString(), timeZone: scheduleConfig.timeZone },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    },
  });

  const meetLink =
    response.data.hangoutLink ??
    response.data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video"
    )?.uri;

  if (!meetLink) {
    throw new Error("MEET_LINK_NOT_CREATED");
  }

  return {
    eventId: response.data.id as string,
    meetLink,
    startTime: format(toZonedTime(startUtc, scheduleConfig.timeZone), "PPPP p", {
      timeZone: scheduleConfig.timeZone,
    }),
  };
}
