
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { exigirAdministrador } from "@/lib/auth";
import { tutorSchema } from "@/lib/validations";
import { criptografarCPF } from "@/lib/crypto";

export async function GET() {
  try {
    await exigirAdministrador();

    const [tutores]: any = await pool.execute(
      `SELECT
        id,
        nome,
        telefone,
        email,
        cidade
       FROM tutores
       ORDER BY nome ASC`
    );

    return NextResponse.json({
      sucesso: true,
      tutores,
    });

  } catch (error: any) {
    if (error.message === "ACESSO_NAO_AUTORIZADO") {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "Você precisa estar autenticado.",
        },
        { status: 401 }
      );
    }

    console.error("Erro ao consultar tutores:", error);

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: "Erro ao consultar os tutores.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await exigirAdministrador();

    const body = await request.json();

    const validacao = tutorSchema.safeParse(body);

    if (!validacao.success) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "Verifique os dados informados.",
          erros: validacao.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const dados = validacao.data;
    const cpfProtegido = criptografarCPF(dados.cpf);
    const email = dados.email?.trim().toLowerCase() || null;

    const [resultado]: any = await pool.execute(
      `INSERT INTO tutores (
        nome,
        cpf_ciphertext,
        cpf_iv,
        cpf_auth_tag,
        cpf_hash,
        telefone,
        email,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.nome,
        cpfProtegido.ciphertext,
        cpfProtegido.iv,
        cpfProtegido.authTag,
        cpfProtegido.cpfHash,
        dados.telefone,
        email,
        dados.logradouro || null,
        dados.numero || null,
        dados.complemento || null,
        dados.bairro || null,
        dados.cidade || null,
        dados.estado?.toUpperCase() || null,
        dados.cep || null,
      ]
    );

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Tutor cadastrado com sucesso!",
        tutor: {
          id: resultado.insertId,
          nome: dados.nome,
          telefone: dados.telefone,
          email,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    if (error.message === "ACESSO_NAO_AUTORIZADO") {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "Você precisa estar autenticado para realizar esta ação.",
        },
        { status: 401 }
      );
    }

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "Já existe um tutor cadastrado com esses dados.",
        },
        { status: 409 }
      );
    }

    console.error("Erro ao cadastrar tutor:", error);

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: "Erro interno ao cadastrar tutor.",
      },
      { status: 500 }
    );
  }
}
