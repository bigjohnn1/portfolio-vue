import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import validator from 'validator'
import { ZenStackClient } from '@zenstackhq/orm'
import { PostgresDialect } from 'kysely'
import pg from 'pg'
import { schema } from '../../zenstack/schema'

const { Pool } = pg

const db = new ZenStackClient(schema, {
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
})

const formSchema = z.object({
  name: z.string().min(2, 'name_min_length').max(50, 'name_max_length'),
  email: z.string().email('invalid_email'),
  reason: z.enum(['inquiry', 'suggestion', 'request', 'collaboration'], {
    message: 'invalid_reason',
  }),
  message: z
    .string()
    .min(10, 'message_min_length')
    .max(1000, 'message_max_length'),
  consent: z
    .boolean()
    .refine(val => val === true, { message: 'consent_required' }),
})

export default defineEventHandler(async (e) => {
  const body = await readBody(e)
  const parsed = formSchema.safeParse(body)
  if (!parsed.success)
    return { status: 400, error: parsed.error?.issues[0]?.message }

  const s = {
    name: validator.escape(parsed.data.name).trim(),
    email: validator.normalizeEmail(parsed.data.email) || parsed.data.email,
    reason: parsed.data.reason,
    message: validator.escape(parsed.data.message).trim(),
    consent: parsed.data.consent,
  }

  try {
    await db.contactSubmission.create({
      data: {
        name: s.name,
        email: s.email,
        reason: s.reason,
        message: s.message,
        consent: s.consent,
      },
    })

    const { sendMail } = useNodeMailer()
    try {
      await sendMail({
        to: useRuntimeConfig().contactMail,
        subject: `[${s.reason.toUpperCase()}] Nová zpráva od ${s.name}`,
        text: `Důvod: ${s.reason}\nJméno: ${s.name}\nE-mail: ${s.email}\nZpráva: ${s.message}\nSouhlas: ${s.consent}`,
      })
    }
    catch (emailErr: unknown) {
      console.error('Odeslání email selhalo:', emailErr)
      return { status: 500, error: 'email_failed', details: emailErr instanceof Error ? emailErr.message : 'Unknown' }
    }

    return { status: 200, success: true }
  }
  catch (err: unknown) {
    console.error('Obecná chyba:', err)
    return { status: 500, error: 'server_error', details: err instanceof Error ? err.message : 'Unknown' }
  }
})
