
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { exigirAdministrador } from "@/lib/auth";
import { agendamentoSchema } from "@/lib/validations";

function respostaErro(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "ACESSO_NAO_AUTORIZADO"
  ) {
    return NextResponse.json(
      { mensagem: "Acesso não autorizado." },
      { status: 401 }
    );
  }

  console.error("Erro na API de agendamentos:", error);

  return NextResponse.json(
    { mensagem: "Erro interno ao processar o agendamento." },
    { status: 500 }
  );
}

function normalizarDataHora(valor: string) {
  return valor.replace("T", " ").slice(0, 16);
}

export async function GET() {
  try {
    await exigirAdministrador();

    const [agendamentos]: any = await pool.execute(
      `SELECT
        a.id,
        a.pet_id,
        DATE_FORMAT(a.data_hora, '%Y-%m-%dT%H:%i') AS data_hora,
        a.motivo,
        a.observacoes,
        a.status,
        p.nome AS pet_nome,
        p.especie AS pet_especie,
        p.raca AS pet_raca,
        t.id AS tutor_id,
        t.nome AS tutor_nome,
        t.telefone AS tutor_telefone
      FROM agendamentos a
      INNER JOIN pets p ON p.id = a.pet_id
      INNER JOIN tutores t ON t.id = p.tutor_id
      ORDER BY a.data_hora DESC`
    );

    return NextResponse.json({
      sucesso: true,
      agendamentos,
    });
  } catch (error) {
    return respostaErro(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await exigirAdministrador();

    const body = await request.json();

    const dados = {
      ...body,
      pet_id: Number(body.pet_id),
      data_hora: String(body.data_hora || ""),
      motivo: String(body.motivo || "").trim(),
      observacoes: String(body.observacoes || "").trim(),
      status: body.status || "PENDENTE",
    };

    const validacao = agendamentoSchema.safeParse(dados);

    if (!validacao.success) {
      return NextResponse.json(
        {
          mensagem: validacao.error.issues[0]?.message ||
            "Verifique os dados informados.",
        },
        { status: 400 }
      );
    }

    const dataHora = normalizarDataHora(validacao.data.data_hora);

    const [pets]: any = await pool.execute(
      `SELECT id
       FROM pets
       WHERE id = ? AND ativo = TRUE`,
      [validacao.data.pet_id]
    );

    if (pets.length === 0) {
      return NextResponse.json(
        { mensagem: "O pet selecionado não existe ou está inativo." },
        { status: 400 }
      );
    }

    if (
      validacao.data.status === "PENDENTE" ||
      validacao.data.status === "CONFIRMADO"
    ) {
      const [conflitos]: any = await pool.execute(
        `SELECT id
         FROM agendamentos
         WHERE pet_id = ?
           AND data_hora = ?
           AND status IN ('PENDENTE', 'CONFIRMADO')
         LIMIT 1`,
        [validacao.data.pet_id, dataHora]
      );

      if (conflitos.length > 0) {
        return NextResponse.json(
          {
            mensagem:
              "Este pet já possui um agendamento ativo nesse dia e horário.",
          },
          { status: 409 }
        );
      }
    }

    const [resultado]: any = await pool.execute(
      `INSERT INTO agendamentos
        (pet_id, data_hora, motivo, observacoes, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        validacao.data.pet_id,
        dataHora,
        validacao.data.motivo,
        validacao.data.observacoes || null,
        validacao.data.status || "PENDENTE",
      ]
    );

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Agendamento cadastrado com sucesso!",
        id: resultado.insertId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        {
          mensagem:
            "Este pet já possui um agendamento ativo nesse dia e horário.",
        },
        { status: 409 }
      );
    }

    return respostaErro(error);
  }
}
