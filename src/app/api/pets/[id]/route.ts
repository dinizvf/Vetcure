
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { exigirAdministrador } from "@/lib/auth";
import { petSchema } from "@/lib/validations";

type Contexto = {
  params: Promise<{ id: string }>;
};

function validarId(id: string) {
  const numero = Number(id);

  if (
    !/^\d+$/.test(id) ||
    !Number.isSafeInteger(numero) ||
    numero <= 0
  ) {
    return null;
  }

  return numero;
}

export async function GET(
  request: NextRequest,
  context: Contexto
) {
  try {
    await exigirAdministrador();

    const { id } = await context.params;
    const petId = validarId(id);

    if (!petId) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "ID do pet inválido.",
        },
        { status: 400 }
      );
    }

    const [resultados]: any = await pool.execute(
      `SELECT
        p.id,
        p.tutor_id,
        p.nome,
        p.especie,
        p.raca,
        p.sexo,
        DATE_FORMAT(p.data_nascimento, '%Y-%m-%d') AS data_nascimento,
        p.observacoes,
        t.nome AS tutor_nome
      FROM pets p
      INNER JOIN tutores t ON t.id = p.tutor_id
      WHERE p.id = ? AND p.ativo = TRUE
      LIMIT 1`,
      [petId]
    );

    if (resultados.length === 0) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "Pet não encontrado.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      ...resultados[0],
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

    console.error("Erro ao consultar pet:", error);

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: "Erro ao consultar o pet.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: Contexto
) {
  try {
    await exigirAdministrador();

    const { id } = await context.params;
    const petId = validarId(id);

    if (!petId) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "ID do pet inválido.",
        },
        { status: 400 }
      );
    }

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
      `UPDATE pets SET
        tutor_id = ?,
        nome = ?,
        especie = ?,
        raca = ?,
        sexo = ?,
        data_nascimento = ?,
        observacoes = ?
      WHERE id = ? AND ativo = TRUE`,
      [
        dados.tutor_id,
        dados.nome.trim(),
        dados.especie.trim(),
        dados.raca?.trim() || null,
        dados.sexo,
        dados.data_nascimento || null,
        dados.observacoes?.trim() || null,
        petId,
      ]
    );

    if (resultado.affectedRows === 0) {
      const [existente]: any = await pool.execute(
        "SELECT id FROM pets WHERE id = ? AND ativo = TRUE",
        [petId]
      );

      if (existente.length === 0) {
        return NextResponse.json(
          {
            sucesso: false,
            mensagem: "Pet não encontrado.",
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Dados do pet atualizados com sucesso!",
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

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "O tutor selecionado não existe.",
        },
        { status: 400 }
      );
    }

    console.error("Erro ao atualizar pet:", error);

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: "Erro ao atualizar o pet.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: Contexto
) {
  try {
    await exigirAdministrador();

    const { id } = await context.params;
    const petId = validarId(id);

    if (!petId) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "ID do pet inválido.",
        },
        { status: 400 }
      );
    }

    const [resultado]: any = await pool.execute(
      `UPDATE pets
       SET ativo = FALSE
       WHERE id = ? AND ativo = TRUE`,
      [petId]
    );

    if (resultado.affectedRows === 0) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem: "Pet não encontrado ou já inativado.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Pet inativado com sucesso!",
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

    console.error("Erro ao inativar pet:", error);

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: "Erro ao inativar o pet.",
      },
      { status: 500 }
    );
  }
}
