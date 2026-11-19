
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { exigirAdministrador } from "@/lib/auth";
import { agendamentoSchema } from "@/lib/validations";

function obterId(request: NextRequest) {
  const partes = request.nextUrl.pathname.split("/");
  return Number(partes[partes.length - 1]);
}

function tratarErro(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "ACESSO_NAO_AUTORIZADO"
  ) {
    return NextResponse.json(
      { mensagem: "Acesso não autorizado." },
      { status: 401 }
    );
  }

  console.error(error);

  return NextResponse.json(
    { mensagem: "Erro interno do servidor." },
    { status: 500 }
  );
}

// GET - Consultar um agendamento
export async function GET(request: NextRequest) {
  try {
    await exigirAdministrador();

    const id = obterId(request);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { mensagem: "ID inválido." },
        { status: 400 }
      );
    }

    const [resultados]: any = await pool.execute(
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
      WHERE a.id = ?
      LIMIT 1`,
      [id]
    );

    if (resultados.length === 0) {
      return NextResponse.json(
        { mensagem: "Agendamento não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      agendamento: resultados[0],
    });
  } catch (error) {
    return tratarErro(error);
  }
}

// PUT - Atualizar um agendamento
export async function PUT(request: NextRequest) {
  try {
    await exigirAdministrador();

    const id = obterId(request);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { mensagem: "ID inválido." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const dados = {
      pet_id: Number(body.pet_id),
      data_hora: String(body.data_hora || ""),
      motivo: String(body.motivo || "").trim(),
      observacoes: String(body.observacoes || "").trim(),
      status: body.status ?? "PENDENTE",
    };

    const validacao = agendamentoSchema.safeParse(dados);

    if (!validacao.success) {
      return NextResponse.json(
        {
          mensagem: "Verifique os dados informados.",
          erros: validacao.error.flatten(),
        },
        { status: 400 }
      );
    }

    const statusFinal =
      validacao.data.status ?? "PENDENTE";

    const dataHora = validacao.data.data_hora.replace("T", " ");

    const dataHoraFinal =
      dataHora.length === 16 ? `${dataHora}:00` : dataHora;

    // Verifica se o agendamento existe
    const [agendamentoAtual]: any = await pool.execute(
      "SELECT id, pet_id FROM agendamentos WHERE id = ? LIMIT 1",
      [id]
    );

    if (agendamentoAtual.length === 0) {
      return NextResponse.json(
        { mensagem: "Agendamento não encontrado." },
        { status: 404 }
      );
    }

    // Verifica se o pet existe e está ativo.
    // Também permite manter o pet atual caso ele tenha sido inativado.
    const [pets]: any = await pool.execute(
      `SELECT id
       FROM pets
       WHERE id = ?
       AND (ativo = TRUE OR id = ?)
       LIMIT 1`,
      [validacao.data.pet_id, agendamentoAtual[0].pet_id]
    );

    if (pets.length === 0) {
      return NextResponse.json(
        { mensagem: "Pet não encontrado ou inativo." },
        { status: 404 }
      );
    }

    // Verifica se já existe outro agendamento ativo
    // para o mesmo pet na mesma data e horário.
    if (
      statusFinal === "PENDENTE" ||
      statusFinal === "CONFIRMADO"
    ) {
      const [duplicados]: any = await pool.execute(
        `SELECT id
         FROM agendamentos
         WHERE pet_id = ?
         AND data_hora = ?
         AND status IN ('PENDENTE', 'CONFIRMADO')
         AND id <> ?
         LIMIT 1`,
        [validacao.data.pet_id, dataHoraFinal, id]
      );

      if (duplicados.length > 0) {
        return NextResponse.json(
          {
            mensagem:
              "Este pet já possui um agendamento ativo nesse dia e horário.",
          },
          { status: 409 }
        );
      }
    }

    // Atualiza o agendamento
    await pool.execute(
      `UPDATE agendamentos
       SET
        pet_id = ?,
        data_hora = ?,
        motivo = ?,
        observacoes = ?,
        status = ?
       WHERE id = ?`,
      [
        validacao.data.pet_id,
        dataHoraFinal,
        validacao.data.motivo,
        validacao.data.observacoes ?? "",
        statusFinal,
        id,
      ]
    );

    return NextResponse.json({
      sucesso: true,
      mensagem: "Agendamento atualizado com sucesso.",
    });
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

    return tratarErro(error);
  }
}

// DELETE - Excluir um agendamento
export async function DELETE(request: NextRequest) {
  try {
    await exigirAdministrador();

    const id = obterId(request);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { mensagem: "ID inválido." },
        { status: 400 }
      );
    }

    const [resultado]: any = await pool.execute(
      "DELETE FROM agendamentos WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return NextResponse.json(
        { mensagem: "Agendamento não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "Agendamento excluído com sucesso.",
    });
  } catch (error) {
    return tratarErro(error);
  }
}
