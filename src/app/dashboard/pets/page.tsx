
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
  RefreshCw,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

interface Pet {
  id: number;
  tutor_id: number;
  nome: string;
  especie: string;
  raca: string | null;
  sexo: string;
  data_nascimento: string | null;
  tutor_nome: string;
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [inativandoId, setInativandoId] = useState<number | null>(null);

  async function carregarPets() {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch("/api/pets", { cache: "no-store" });
      const dados = await resposta.json();

      if (!resposta.ok) {
        if (resposta.status === 401) {
          window.location.href = "/login";
          return;
        }

        throw new Error(dados.mensagem || "Erro ao carregar pets.");
      }

      setPets(dados.pets || []);
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao carregar pets."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function inativarPet(id: number, nome: string) {
    if (!window.confirm(`Deseja realmente inativar o pet "${nome}"?`)) {
      return;
    }

    setInativandoId(id);
    setMensagem("");
    setErro("");

    try {
      const resposta = await fetch(`/api/pets/${id}`, {
        method: "DELETE",
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Não foi possível inativar o pet.");
      }

      setPets((atuais) => atuais.filter((pet) => pet.id !== id));
      setMensagem(dados.mensagem);
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao inativar pet."
      );
    } finally {
      setInativandoId(null);
    }
  }

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  useEffect(() => {
    carregarPets();
  }, []);

  const petsFiltrados = pets.filter((pet) => {
    const termo = pesquisa.toLowerCase();

    return (
      pet.nome.toLowerCase().includes(termo) ||
      pet.especie.toLowerCase().includes(termo) ||
      (pet.raca || "").toLowerCase().includes(termo) ||
      pet.tutor_nome.toLowerCase().includes(termo)
    );
  });

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

        <div className="mt-auto border-t border-blue-800 pt-5 text-xs text-blue-300">
          Sistema de Gestão Veterinária
          <p className="mt-1">Versão 1.0</p>

          <button
            onClick={sair}
            className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-red-500/20 hover:text-white"
          >
            <LogOut size={19} />
            Sair
          </button>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-6 md:p-10">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">
              GERENCIAMENTO
            </p>
            <h2 className="text-3xl font-bold text-slate-800">Pets</h2>
            <p className="mt-2 text-slate-500">
              Consulte e gerencie os animais cadastrados na clínica.
            </p>
          </div>

          <button
            onClick={sair}
            className="flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-600 hover:bg-slate-200"
          >
            <LogOut size={19} />
            Sair
          </button>
        </header>

        <div className="mb-8 flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 p-7 text-white sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-bold">Gestão de pets</h3>
            <p className="mt-2 text-sm text-blue-100">
              Organize os animais e seus respectivos tutores.
            </p>
          </div>

          <Link
            href="/dashboard/pets/novo"
            className="flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-50"
          >
            <Plus size={19} />
            Novo pet
          </Link>
        </div>

        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Pesquisar por pet, espécie ou tutor..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              <strong className="text-slate-800">{pets.length}</strong>{" "}
              {pets.length === 1 ? "pet cadastrado" : "pets cadastrados"}
            </p>

            <button
              onClick={carregarPets}
              disabled={carregando}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={carregando ? "animate-spin" : ""}
              />
              Atualizar
            </button>
          </div>
        </div>

        {mensagem && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm text-green-700">
            {mensagem}
          </div>
        )}

        {erro && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h3 className="text-lg font-bold text-slate-800">
              Pets cadastrados
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Relação dos animais registrados.
            </p>
          </div>

          {carregando ? (
            <div className="py-16 text-center text-slate-500">
              <RefreshCw
                size={28}
                className="mx-auto animate-spin text-blue-700"
              />
              <p className="mt-3 text-sm">Carregando pets...</p>
            </div>
          ) : petsFiltrados.length === 0 ? (
            <div className="py-16 text-center">
              <PawPrint size={34} className="mx-auto text-blue-600" />
              <h4 className="mt-4 font-bold text-slate-800">
                {pesquisa ? "Nenhum pet encontrado" : "Nenhum pet cadastrado"}
              </h4>
              <p className="mt-2 text-sm text-slate-500">
                {pesquisa
                  ? "Tente outro termo de pesquisa."
                  : "Cadastre o primeiro animal da clínica."}
              </p>

              {!pesquisa && (
                <Link
                  href="/dashboard/pets/novo"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900"
                >
                  <Plus size={18} />
                  Cadastrar pet
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {petsFiltrados.map((pet) => (
                <div
                  key={pet.id}
                  className="flex flex-col justify-between gap-4 px-6 py-5 hover:bg-blue-50 sm:flex-row sm:items-center"
                >
                  <Link
                    href={`/dashboard/pets/${pet.id}`}
                    className="flex min-w-0 flex-1 items-center gap-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <PawPrint size={23} />
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate font-bold text-slate-800">
                        {pet.nome}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500">
                        {pet.especie}
                        {pet.raca ? ` • ${pet.raca}` : ""}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 text-sm text-slate-500 sm:min-w-52">
                    <UserRound size={16} className="text-blue-600" />
                    <span>{pet.tutor_nome}</span>
                  </div>

                  <div className="flex items-center gap-2 sm:ml-4">
                    <Link
                      href={`/dashboard/pets/${pet.id}/editar`}
                      className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      <Pencil size={16} />
                      Editar
                    </Link>

                    <button
                      onClick={() => inativarPet(pet.id, pet.nome)}
                      disabled={inativandoId === pet.id}
                      className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {inativandoId === pet.id ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Inativar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
