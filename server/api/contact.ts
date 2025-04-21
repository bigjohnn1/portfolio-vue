import { defineEventHandler, readBody, createError } from "h3";
import { z } from "zod";
import validator from "validator";

const schema = z.object({
  name: z.string().min(2, "name_min_length").max(50, "name_max_length"),
  email: z.string().email("invalid_email"),
  message: z
    .string()
    .min(10, "message_min_length")
    .max(1000, "message_max_length"),
});

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const s = {
    name: validator.escape(parsed.data.name).trim(),
    email: validator.normalizeEmail(parsed.data.email) || parsed.data.email,
    message: validator.escape(parsed.data.message).trim(),
  };

  const { sendMail } = useNodeMailer();
  await sendMail({
    to: useRuntimeConfig().contactMail,
    subject: `Nová zpráva od ${s.name}`,
    text: `Jméno: ${s.name}\nE-mail: ${s.email}\nZpráva: ${s.message}`,
  });
  return { success: true };
});
