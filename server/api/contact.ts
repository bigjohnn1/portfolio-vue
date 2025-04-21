import { defineEventHandler, readBody, createError } from "h3";
import { z } from "zod";
import validator from "validator";

const schema = z.object({
  name: z.string().min(2, "name_min_length").max(50, "name_max_length"),
  email: z.string().email("invalid_email"),
  reason: z.enum(["inquiry", "suggestion", "request", "collaboration"], {
    message: "invalid_reason",
  }),
  message: z
    .string()
    .min(10, "message_min_length")
    .max(1000, "message_max_length"),
});

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return { status: 400, error: parsed.error.issues[0].message };

  const s = {
    name: validator.escape(parsed.data.name).trim(),
    email: validator.normalizeEmail(parsed.data.email) || parsed.data.email,
    reason: parsed.data.reason,
    message: validator.escape(parsed.data.message).trim(),
  };

  const { sendMail } = useNodeMailer();
  try {
    await sendMail({
      to: useRuntimeConfig().contactMail,
      subject: `[${s.reason.toUpperCase()}] Nová zpráva od ${s.name}`,
      text: `Důvod: ${s.reason}\nJméno: ${s.name}\nE-mail: ${s.email}\nZpráva: ${s.message}`,
    });
    return { status: 200, success: true };
  } catch {
    return { status: 500, error: "email_failed" };
  }
});
