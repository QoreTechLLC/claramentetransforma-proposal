"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Laptop2, Clock, Wallet, CalendarDays } from "lucide-react";

const WEEKDAY_LABELS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const MONTH_LABELS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Builds a 6-row Monday-first calendar grid for the given month. */
function buildMonthGrid(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Mon=0..Sun=6
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return date;
  });
}

function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

type Step = "pick" | "details" | "success";

export default function BookingWidget() {
  const today = useMemo(() => new Date(new Date().toDateString()), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [step, setStep] = useState<Step>("pick");
  const [form, setForm] = useState({ name: "", email: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  const monthGrid = useMemo(
    () => buildMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedTime(null);

    fetch(`/api/availability?date=${toDateKey(selectedDate)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setSlotsError(data.error);
          setSlots([]);
        } else {
          setSlots(data.slots ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSlotsError("No pudimos cargar los horarios disponibles.");
          setSlots([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  function goToMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTime) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: toDateKey(selectedDate),
          time: selectedTime,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Ocurrió un error. Intenta de nuevo.");
        return;
      }
      setMeetLink(data.booking.meetLink);
      setStep("success");
    } catch {
      setSubmitError("No pudimos conectar con el servidor. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reservar" className="bg-white">
      <div className="mx-auto max-w-content px-6 py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr,1.15fr]">
          <div>
            <h2 className="font-display text-3xl text-caqui sm:text-4xl">
              Agenda tu cita
            </h2>
            <span className="mt-3 block text-oliva" aria-hidden>
              🌿
            </span>
            <p className="mt-4 max-w-sm leading-relaxed text-carbon/75">
              Elige el día y horario que mejor se adapte a ti.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-carbon/80">
              <li className="flex items-center gap-3">
                <Laptop2 size={18} className="text-tierra" /> Sesiones Online
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-tierra" /> Duración: 60 minutos
              </li>
              <li className="flex items-center gap-3">
                <CalendarDays size={18} className="text-tierra" /> Acompañamiento personalizado
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-marfil bg-crema/60 p-5 shadow-soft sm:p-8">
            {step === "success" ? (
              <ConfirmationView
                date={selectedDate}
                time={selectedTime!}
                meetLink={meetLink!}
                name={form.name}
              />
            ) : step === "details" ? (
              <DetailsForm
                date={selectedDate}
                time={selectedTime!}
                form={form}
                setForm={setForm}
                onBack={() => setStep("pick")}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitError={submitError}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-[1.2fr,1fr]">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      aria-label="Mes anterior"
                      onClick={() => goToMonth(-1)}
                      className="rounded-full p-1.5 text-carbon/60 hover:bg-marfil"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <p className="font-display text-base text-carbon">
                      {MONTH_LABELS[viewMonth]} {viewYear}
                    </p>
                    <button
                      aria-label="Mes siguiente"
                      onClick={() => goToMonth(1)}
                      className="rounded-full p-1.5 text-carbon/60 hover:bg-marfil"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-carbon/50">
                    {WEEKDAY_LABELS.map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>

                  <div className="mt-1 grid grid-cols-7 gap-1">
                    {monthGrid.map((date) => {
                      const inMonth = date.getMonth() === viewMonth;
                      const isPast = date < today;
                      const isSelected = toDateKey(date) === toDateKey(selectedDate);
                      const isToday = toDateKey(date) === toDateKey(today);

                      return (
                        <button
                          key={date.toISOString()}
                          disabled={isPast}
                          onClick={() => setSelectedDate(date)}
                          className={[
                            "aspect-square rounded-full text-sm transition",
                            !inMonth ? "text-carbon/25" : "text-carbon/80",
                            isPast ? "cursor-not-allowed opacity-40" : "hover:bg-marfil",
                            isSelected ? "bg-caqui text-crema hover:bg-caqui" : "",
                            isToday && !isSelected ? "ring-1 ring-arena" : "",
                          ].join(" ")}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-3 font-display text-base text-carbon">
                    {selectedDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>

                  <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
                    {loadingSlots && (
                      <p className="text-sm text-carbon/50">Cargando horarios…</p>
                    )}
                    {!loadingSlots && slotsError && (
                      <p className="text-sm text-tierra">{slotsError}</p>
                    )}
                    {!loadingSlots && !slotsError && slots.length === 0 && (
                      <p className="text-sm text-carbon/50">
                        No hay horarios disponibles este día.
                      </p>
                    )}
                    {!loadingSlots &&
                      slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={[
                            "rounded-xl border px-4 py-2.5 text-left text-sm transition",
                            selectedTime === slot
                              ? "border-caqui bg-caqui text-crema"
                              : "border-marfil bg-white text-carbon/80 hover:border-arena",
                          ].join(" ")}
                        >
                          {formatTime(slot)}
                        </button>
                      ))}
                  </div>

                  <button
                    disabled={!selectedTime}
                    onClick={() => setStep("details")}
                    className="mt-5 w-full rounded-full bg-arena py-3 text-sm font-medium text-carbon transition enabled:hover:bg-tierra enabled:hover:text-crema disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailsForm({
  date,
  time,
  form,
  setForm,
  onBack,
  onSubmit,
  submitting,
  submitError,
}: {
  date: Date;
  time: string;
  form: { name: string; email: string; notes: string };
  setForm: (f: { name: string; email: string; notes: string }) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  submitError: string | null;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <p className="font-display text-lg text-carbon">Detalles de la sesión</p>
        <p className="mt-1 text-sm text-carbon/70">
          {date.toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}{" "}
          · {formatTime(time)}
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-carbon/70">
          <li>Sesión Personalizada</li>
          <li>Online (Google Meet)</li>
          <li>60 minutos · USD $80</li>
        </ul>
      </div>

      <div>
        <label className="mb-1 block text-sm text-carbon/70" htmlFor="name">
          Nombre completo
        </label>
        <input
          id="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-xl border border-marfil bg-white px-4 py-2.5 text-sm outline-none focus:border-arena"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-carbon/70" htmlFor="email">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-xl border border-marfil bg-white px-4 py-2.5 text-sm outline-none focus:border-arena"
        />
        <p className="mt-1 text-xs text-carbon/50">
          Aquí recibirás la confirmación con el enlace de Google Meet.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm text-carbon/70" htmlFor="notes">
          ¿Algo que quieras compartir antes de tu sesión? (opcional)
        </label>
        <textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full rounded-xl border border-marfil bg-white px-4 py-2.5 text-sm outline-none focus:border-arena"
        />
      </div>

      {submitError && <p className="text-sm text-tierra">{submitError}</p>}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-5 py-2.5 text-sm text-carbon/70 hover:bg-marfil"
        >
          Atrás
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-full bg-caqui py-3 text-sm font-medium text-crema transition hover:bg-oliva disabled:opacity-60"
        >
          {submitting ? "Confirmando…" : "Confirmar reserva"}
        </button>
      </div>
    </form>
  );
}

function ConfirmationView({
  date,
  time,
  meetLink,
  name,
}: {
  date: Date;
  time: string;
  meetLink: string;
  name: string;
}) {
  const firstName = name.split(" ")[0];
  return (
    <div className="py-4 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-caqui text-2xl text-crema">
        ✓
      </span>
      <h3 className="mt-4 font-display text-xl text-carbon">
        ¡Listo, {firstName}! Tu sesión está confirmada.
      </h3>
      <p className="mt-2 text-sm text-carbon/70">
        {date.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}{" "}
        · {formatTime(time)}
      </p>
      <p className="mt-1 text-sm text-carbon/70">
        Te enviamos la confirmación por correo con este enlace de Google Meet:
      </p>
      <a
        href={meetLink}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block break-all rounded-full bg-arena px-6 py-3 text-sm font-medium text-carbon hover:bg-tierra hover:text-crema"
      >
        {meetLink}
      </a>
    </div>
  );
}
