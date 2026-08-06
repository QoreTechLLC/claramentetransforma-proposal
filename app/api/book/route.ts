import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/googleCalendar";

export async function POST(req: NextRequest) {
  let body: {
    date?: string;
    time?: string;
    name?: string;
    email?: string;
    notes?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido." }, { status: 400 });
  }

  const { date, time, name, email, notes } = body;

  if (!date || !time || !name || !email) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: date, time, name, email." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Correo inválido." }, { status: 400 });
  }

  try {
    const booking = await createBooking({ date, time, name, email, notes });
    return NextResponse.json({ success: true, booking });
  } catch (err) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return NextResponse.json(
        {
          error:
            "Ese horario ya fue reservado por otra persona. Por favor elige otro horario.",
        },
        { status: 409 }
      );
    }
    console.error("POST /api/book failed:", err);
    return NextResponse.json(
      { error: "No pudimos completar la reserva. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
