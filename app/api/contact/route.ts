import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  packageSummary: z.string(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 })
  }

  const { name, email, phone, packageSummary } = parsed.data
  const studioEmail = process.env.STUDIO_EMAIL ?? 'info@studyo.com'
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'konfigurator@studyo.com',
      to: studioEmail,
      subject: `Yeni Paket İsteği - ${name}`,
      text: [
        `Ad: ${name}`,
        `E-posta: ${email}`,
        phone ? `Telefon: ${phone}` : '',
        '',
        packageSummary,
      ]
        .filter(Boolean)
        .join('\n'),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'E-posta gönderilemedi' }, { status: 500 })
  }
}
