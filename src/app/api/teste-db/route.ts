
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT 1 AS conexao");

    return NextResponse.json({
      sucesso: true,
      mensagem: "Conexão com o MySQL realizada com sucesso!",
      resultado: rows,
    });
  } catch (error) {
    console.error("Erro na conexão com MySQL:", error);

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: "Não foi possível conectar ao MySQL.",
      },
      { status: 500 }
    );
  }
}
