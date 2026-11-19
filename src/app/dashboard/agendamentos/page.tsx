
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  CalendarDays,
  LogOut,
  Stethoscope,
  Plus,
  Search,
  RefreshCw,
  Clock,
  UserRound,
  Eye,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";

interface Agendamento {
  id: number;
  pet_id: number;
  data_hora: string;
  motivo: string;
  observacoes: string | null;
  status: "PENDENTE" | "CONFIRMADO" | "CONCLUIDO" | "CANCELADO";
  pet_nome: string;
  pet_especie: string;
  tutor_id: number;
  tutor_nome: string;
  tutor_telefone: string;
}

const situacoes = [
  { valor: "PENDENTE", texto: "Pendente" },
  { valor: "CONFIRMADO", texto: "Confirmado" },
  { valor: "CONCLUIDO", texto: "Concluído" },
  { valor: "CANCELADO", texto: "Cancelado" },
];

function formatarData(data: string) {
  if (!data) return "Não informada";

  const [dia, horario] = data.split("T");
  const [ano, mes, numeroDia] = dia.split("-");

  return `${numeroDia}/${mes}/${ano} às ${horario}`;
}

function corStatus(status: string) {
  switch (status) {
    case "CONFIRMADO":
      return "bg-blue-100 text-blue-700";
    case "CONCLUIDO":
      return "bg-green-100 text-green-700";
    case "CANCELADO":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function nomeStatus(status: string) {
  return situacoes.find((item) => item.valor === status)?.texto || status;
}

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [filtroMes, setFiltroMes] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  async function carregarAgendamentos() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/agendamentos", {
        cache: "no-store",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        if (resposta.status === 401) {
          window.location.href = "/login";
          return;
        }

        throw new Error(
          dados.mensagem || "Não foi possível carregar os agendamentos."
        );
      }

      setAgendamentos(dados.agendamentos || []);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao consultar os agendamentos."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function cancelarAgendamento(agendamento: Agendamento) {
    const confirmar = window.confirm(
      `Deseja cancelar o agendamento de ${agendamento.pet_nome}?`
    );

    if (!confirmar) return;

    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(
        `/api/agendamentos/${agendamento.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pet_id: agendamento.pet_id,
            data_hora: agendamento.data_hora,
            motivo: agendamento.motivo,
            observacoes: agendamento.observacoes || "",
            status: "CANCELADO",
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Não foi possível cancelar o agendamento."
        );
      }

      setMensagem("Agendamento cancelado com sucesso!");
      carregarAgendamentos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cancelar o agendamento."
      );
    }
  }

  async function excluirAgendamento(id: number) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir este agendamento? Essa ação não poderá ser desfeita."
    );

    if (!confirmar) return;

    setExcluindoId(id);
    setErro("");
    setMensagem("");

    try {
      const resposta = await fetch(`/api/agendamentos/${id}`, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Não foi possível excluir o agendamento."
        );
      }

      setAgendamentos((atuais) =>
        atuais.filter((item) => item.id !== id)
      );

      setMensagem("Agendamento excluído com sucesso!");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao excluir o agendamento."
      );
    } finally {
      setExcluindoId(null);
    }
  }

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const agendamentosFiltrados = agendamentos.filter((item) => {
    const termo = pesquisa.toLowerCase();

    const correspondePesquisa =
      item.pet_nome.toLowerCase().includes(termo) ||
      item.tutor_nome.toLowerCase().includes(termo) ||
      item.motivo.toLowerCase().includes(termo);

    const correspondeStatus =
      filtroStatus === "TODOS" || item.status === filtroStatus;

    const correspondeMes =
      !filtroMes || item.data_hora.startsWith(filtroMes);

    return (
      correspondePesquisa &&
      correspondeStatus &&
      correspondeMes
    );
  });

  const pendentes = agendamentos.filter(
    (item) => item.status === "PENDENTE"
  ).length;

  const confirmados = agendamentos.filter(
    (item) => item.status === "CONFIRMADO"
  ).length;

  return (
    <main className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col bg-blue-900 p-6 text-white md:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Stethoscope size={25} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sistema</h1>
            <p className="text-xs text-blue-200">Gestão Veterinária</p>
          </div>
        </div>

        <nav className="space-y-2">
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

        <div className="mt-auto border-t border-blue-800 pt-5">
          <p className="text-xs text-blue-300">Sistema de Gestão Veterinária</p>
          <p className="mt-1 text-xs text-blue-300">Versão 1.0</p>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-6 md:p-10">
        <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">GERENCIAMENTO</p>
            <h2 className="text-3xl font-bold text-slate-800">Agendamentos</h2>
            <p className="mt-2 text-slate-500">
              Organize e acompanhe os atendimentos da clínica.
            </p>
          </div>

          <Link href="/api/auth/logout" className="flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-600 transition hover:bg-slate-200">
            <LogOut size={19} /> Sair
          </Link>
        </header>

        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 p-7 text-white shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-bold">Gestão de agendamentos</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Consulte os horários, acompanhe as situações e mantenha a agenda organizada.
              </p>
            </div>

            <Link href="/dashboard/agendamentos/novo" className="flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50">
              <Plus size={19} /> Novo agendamento
            </Link>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total de agendamentos</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">{agendamentos.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pendentes</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">{pendentes}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Confirmados</p>
            <p className="mt-2 text-3xl font-bold text-blue-700">{confirmados}</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Pesquisar por pet, tutor ou motivo..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-600"
            >
              <option value="TODOS">Todas as situações</option>
              {situacoes.map((item) => (
                <option key={item.valor} value={item.valor}>{item.texto}</option>
              ))}
            </select>

            <input
              type="month"
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-600"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={carregarAgendamentos}
              disabled={carregando}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={17} className={carregando ? "animate-spin" : ""} />
              Atualizar
            </button>
          </div>
        </div>

        {mensagem && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-medium text-green-700">
            {mensagem}
          </div>
        )}

        {erro && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
            {erro}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h3 className="text-lg font-bold text-slate-800">Agenda da clínica</h3>
            <p className="mt-1 text-sm text-slate-500">Agendamentos organizados por data e horário.</p>
          </div>

          {carregando ? (
            <div className="flex flex-col items-center justify-center px-6 py-16">
              <RefreshCw size={30} className="animate-spin text-blue-700" />
              <p className="mt-4 text-sm text-slate-500">Carregando agendamentos...</p>
            </div>
          ) : agendamentosFiltrados.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <CalendarDays size={38} className="mx-auto text-blue-300" />
              <h4 className="mt-4 font-bold text-slate-800">Nenhum agendamento encontrado</h4>
              <p className="mt-2 text-sm text-slate-500">
                Altere os filtros ou cadastre um novo agendamento.
              </p>
              <Link href="/dashboard/agendamentos/novo" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900">
                <Plus size={18} /> Cadastrar agendamento
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {agendamentosFiltrados.map((item) => (
                <div key={item.id} className="flex flex-col justify-between gap-4 px-6 py-5 transition hover:bg-blue-50 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <CalendarDays size={24} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800">{item.pet_nome}</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.pet_especie} • Tutor: {item.tutor_nome}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={15} className="text-blue-600" />
                        {formatarData(item.data_hora)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{item.motivo}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${corStatus(item.status)}`}>
                      {nomeStatus(item.status)}
                    </span>

                    <Link href={`/dashboard/agendamentos/${item.id}`} title="Ver detalhes" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">
                      <Eye size={17} />
                    </Link>

                    <Link href={`/dashboard/agendamentos/${item.id}/editar`} title="Editar" className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-700 hover:bg-blue-100">
                      <Pencil size={17} />
                    </Link>

                    {item.status !== "CANCELADO" && item.status !== "CONCLUIDO" && (
                      <button type="button" onClick={() => cancelarAgendamento(item)} title="Cancelar agendamento" className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-700 hover:bg-amber-100">
                        <XCircle size={17} />
                      </button>
                    )}

                    <button type="button" onClick={() => excluirAgendamento(item.id)} disabled={excluindoId === item.id} title="Excluir" className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50">
                      {excluindoId === item.id ? <RefreshCw size={17} className="animate-spin" /> : <Trash2 size={17} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!carregando && agendamentosFiltrados.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-xs text-slate-500">
                Exibindo {agendamentosFiltrados.length} de {agendamentos.length} agendamentos.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
