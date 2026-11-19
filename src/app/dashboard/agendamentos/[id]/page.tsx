
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  CalendarDays,
  LogOut,
  ArrowLeft,
  Pencil,
  Clock,
  UserRound,
  Phone,
  ClipboardList,
} from "lucide-react";

interface Agendamento {
  id: number;
  pet_id: number;
  data_hora: string;
  motivo: string;
  observacoes: string | null;
  status: string;
  pet_nome: string;
  pet_especie: string;
  pet_raca: string | null;
  tutor_id: number;
  tutor_nome: string;
  tutor_telefone: string;
  tutor_email: string | null;
}

function formatarData(data: string) {
  if (!data) return "Não informada";

  const [dia, horario] = data.split("T");
  const [ano, mes, numeroDia] = dia.split("-");

  return `${numeroDia}/${mes}/${ano} às ${horario}`;
}

function nomeStatus(status: string) {
  const nomes: Record<string, string> = {
    PENDENTE: "Pendente",
    CONFIRMADO: "Confirmado",
    CONCLUIDO: "Concluído",
    CANCELADO: "Cancelado",
  };

  return nomes[status] || status;
}

function corStatus(status: string) {
  const cores: Record<string, string> = {
    PENDENTE: "bg-amber-100 text-amber-700",
    CONFIRMADO: "bg-blue-100 text-blue-700",
    CONCLUIDO: "bg-green-100 text-green-700",
    CANCELADO: "bg-red-100 text-red-700",
  };

  return cores[status] || "bg-slate-100 text-slate-700";
}

function ConteudoDetalhesAgendamentoPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAgendamento() {
      try {
        const resposta = await fetch(`/api/agendamentos/${id}`, {
          cache: "no-store",
        });

        if (resposta.status === 401) {
          window.location.href = "/login";
          return;
        }

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.mensagem || "Não foi possível carregar o agendamento."
          );
        }

        setAgendamento(dados.agendamento || dados);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os dados."
        );
      } finally {
        setCarregando(false);
      }
    }

    if (id) carregarAgendamento();
  }, [id]);

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  function Campo({
    titulo,
    valor,
  }: {
    titulo: string;
    valor: string;
  }) {
    return (
      <div>
        <p className="mb-1 text-sm font-medium text-slate-500">{titulo}</p>
        <p className="break-words font-semibold text-slate-800">
          {valor || "Não informado"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col bg-blue-900 p-6 text-white md:flex">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">Sistema</h1>
          <p className="mt-1 text-sm text-blue-200">Gestão Veterinária</p>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/dashboard/tutores" className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800">
            <Users size={20} /> Tutores
          </Link>
          <Link href="/dashboard/pets" className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800">
            <PawPrint size={20} /> Pets
          </Link>
          <Link href="/dashboard/agendamentos" className="flex items-center gap-3 rounded-xl bg-blue-800 px-4 py-3 font-medium">
            <CalendarDays size={20} /> Agendamentos
          </Link>
        </nav>

        <button onClick={sair} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-red-500/20 hover:text-white">
          <LogOut size={20} /> Sair
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/dashboard/agendamentos"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft size={18} /> Voltar para agendamentos
          </Link>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <CalendarDays size={25} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                  Detalhes do agendamento
                </h2>
                <p className="text-sm text-slate-500">
                  Consulte as informações do atendimento.
                </p>
              </div>
            </div>

            {agendamento && (
              <Link
                href={`/dashboard/agendamentos/${id}/editar`}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                <Pencil size={18} /> Editar agendamento
              </Link>
            )}
          </div>

          {carregando ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Carregando informações...
            </div>
          ) : erro ? (
            <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
              <p className="text-red-600">{erro}</p>
            </div>
          ) : agendamento ? (
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Agendamento #{agendamento.id}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Informações do atendimento registrado.
                    </p>
                  </div>

                  <span className={`rounded-full px-4 py-2 text-sm font-bold ${corStatus(agendamento.status)}`}>
                    {nomeStatus(agendamento.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Campo
                    titulo="Data e horário"
                    valor={formatarData(agendamento.data_hora)}
                  />
                  <Campo
                    titulo="Motivo do atendimento"
                    valor={agendamento.motivo}
                  />
                </div>

                <div className="mt-7 border-t border-slate-100 pt-6">
                  <p className="mb-2 text-sm font-medium text-slate-500">
                    Observações
                  </p>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="whitespace-pre-wrap text-slate-700">
                      {agendamento.observacoes || "Nenhuma observação cadastrada."}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <PawPrint size={23} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Pet atendido</h3>
                    <p className="text-sm text-slate-500">Animal vinculado ao agendamento.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Campo titulo="Nome do pet" valor={agendamento.pet_nome} />
                  <Campo titulo="Espécie" valor={agendamento.pet_especie} />
                  <Campo titulo="Raça" valor={agendamento.pet_raca || "Não informada"} />
                  <Campo titulo="Código do pet" valor={`#${agendamento.pet_id}`} />
                </div>

                <Link
                  href={`/dashboard/pets/${agendamento.pet_id}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  <PawPrint size={18} /> Ver cadastro do pet
                </Link>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <UserRound size={23} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Tutor responsável</h3>
                    <p className="text-sm text-slate-500">Responsável pelo animal.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Campo titulo="Nome do tutor" valor={agendamento.tutor_nome} />
                  <Campo titulo="Telefone" valor={agendamento.tutor_telefone} />
                  <Campo titulo="E-mail" valor={agendamento.tutor_email || "Não informado"} />
                  <Campo titulo="Código do tutor" valor={`#${agendamento.tutor_id}`} />
                </div>

                <Link
                  href={`/dashboard/tutores/${agendamento.tutor_id}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  <UserRound size={18} /> Ver cadastro do tutor
                </Link>
              </section>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default function DetalhesAgendamentoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
          Carregando página...
        </div>
      }
    >
      <ConteudoDetalhesAgendamentoPage />
    </Suspense>
  );
}
