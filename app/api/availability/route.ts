import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/googleCalendar";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Provide a valid ?date=YYYY-MM-DD parameter." },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(date);
    return NextResponse.json({ date, slots });
  } catch (err) {
    console.error("GET /api/availability failed:", err);
    return NextResponse.json(
      { error: "No pudimos cargar la disponibilidad. Intenta de nuevo en unos minutos." },
      { status: 500 }
    );
  }
}
