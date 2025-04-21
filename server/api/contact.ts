import { defineEventHandler, readBody, createError } from "h3";
import { z } from "zod";
import validator from "validator";

const schema = z.object({
  name: z
    .string()
    .min(2, "Jméno musí mít alespoň 2 znaky")
    .max(50, "Jméno je příliš dlouhé"),
  email: z.string().email("Neplatná e-mailová adresa"),
  message: z
    .string()
    .min(10, "Zpráva musí mít alespoň 10 znaků")
    .max(1000, "Zpráva je příliš dlouhá"),
});

export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0].message,
    });

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
});
