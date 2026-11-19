import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { exigirAdministrador } from "@/lib/auth";
import { petSchema } from "@/lib/validations";

export async function GET() {
  try {
    await exigirAdministrador();

    const [pets]: any = await pool.execute(
      `SELECT
        p.id,
        p.tutor_id,
        p.nome,
        p.especie,
        p.raca,
        p.sexo,
        p.data_nascimento,
        p.observacoes,
        p.ativo,
        t.nome AS tutor_nome
      FROM pets p
      INNER JOIN tutores t ON t.id = p.tutor_id
      WHERE p.ativo = TRUE
      ORDER BY p.nome ASC`
    );

    return NextResponse.json({
      sucesso: true,
      pets,
    });

  } catch (error: any) {
    if (error.message === "ACESSO_NAO_AUTORIZADO") {
      return NextResponse.json(
        { sucesso: false, mensagem: "Você precisa estar autenticado." },
        { status: 401 }
      );
    }

    console.error("Erro ao consultar pets:", error);

    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao consultar os pets." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await exigirAdministrador();

    const body = await request.json();

    const dadosNormalizados = {
      ...body,
      tutor_id: Number(body.tutor_id),
      data_nascimento: body.data_nascimento || undefined,
    };

    const validacao = petSchema.safeParse(dadosNormalizados);

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

    const [resultado]: any = await pool.execute(
      `INSERT INTO pets (
        tutor_id,
        nome,
        especie,
        raca,
        sexo,
        data_nascimento,
        observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.tutor_id,
        dados.nome.trim(),
        dados.especie.trim(),
        dados.raca?.trim() || null,
        dados.sexo,
        dados.data_nascimento || null,
        dados.observacoes?.trim() || null,
      ]
    );

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Pet cadastrado com sucesso!",
        pet: {
          id: resultado.insertId,
          nome: dados.nome,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    if (error.message === "ACESSO_NAO_AUTORIZADO") {
      return NextResponse.json(
        { sucesso: false, mensagem: "Você precisa estar autenticado." },
        { status: 401 }
      );
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return NextResponse.json(
        { sucesso: false, mensagem: "O tutor selecionado não existe." },
        { status: 400 }
      );
    }

    console.error("Erro ao cadastrar pet:", error);

    return NextResponse.json(
      { sucesso: false, mensagem: "Erro interno ao cadastrar pet." },
      { status: 500 }
    );
  }
}