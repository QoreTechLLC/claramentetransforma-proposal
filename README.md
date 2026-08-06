# Claramente Transforma — sitio web + reservas

Landing page + sistema de reservas para Claramente Transforma, construido con
el stack estándar de QoreTech (Next.js 14, TypeScript, Tailwind CSS).

Cuando alguien reserva una sesión, el sitio crea el evento directamente en el
calendario de Google del coach y **Google genera el enlace de Meet
automáticamente** al crear el evento — no requiere ningún paso manual por
sesión. Ese es el corazón de la integración: `conferenceData.createRequest`
en `lib/googleCalendar.ts`.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- `googleapis` para la integración con Google Calendar
- Despliegue recomendado: Vercel (bajo la cuenta Teams de QoreTech)

## Puesta en marcha local

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Configuración de Google Calendar (una sola vez)

Esto es lo único que requiere trabajo manual, y solo se hace una vez por
cliente:

1. **Crear un proyecto en Google Cloud** (console.cloud.google.com) para
   QoreTech, si no existe uno ya reutilizable.
2. **Habilitar la Google Calendar API** en ese proyecto (APIs & Services →
   Enable APIs → "Google Calendar API").
3. **Configurar la pantalla de consentimiento OAuth** (OAuth consent screen):
   tipo "External" (o "Internal" si el Gmail del coach es Google Workspace
   bajo el mismo dominio de Google Cloud). Agrega tu correo como usuario de
   prueba si queda en modo "Testing".
4. **Crear credenciales OAuth**: Credentials → Create Credentials → OAuth
   client ID → "Web application". En "Authorized redirect URIs" agrega:
   `https://developers.google.com/oauthplayground`
   Copia el **Client ID** y **Client Secret** a `.env.local`.
5. **Generar el refresh token** (una sola vez, localmente):
   ```bash
   npm run get-refresh-token
   ```
   Esto abre una ventana de Google — **inicia sesión con la cuenta de Gmail
   del coach** (la que administrará su calendario), no con la tuya. Copia el
   `GOOGLE_REFRESH_TOKEN` que imprime al final a `.env.local` y a las
   variables de entorno de Vercel.
6. Deja `GOOGLE_CALENDAR_ID=primary` si las sesiones se crean en el
   calendario principal del coach, o usa un calendario secundario dedicado a
   "Sesiones" si prefieres mantenerlo separado de su calendario personal.

Después de este paso único, todo el flujo es 100% automático: el sitio
consulta la disponibilidad real del calendario (`freebusy.query`) y, al
confirmar una reserva, crea el evento con el enlace de Meet y envía la
invitación por correo tanto al coach como al cliente (`sendUpdates: "all"`).

## Editar horarios, duración y precio

Todo esto vive en un solo archivo, sin tocar componentes:
`lib/scheduleConfig.ts` — días/horas de trabajo, duración de la sesión (60
min por defecto), zona horaria y el texto del precio que se muestra en el
sitio.

## Estructura

```
app/
  page.tsx              → ensambla todas las secciones
  api/availability/     → GET horarios libres para una fecha
  api/book/             → POST crea la reserva + evento + Meet link
components/
  Navbar, Hero, Purpose, Services, BookingWidget, Testimonials, Footer
lib/
  googleCalendar.ts      → OAuth2, disponibilidad, creación de reservas
  scheduleConfig.ts       → horarios, duración, precio, zona horaria
scripts/
  get-refresh-token.mjs  → helper de un solo uso (ver paso 5 arriba)
```

## Pendiente / próximos pasos sugeridos

- Cobro en línea (Stripe) antes de confirmar la reserva, si el coach quiere
  cobrar por adelantado en vez de facturar aparte.
- Página "Programa" y "Recursos" (el mockup las deja como futuras secciones
  del nav; hoy apuntan a anclas vacías).
- Analytics (GA4/GTM) y formulario de contacto con Resend, siguiendo el
  patrón ya usado en el sitio de QoreTech.
