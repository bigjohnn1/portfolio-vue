import { defineEventHandler, readBody, createError, sendError } from "h3";
import { z } from "zod";
import validator from "validator";

const contactSchema = z.object({
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

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: parsed.error.issues[0].message,
        })
      );
    }
    const sanitized = {
      name: validator.escape(parsed.data.name).trim(),
      email: validator.normalizeEmail(parsed.data.email) || parsed.data.email,
      message: validator.escape(parsed.data.message).trim(),
    };
    const { sendMail } = useNodeMailer();
    await sendMail({
      to: useRuntimeConfig().contactMail,
      subject: `Nová zpráva od ${sanitized.name}`,
      text: `Jméno: ${sanitized.name}\nE-mail: ${sanitized.email}\nZpráva: ${sanitized.message}`,
    });
    return { success: true, message: "E-mail odeslán!" };
  } catch (error) {
    console.error("Chyba při odesílání e-mailu:", error);
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "Chyba při odesílání e-mailu",
      })
    );
  }
});
