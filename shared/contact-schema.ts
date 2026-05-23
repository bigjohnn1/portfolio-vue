import { z } from 'zod'

export const CONTACT_REASONS = ['inquiry', 'suggestion', 'request', 'collaboration'] as const

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'name_min_length')
    .max(50, 'name_max_length'),
  email: z
    .email('invalid_email')
    .max(254, 'email_max_length'),
  reason: z.enum(CONTACT_REASONS, { message: 'invalid_reason' }),
  message: z
    .string()
    .min(10, 'message_min_length')
    .max(1000, 'message_max_length'),
  consent: z
    .boolean()
    .refine(val => val === true, { message: 'consent_required' }),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
export type ContactFormField = keyof ContactFormInput
