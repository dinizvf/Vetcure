
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  PawPrint,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  UserRound,
  Pencil,
  Trash2,
} from "lucide-react";

interface Tutor {
  id: number;
  nome: string;
  telefone: string;
  email: string | null;
  cidade: string | null;
}

export default function TutoresPage() {
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  async function carregarTutores() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/tutores", {
        cache: "no-store",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        if (resposta.status === 401) {
          window.location.href = "/login";
          return;
        }

        throw new Error(
          dados.mensagem || "Não foi possível carregar os tutores."
        );
      }

      setTutores(dados.tutores || []);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao consultar os tutores."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function excluirTutor(id: number, nome: string) {
    const confirmar = window.confirm(
      `Tem certeza de que deseja excluir o tutor "${nome}"?`
    );

    if (!confirmar) return;

    setExcluindoId(id);
    setMensagem("");
    setErro("");

    try {
      const resposta = await fetch(`/api/tutores/${id}`, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Não foi possível excluir o tutor."
        );
      }

      setTutores((atuais) =>
        atuais.filter((tutor) => tutor.id !== id)
      );

      setMensagem(dados.mensagem || "Tutor excluído com sucesso!");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao excluir o tutor."
      );
    } finally {
      setExcluindoId(null);
    }
  }

  useEffect(() => {
    carregarTutores();
  }, []);

  const tutoresFiltrados = tutores.filter((tutor) => {
    const termo = pesquisa.toLowerCase();

    return (
      tutor.nome.toLowerCase().includes(termo) ||
      tutor.telefone.toLowerCase().includes(termo) ||
      (tutor.email || "").toLowerCase().includes(termo)
    );
  });

  return (
    <main className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 flex-col bg-blue-900 p-6 text-white md:flex">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Stethoscope size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">Sistema</h1>
              <p className="text-xs text-blue-200">
                Gestão Veterinária
              </p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/tutores"
            className="flex items-center gap-3 rounded-xl bg-blue-800 px-4 py-3 font-medium"
          >
            <Users size={20} />
            <span>Tutores</span>
          </Link>

          <Link
            href="/dashboard/pets"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800"
          >
            <PawPrint size={20} />
            <span>Pets</span>
          </Link>

          <Link
            href="/dashboard/agendamentos"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800"
          >
            <CalendarDays size={20} />
            <span>Agendamentos</span>
          </Link>
        </nav>

        <div className="mt-auto border-t border-blue-800 pt-5">
          <p className="text-xs text-blue-300">
            Sistema de Gestão Veterinária
          </p>
          <p className="mt-1 text-xs text-blue-300">
            Versão 1.0
          </p>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-6 md:p-10">
        <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">
              GERENCIAMENTO
            </p>

            <h2 className="text-3xl font-bold text-slate-800">
              Tutores
            </h2>

            <p className="mt-2 text-slate-500">
              Consulte e gerencie os responsáveis pelos animais.
            </p>
          </div>

          <Link
            href="/api/auth/logout"
            className="flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-600 transition hover:bg-slate-200"
          >
            <LogOut size={19} />
            Sair
          </Link>
        </header>

        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 p-7 text-white shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-bold">
                Gestão de tutores
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Mantenha organizadas as informações dos responsáveis
                pelos animais atendidos pela clínica.
              </p>
            </div>

            <Link
              href="/dashboard/tutores/novo"
              className="flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50"
            >
              <Plus size={19} />
              Novo tutor
            </Link>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="relative w-full md:max-w-md">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Pesquisar por nome, telefone ou e-mail..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-800">
                  {tutores.length}
                </span>{" "}
                {tutores.length === 1
                  ? "tutor cadastrado"
                  : "tutores cadastrados"}
              </p>

              <button
                type="button"
                onClick={carregarTutores}
                disabled={carregando}
                title="Atualizar listagem"
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={carregando ? "animate-spin" : ""}
                />
                Atualizar
              </button>
            </div>
          </div>
        </div>

        {mensagem && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-medium text-green-700">
            {mensagem}
          </div>
        )}

        {erro && !carregando && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
            {erro}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h3 className="text-lg font-bold text-slate-800">
              Tutores cadastrados
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Relação dos responsáveis registrados no sistema.
            </p>
          </div>

          {carregando ? (
            <div className="flex flex-col items-center justify-center px-6 py-16">
              <RefreshCw
                size={30}
                className="animate-spin text-blue-700"
              />

              <p className="mt-4 text-sm text-slate-500">
                Carregando tutores...
              </p>
            </div>
          ) : erro && tutores.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-red-600">{erro}</p>

              <button
                onClick={carregarTutores}
                className="mt-4 rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900"
              >
                Tentar novamente
              </button>
            </div>
          ) : tutoresFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Users size={30} />
              </div>

              <h4 className="mt-5 text-lg font-bold text-slate-800">
                {pesquisa
                  ? "Nenhum tutor encontrado"
                  : "Nenhum tutor cadastrado"}
              </h4>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                {pesquisa
                  ? "Tente pesquisar utilizando outro nome, telefone ou e-mail."
                  : "Comece cadastrando o primeiro tutor da clínica."}
              </p>

              {!pesquisa && (
                <Link
                  href="/dashboard/tutores/novo"
                  className="mt-6 flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
                >
                  <Plus size={18} />
                  Cadastrar primeiro tutor
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {tutoresFiltrados.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex flex-col justify-between gap-4 px-6 py-5 transition hover:bg-blue-50 sm:flex-row sm:items-center"
                >
                  <a
                    href={`/dashboard/tutores/${Number(tutor.id)}`}
                    className="flex min-w-0 flex-1 items-center gap-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <UserRound size={23} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-bold text-slate-800">
                        {tutor.nome}
                      </h4>

                      <p className="mt-1 text-xs text-slate-400">
                        Código: #{tutor.id}
                      </p>
                    </div>
                  </a>

                  <div className="flex flex-col gap-2 text-sm text-slate-500 sm:min-w-64">
                    <p className="flex items-center gap-2">
                      <Phone size={15} className="shrink-0 text-blue-600" />
                      {tutor.telefone}
                    </p>

                    {tutor.email && (
                      <p className="flex items-center gap-2 break-all">
                        <Mail size={15} className="shrink-0 text-blue-600" />
                        {tutor.email}
                      </p>
                    )}

                    {tutor.cidade && (
                      <p className="flex items-center gap-2">
                        <MapPin size={15} className="shrink-0 text-blue-600" />
                        {tutor.cidade}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:ml-4">
                    <Link
                      href={`/dashboard/tutores/${tutor.id}/editar`}
                      className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      <Pencil size={16} />
                      Editar
                    </Link>

                    <button
                      type="button"
                      onClick={() => excluirTutor(tutor.id, tutor.nome)}
                      disabled={excluindoId === tutor.id}
                      className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {excluindoId === tutor.id ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!carregando && !erro && tutoresFiltrados.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-xs text-slate-500">
                Exibindo {tutoresFiltrados.length} de {tutores.length} tutores.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
