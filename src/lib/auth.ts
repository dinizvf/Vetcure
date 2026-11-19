
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

const COOKIE_NAME = "vetcare_session";

const SESSION_DURATION = 8 * 60 * 60;

export async function criarSessao(
  id: number,
  email: string
) {
  const token = await new SignJWT({
    email,
    perfil: "ADMIN",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(id))
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function obterSessao() {
  const cookieStore = await cookies();

  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (
      payload.perfil !== "ADMIN" ||
      !payload.sub
    ) {
      return null;
    }

    return {
      id: Number(payload.sub),
      email: String(payload.email),
      perfil: String(payload.perfil),
    };
  } catch {
    return null;
  }
}

export async function encerrarSessao() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function exigirAdministrador() {
  const sessao = await obterSessao();

  if (!sessao) {
    throw new Error("ACESSO_NAO_AUTORIZADO");
  }

  return sessao;
}
