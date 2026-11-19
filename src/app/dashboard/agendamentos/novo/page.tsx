
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  CalendarDays,
  LogOut,
  ArrowLeft,
  Save,
  Stethoscope,
} from "lucide-react";

interface Pet {
  id: number;
  nome: string;
  especie: string;
  tutor_id: number;
  tutor_nome: string;
}

export default function NovoAgendamentoPage() {
  const router = useRouter();

  const [pets, setPets] = useState<Pet[]>([]);
  const [carregandoPets, setCarregandoPets] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [formulario, setFormulario] = useState({
    pet_id: "",
    data_hora: "",
    motivo: "",
    observacoes: "",
    status: "PENDENTE",
  });

  useEffect(() => {
    async function carregarPets() {
      try {
        const resposta = await fetch("/api/pets", {
          cache: "no-store",
        });

        if (resposta.status === 401) {
          window.location.href = "/login";
          return;
        }

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.mensagem || "Não foi possível carregar os pets."
          );
        }

        setPets(dados.pets || []);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar os pets."
        );
      } finally {
        setCarregandoPets(false);
      }
    }

    carregarPets();
  }, []);

  const petSelecionado = pets.find(
    (pet) => String(pet.id) === formulario.pet_id
  );

  function atualizarCampo(
    campo: keyof typeof formulario,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function salvarAgendamento(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setErro("");

    if (
      !formulario.pet_id ||
      !formulario.data_hora ||
      !formulario.motivo.trim()
    ) {
      setErro("Preencha o pet, a data, o horário e o motivo.");
      return;
    }

    setSalvando(true);

    try {
      const resposta = await fetch("/api/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formulario,
          pet_id: Number(formulario.pet_id),
          motivo: formulario.motivo.trim(),
          observacoes: formulario.observacoes.trim(),
        }),
      });

      if (resposta.status === 401) {
        window.location.href = "/login";
        return;
      }

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Não foi possível cadastrar o agendamento."
        );
      }

      router.push("/dashboard/agendamentos");
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar o agendamento."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const classeCampo =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const classeLabel =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="flex min-h-screen bg-slate-100">
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
            <ArrowLeft size={18} />
            Voltar para agendamentos
          </Link>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <CalendarDays size={25} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                Novo agendamento
              </h2>
              <p className="text-sm text-slate-500">
                Cadastre um novo atendimento para um pet.
              </p>
            </div>
          </div>

          <form
            onSubmit={salvarAgendamento}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >
            <div className="mb-7 border-b border-slate-100 pb-5">
              <h3 className="text-lg font-bold text-slate-800">
                Informações do atendimento
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Preencha os dados para registrar o horário na agenda.
              </p>
            </div>

            {erro && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {erro}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className={classeLabel}>Pet *</label>

                {carregandoPets ? (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                    Carregando pets...
                  </p>
                ) : (
                  <select
                    value={formulario.pet_id}
                    onChange={(e) =>
                      atualizarCampo("pet_id", e.target.value)
                    }
                    required
                    className={classeCampo}
                  >
                    <option value="">Selecione um pet</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.nome} — {pet.especie}
                      </option>
                    ))}
                  </select>
                )}

                {!carregandoPets && pets.length === 0 && (
                  <p className="mt-2 text-sm text-amber-700">
                    Nenhum pet ativo cadastrado. Cadastre um pet antes de criar um agendamento.
                  </p>
                )}
              </div>

              {petSelecionado && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-800">
                    Tutor responsável
                  </p>
                  <p className="mt-1 text-sm text-blue-700">
                    {petSelecionado.tutor_nome || "Não informado"}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className={classeLabel}>Data e horário *</label>
                  <input
                    type="datetime-local"
                    value={formulario.data_hora}
                    onChange={(e) =>
                      atualizarCampo("data_hora", e.target.value)
                    }
                    required
                    className={classeCampo}
                  />
                </div>

                <div>
                  <label className={classeLabel}>Situação</label>
                  <select
                    value={formulario.status}
                    onChange={(e) =>
                      atualizarCampo("status", e.target.value)
                    }
                    className={classeCampo}
                  >
                    <option value="PENDENTE">Pendente</option>
                    <option value="CONFIRMADO">Confirmado</option>
                    <option value="CONCLUIDO">Concluído</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={classeLabel}>Motivo do atendimento *</label>
                <input
                  type="text"
                  value={formulario.motivo}
                  onChange={(e) =>
                    atualizarCampo("motivo", e.target.value)
                  }
                  required
                  minLength={3}
                  maxLength={240}
                  placeholder="Ex.: Consulta de rotina, vacinação..."
                  className={classeCampo}
                />
              </div>

              <div>
                <label className={classeLabel}>Observações</label>
                <textarea
                  value={formulario.observacoes}
                  onChange={(e) =>
                    atualizarCampo("observacoes", e.target.value)
                  }
                  rows={4}
                  placeholder="Informações adicionais sobre o atendimento..."
                  className={`${classeCampo} resize-y`}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
              <Link
                href="/dashboard/agendamentos"
                className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={salvando || carregandoPets || pets.length === 0}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {salvando ? "Salvando..." : "Cadastrar agendamento"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
