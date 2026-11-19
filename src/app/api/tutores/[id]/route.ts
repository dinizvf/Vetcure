
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { exigirAdministrador } from "@/lib/auth";
import { descriptografarCPF } from "@/lib/crypto";
import { tutorSchema } from "@/lib/validations";

type Contexto = {
  params: Promise<{ id: string }>;
};

function validarId(id: string) {
  const tutorId = Number(id);

  if (
    !/^\d+$/.test(id) ||
    !Number.isSafeInteger(tutorId) ||
    tutorId <= 0
  ) {
    return null;
  }

  return tutorId;
}

// CONSULTAR TUTOR
export async function GET(
  request: NextRequest,
  context: Contexto
) {
  try {
    await exigirAdministrador();

    const { id } = await context.params;
    const tutorId = validarId(id);

    if (!tutorId) {
      return NextResponse.json(
        { sucesso: false, mensagem: "ID do tutor inválido." },
        { status: 400 }
      );
    }

    const [resultados]: any = await pool.execute(
      `SELECT
        id,
        nome,
        cpf_ciphertext,
        cpf_iv,
        cpf_auth_tag,
        telefone,
        email,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep
      FROM tutores
      WHERE id = ?
      LIMIT 1`,
      [tutorId]
    );

    if (resultados.length === 0) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Tutor não encontrado." },
        { status: 404 }
      );
    }

    const tutor = resultados[0];

    const cpfCompleto = descriptografarCPF(
      Buffer.from(tutor.cpf_ciphertext),
      Buffer.from(tutor.cpf_iv),
      Buffer.from(tutor.cpf_auth_tag)
    );

    return NextResponse.json({
      sucesso: true,
      tutor: {
        id: tutor.id,
        nome: tutor.nome,
        cpf: `***.***.***-${cpfCompleto.slice(-2)}`,
        telefone: tutor.telefone,
        email: tutor.email,
        logradouro: tutor.logradouro,
        numero: tutor.numero,
        complemento: tutor.complemento,
        bairro: tutor.bairro,
        cidade: tutor.cidade,
        estado: tutor.estado,
        cep: tutor.cep,
      },
    });

  } catch (error: any) {
    if (error.message === "ACESSO_NAO_AUTORIZADO") {
      return NextResponse.json(
        { sucesso: false, mensagem: "Você precisa estar autenticado." },
        { status: 401 }
      );
    }

    console.error("Erro ao consultar tutor:", error);

    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao consultar os dados do tutor." },
      { status: 500 }
    );
  }
}

// ATUALIZAR TUTOR
export async function PUT(
  request: NextRequest,
  context: Contexto
) {
  try {
    await exigirAdministrador();

    const { id } = await context.params;
    const tutorId = validarId(id);

    if (!tutorId) {
      return NextResponse.json(
        { sucesso: false, mensagem: "ID do tutor inválido." },
        { status: 400 }
      );
    }

    const body = await request.json();

    // O CPF não é alterado pela edição.
    const dadosNormalizados = {
      ...body,
      estado: body.estado === "" ? undefined : body.estado,
    };

    const schemaEdicao = tutorSchema.omit({ cpf: true });
    const validacao = schemaEdicao.safeParse(dadosNormalizados);

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
    const email = dados.email?.trim().toLowerCase() || null;

    const [resultado]: any = await pool.execute(
      `UPDATE tutores SET
        nome = ?,
        telefone = ?,
        email = ?,
        logradouro = ?,
        numero = ?,
        complemento = ?,
        bairro = ?,
        cidade = ?,
        estado = ?,
        cep = ?
      WHERE id = ?`,
      [
        dados.nome,
        dados.telefone,
        email,
        dados.logradouro || null,
        dados.numero || null,
        dados.complemento || null,
        dados.bairro || null,
        dados.cidade || null,
        dados.estado?.toUpperCase() || null,
        dados.cep || null,
        tutorId,
      ]
    );

    if (resultado.affectedRows === 0) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Tutor não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Dados do tutor atualizados com sucesso!",
    });

  } catch (error: any) {
    if (error.message === "ACESSO_NAO_AUTORIZADO") {
      return NextResponse.json(
        { sucesso: false, mensagem: "Você precisa estar autenticado." },
        { status: 401 }
      );
    }

    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { sucesso: false, mensagem: "Já existe um tutor com esses dados." },
        { status: 409 }
      );
    }

    console.error("Erro ao atualizar tutor:", error);

    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao atualizar os dados do tutor." },
      { status: 500 }
    );
  }
}

// EXCLUIR TUTOR
export async function DELETE(
  request: NextRequest,
  context: Contexto
) {
  try {
    await exigirAdministrador();

    const { id } = await context.params;
    const tutorId = validarId(id);

    if (!tutorId) {
      return NextResponse.json(
        { sucesso: false, mensagem: "ID do tutor inválido." },
        { status: 400 }
      );
    }

    const [resultado]: any = await pool.execute(
      "DELETE FROM tutores WHERE id = ?",
      [tutorId]
    );

    if (resultado.affectedRows === 0) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Tutor não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Tutor excluído com sucesso!",
    });

  } catch (error: any) {
    if (error.message === "ACESSO_NAO_AUTORIZADO") {
      return NextResponse.json(
        { sucesso: false, mensagem: "Você precisa estar autenticado." },
        { status: 401 }
      );
    }

    // Impede excluir tutores que possuem registros vinculados.
    if (
      error.code === "ER_ROW_IS_REFERENCED_2" ||
      error.code === "ER_ROW_IS_REFERENCED" ||
      error.errno === 1451
    ) {
      return NextResponse.json(
        {
          sucesso: false,
          mensagem:
            "Não é possível excluir este tutor porque existem pets ou outros registros vinculados a ele.",
        },
        { status: 409 }
      );
    }

    console.error("Erro ao excluir tutor:", error);

    return NextResponse.json(
      { sucesso: false, mensagem: "Erro ao excluir o tutor." },
      { status: 500 }
    );
  }
}
