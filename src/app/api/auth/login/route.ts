
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { criarSessao } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = String(body.email || "").trim().toLowerCase();
    const senha = String(body.senha || "");

    // Validar campos obrigatórios
    if (!email || !senha) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "Informe o e-mail e a senha.",
        },
        { status: 400 }
      );
    }

    // Buscar administrador no banco
    const [usuarios]: any = await pool.execute(
      `SELECT id, nome, email, senha_hash, perfil, ativo
       FROM usuarios
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (usuarios.length === 0) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "E-mail ou senha incorretos.",
        },
        { status: 401 }
      );
    }

    const usuario = usuarios[0];

    // Verificar se a conta está ativa
    if (!usuario.ativo || usuario.perfil !== "ADMIN") {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "Esta conta não possui acesso ao sistema.",
        },
        { status: 403 }
      );
    }

    // Conferir senha
    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaCorreta) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "E-mail ou senha incorretos.",
        },
        { status: 401 }
      );
    }

    // Criar sessão de 8 horas
    await criarSessao(Number(usuario.id), usuario.email);

    return NextResponse.json({
      sucesso: true,
      mensagem: "Login realizado com sucesso!",
      administrador: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });

  } catch (error) {
    console.error("Erro no login:", error);

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: "Erro interno ao realizar login.",
      },
      { status: 500 }
    );
  }
}
