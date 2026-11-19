
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
  User,
} from "lucide-react";

interface Pet {
  id: number;
  tutor_id: number;
  tutor_nome: string;
  nome: string;
  especie: string;
  raca: string | null;
  sexo: string;
  data_nascimento: string | null;
  observacoes: string | null;
}

function ConteudoDetalhesPetPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [pet, setPet] = useState<Pet | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPet() {
      try {
        const resposta = await fetch(`/api/pets/${id}`);

        if (resposta.status === 401) {
          window.location.href = "/login";
          return;
        }

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.mensagem ||
            dados.erro ||
            "Não foi possível carregar o pet."
          );
        }

        setPet(dados.pet || dados);
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

    if (id) carregarPet();
  }, [id]);

  function formatarData(data: string | null) {
    if (!data) return "Não informado";

    const partes = data.split("-");

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return data;
  }

  function formatarSexo(sexo: string) {
    if (sexo === "MACHO") return "Macho";
    if (sexo === "FEMEA") return "Fêmea";
    return "Não informado";
  }

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
        <p className="font-semibold text-slate-800">
          {valor}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col bg-blue-900 p-6 text-white md:flex">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">VetCare</h1>
          <p className="mt-1 text-sm text-blue-200">
            Sistema veterinário
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800 hover:text-white"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/tutores"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800 hover:text-white"
          >
            <Users size={20} />
            Tutores
          </Link>

          <Link
            href="/dashboard/pets"
            className="flex items-center gap-3 rounded-xl bg-blue-800 px-4 py-3 font-medium text-white"
          >
            <PawPrint size={20} />
            Pets
          </Link>

          <Link
            href="/dashboard/agendamentos"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800 hover:text-white"
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
            href="/dashboard/pets"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Voltar para pets
          </Link>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <PawPrint size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                  Detalhes do pet
                </h2>
                <p className="text-sm text-slate-500">
                  Consulte as informações cadastradas.
                </p>
              </div>
            </div>

            {pet && (
              <Link
                href={`/dashboard/pets/${id}/editar`}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                <Pencil size={18} />
                Editar pet
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
          ) : pet ? (
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-7 flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <PawPrint size={34} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {pet.nome}
                    </h3>
                    <p className="mt-1 text-slate-500">
                      {pet.especie}
                      {pet.raca ? ` • ${pet.raca}` : ""}
                    </p>
                  </div>
                </div>

                <h4 className="mb-5 text-lg font-bold text-slate-800">
                  Informações gerais
                </h4>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Campo titulo="Espécie" valor={pet.especie} />

                  <Campo
                    titulo="Raça"
                    valor={pet.raca || "Não informada"}
                  />

                  <Campo
                    titulo="Sexo"
                    valor={formatarSexo(pet.sexo)}
                  />

                  <Campo
                    titulo="Data de nascimento"
                    valor={formatarData(pet.data_nascimento)}
                  />
                </div>

                <div className="mt-7 border-t border-slate-100 pt-6">
                  <p className="mb-2 text-sm font-medium text-slate-500">
                    Observações
                  </p>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="whitespace-pre-wrap text-slate-700">
                      {pet.observacoes ||
                        "Nenhuma observação cadastrada."}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <User size={23} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Informações do tutor
                    </h3>
                    <p className="text-sm text-slate-500">
                      Responsável pelo animal cadastrado.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Campo
                    titulo="Nome do tutor"
                    valor={pet.tutor_nome || "Não informado"}
                  />

                  <Campo
                    titulo="Identificação do tutor"
                    valor={`#${pet.tutor_id}`}
                  />
                </div>

                <Link
                  href={`/dashboard/tutores/${pet.tutor_id}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  <User size={18} />
                  Ver cadastro do tutor
                </Link>
              </section>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default function DetalhesPetPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
          Carregando página...
        </div>
      }
    >
      <ConteudoDetalhesPetPage />
    </Suspense>
  );
}
