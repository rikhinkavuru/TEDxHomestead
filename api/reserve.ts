/**
 * POST /api/reserve — reserve a ticket, then email a confirmation.
 *
 * Body: { name, email, phone }
 * Returns the reserve_ticket() result plus `emailSent`.
 *
 * The seat is held by Supabase's reserve_ticket() (atomic, capacity-capped).
 * Email goes out only after a successful reservation, and only to the address
 * on that reservation, so this endpoint can't be used to spam arbitrary inboxes
 * beyond the per-email ticket limit enforced in the database.
 *
 * Env (set in Vercel):
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY  — same values the site uses
 *   RESEND_API_KEY                             — from the Resend integration
 *   RESEND_FROM (optional)                     — e.g. "TEDxHomestead <tickets@tedxhomestead.com>"
 *                                                once the domain is verified in Resend
 */

declare const process: { env: Record<string, string | undefined> }

// Keep in sync with src/data/event.ts (not imported: this runs as a separate
// serverless function and the site's module graph isn't bundled into it).
const EVENT = {
  date: 'Tuesday, October 27, 2026',
  time: '6:00 PM – 8:00 PM',
  doorsOpen: '5:30 PM',
  venue: 'Allen County Public Library, Main Branch · Theater',
  address: '900 Library Plaza, Fort Wayne, IN 46802',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Allen+County+Public+Library+Main+Branch+900+Library+Plaza+Fort+Wayne+IN+46802',
  site: 'https://tedxhomestead.com',
  contactEmail: 'rikhinkavuru@gmail.com',
}

interface ReserveRpc {
  ok: boolean
  reason?: string
  code?: string
  name?: string
  reserved_at?: string
  remaining?: number
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  })

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, reason: 'invalid' }, 400)
  }

  const name = str(body.name, 120)
  const email = str(body.email, 254)
  const phone = str(body.phone, 40)
  if (!name || !email || !phone) return json({ ok: false, reason: 'invalid' }, 400)

  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error('reserve: Supabase env vars missing')
    return json({ ok: false, reason: 'error' }, 500)
  }

  let res: ReserveRpc
  try {
    const r = await fetch(`${url}/rest/v1/rpc/reserve_ticket`, {
      method: 'POST',
      headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ p_name: name, p_email: email, p_phone: phone }),
    })
    if (!r.ok) {
      console.error('reserve: rpc failed', r.status, await r.text())
      return json({ ok: false, reason: 'error' }, 502)
    }
    res = (await r.json()) as ReserveRpc
  } catch (e) {
    console.error('reserve: rpc threw', e)
    return json({ ok: false, reason: 'error' }, 502)
  }

  if (!res.ok || !res.code) return json(res)

  const emailSent = await sendConfirmation(email, res.name ?? name, res.code)
  return json({ ...res, emailSent })
}

async function sendConfirmation(to: string, name: string, code: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('reserve: RESEND_API_KEY not set, skipping confirmation email')
    return false
  }
  const from = process.env.RESEND_FROM || 'TEDxHomestead <onboarding@resend.dev>'
  const first = name.split(' ')[0]

  const text = [
    `Hi ${first},`,
    '',
    `Your seat at TEDxHomestead is reserved for ${name}.`,
    '',
    `Ticket code: ${code}`,
    `When: ${EVENT.date}, ${EVENT.time} (doors open ${EVENT.doorsOpen})`,
    `Where: ${EVENT.venue}`,
    `       ${EVENT.address}`,
    `Map: ${EVENT.mapsUrl}`,
    '',
    'No need to print anything. Just give your name at the door.',
    `If plans change, reply to this email so we can free up your seat.`,
    '',
    `See you there!`,
    'TEDxHomestead',
    EVENT.site,
  ].join('\n')

  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;color:#6b6b6b;font:500 12px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#111;font:15px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">${value}</td></tr>`

  const html = `<!doctype html><html><body style="margin:0;background:#f4f2ef;padding:32px 16px">
<div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#ff8a63,#e62b1e 44%,#b51c12);padding:28px 28px 24px;color:#fff">
    <div style="font:500 12px/1 ui-monospace,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;opacity:.9">TEDxHomestead · Admit one</div>
    <div style="margin-top:18px;font:600 30px/1.1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">${esc(name)}</div>
    <div style="margin-top:10px;font:500 14px/1 ui-monospace,Menlo,monospace;opacity:.85">${esc(code)}</div>
  </div>
  <div style="padding:24px 28px 28px">
    <p style="margin:0 0 18px;color:#111;font:16px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">Hi ${esc(first)}, your seat is reserved. See you there!</p>
    <table role="presentation" style="border-collapse:collapse">
      ${row('When', `${EVENT.date}<br>${EVENT.time} · doors ${EVENT.doorsOpen}`)}
      ${row('Where', `${EVENT.venue}<br><a href="${EVENT.mapsUrl}" style="color:#e62b1e">${EVENT.address}</a>`)}
    </table>
    <p style="margin:20px 0 0;color:#6b6b6b;font:14px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">No need to print anything. Just give your name at the door. If plans change, reply to this email so we can free up your seat.</p>
  </div>
</div>
</body></html>`

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: EVENT.contactEmail,
        subject: `You're in: TEDxHomestead, ${EVENT.date}`,
        text,
        html,
      }),
    })
    if (!r.ok) {
      console.error('reserve: resend failed', r.status, await r.text())
      return false
    }
    return true
  } catch (e) {
    console.error('reserve: resend threw', e)
    return false
  }
}
