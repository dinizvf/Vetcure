
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
  UserRound,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

interface Tutor {
  id: number;
  nome: string;
  cpf: string | null;
  telefone: string;
  email: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
}

function ConteudoDetalhesTutorPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarTutor() {
      try {
        const resposta = await fetch(`/api/tutores/${id}`, {
          cache: "no-store",
        });

        if (resposta.status === 401) {
          window.location.href = "/login";
          return;
        }

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.mensagem ||
            dados.erro ||
            "Não foi possível carregar o tutor."
          );
        }

        setTutor(dados.tutor || dados);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os dados do tutor."
        );
      } finally {
        setCarregando(false);
      }
    }

    if (id) carregarTutor();
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
        <p className="mb-1 text-sm font-medium text-slate-500">
          {titulo}
        </p>
        <p className="break-words font-semibold text-slate-800">
          {valor || "Não informado"}
        </p>
      </div>
    );
  }

  const endereco = tutor
    ? [
        tutor.logradouro,
        tutor.numero,
        tutor.complemento,
        tutor.bairro,
        tutor.cidade,
        tutor.estado,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col bg-blue-900 p-6 text-white md:flex">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">Sistema</h1>
          <p className="mt-1 text-sm text-blue-200">
            Gestão Veterinária
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/tutores"
            className="flex items-center gap-3 rounded-xl bg-blue-800 px-4 py-3 font-medium text-white"
          >
            <Users size={20} />
            Tutores
          </Link>

          <Link
            href="/dashboard/pets"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800"
          >
            <PawPrint size={20} />
            Pets
          </Link>

          <Link
            href="/dashboard/agendamentos"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800"
          >
            <CalendarDays size={20} />
            Agendamentos
          </Link>
        </nav>

        <button
          onClick={sair}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-red-500/20 hover:text-white"
        >
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/dashboard/tutores"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Voltar para tutores
          </Link>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <UserRound size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                  Detalhes do tutor
                </h2>
                <p className="text-sm text-slate-500">
                  Consulte as informações do responsável cadastrado.
                </p>
              </div>
            </div>

            {tutor && (
              <Link
                href={`/dashboard/tutores/${id}/editar`}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                <Pencil size={18} />
                Editar tutor
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
          ) : tutor ? (
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-7 flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <UserRound size={34} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {tutor.nome}
                    </h3>
                    <p className="mt-1 text-slate-500">
                      Tutor #{tutor.id}
                    </p>
                  </div>
                </div>

                <h4 className="mb-5 text-lg font-bold text-slate-800">
                  Informações pessoais
                </h4>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Campo
                    titulo="Nome completo"
                    valor={tutor.nome}
                  />

                  <Campo
                    titulo="CPF"
                    valor={tutor.cpf || "Não informado"}
                  />

                  <Campo
                    titulo="Telefone"
                    valor={tutor.telefone}
                  />

                  <Campo
                    titulo="E-mail"
                    valor={tutor.email || "Não informado"}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <MapPin size={23} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Endereço
                    </h3>
                    <p className="text-sm text-slate-500">
                      Informações de localização do tutor.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Campo
                    titulo="CEP"
                    valor={tutor.cep || ""}
                  />

                  <Campo
                    titulo="Endereço completo"
                    valor={endereco}
                  />

                  <Campo
                    titulo="Cidade"
                    valor={tutor.cidade || ""}
                  />

                  <Campo
                    titulo="Estado"
                    valor={tutor.estado || ""}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/tutores/${id}/editar`}
                    className="flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                  >
                    <Pencil size={18} />
                    Editar cadastro
                  </Link>

                  <Link
                    href="/dashboard/tutores"
                    className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <ArrowLeft size={18} />
                    Voltar à listagem
                  </Link>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default function DetalhesTutorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
          Carregando página...
        </div>
      }
    >
      <ConteudoDetalhesTutorPage />
    </Suspense>
  );
}
