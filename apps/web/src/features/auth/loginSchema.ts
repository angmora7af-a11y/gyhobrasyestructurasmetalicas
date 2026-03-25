import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Ingrese correo o usuario").email("Formato de correo inválido"),
  password: z.string().min(1, "Ingrese contraseña"),
  role: z.enum([
    "cliente",
    "aportante_catalogo",
    "admin",
    "logistica",
    "facturacion",
    "cartera",
    "credito",
  ]),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
