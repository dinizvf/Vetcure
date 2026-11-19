
import { z } from "zod";

export const tutorSchema = z.object({
  nome: z.string()
    .trim()
    .min(3, "Informe o nome completo.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),

  cpf: z.string()
    .min(1, "O CPF é obrigatório.")
    .refine(
      (cpf) => /^\d{11}$/.test(cpf.replace(/\D/g, "")),
      "CPF deve possuir 11 números."
    ),

  telefone: z.string()
    .refine(
      (telefone) => telefone.replace(/\D/g, "").length >= 10,
      "Telefone inválido."
    ),

  email: z.union([
    z.string().email("Informe um e-mail válido."),
    z.literal(""),
  ]).optional(),

  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),

  estado: z.string()
    .length(2, "Informe a sigla do estado.")
    .optional(),

  cep: z.string().optional(),
});

export const petSchema = z.object({
  tutor_id: z.number().int().positive(),
  nome: z.string().min(2),
  especie: z.string().min(2),
  raca: z.string().optional(),

  sexo: z.enum([
    "MACHO",
    "FEMEA",
    "NAO_INFORMADO",
  ]),

  data_nascimento: z.string().optional(),
  observacoes: z.string().optional(),
});

export const agendamentoSchema = z.object({
  pet_id: z.number().int().positive(),
  data_hora: z.string().min(16),
  motivo: z.string().min(3),
  observacoes: z.string().optional(),

  status: z.enum([
    "PENDENTE",
    "CONFIRMADO",
    "CONCLUIDO",
    "CANCELADO",
  ]).optional(),
});
