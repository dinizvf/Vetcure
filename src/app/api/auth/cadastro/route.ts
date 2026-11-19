
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const nome = String(body.nome || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const senha = String(body.senha || "");

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Preencha todos os campos." },
        { status: 400 }
      );
    }

    if (nome.length > 120) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "O nome deve ter no máximo 120 caracteres.",
        },
        { status: 400 }
      );
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido || email.length > 180) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Informe um e-mail válido." },
        { status: 400 }
      );
    }

    if (senha.length < 8) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "A senha deve ter pelo menos 8 caracteres.",
        },
        { status: 400 }
      );
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const [resultado]: any = await pool.execute(
      `INSERT INTO usuarios (nome, email, senha_hash)
       VALUES (?, ?, ?)`,
      [nome, email, senhaHash]
    );

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Funcionário cadastrado com sucesso!",
        funcionario: {
          id: resultado.insertId,
          nome,
          email,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Erro no cadastro do funcionário:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "Este e-mail já está cadastrado no sistema.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: "Erro interno ao realizar o cadastro.",
      },
      { status: 500 }
    );
  }
}
