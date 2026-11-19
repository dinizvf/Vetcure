
import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from "crypto";

const encryptionKey = Buffer.from(
  process.env.CPF_ENCRYPTION_KEY || "",
  "hex"
);

const hashSecret = process.env.CPF_HASH_SECRET || "";

if (encryptionKey.length !== 32 || !hashSecret) {
  throw new Error("Chaves de criptografia não configuradas.");
}

export function normalizarCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function criptografarCPF(cpf: string) {
  const cpfLimpo = normalizarCPF(cpf);

  if (!/^\d{11}$/.test(cpfLimpo)) {
    throw new Error("CPF inválido.");
  }

  const iv = randomBytes(12);

  const cipher = createCipheriv(
    "aes-256-gcm",
    encryptionKey,
    iv
  );

  const ciphertext = Buffer.concat([
    cipher.update(cpfLimpo, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  const cpfHash = createHmac("sha256", hashSecret)
    .update(cpfLimpo)
    .digest("hex");

  return {
    ciphertext,
    iv,
    authTag,
    cpfHash,
  };
}

export function descriptografarCPF(
  ciphertext: Buffer,
  iv: Buffer,
  authTag: Buffer
): string {
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey,
    iv
  );

  decipher.setAuthTag(authTag);

  const resultado = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return resultado.toString("utf8");
}

export function gerarHashCPF(cpf: string): string {
  const cpfLimpo = normalizarCPF(cpf);

  return createHmac("sha256", hashSecret)
    .update(cpfLimpo)
    .digest("hex");
}
