
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
  Save,
} from "lucide-react";

interface Pet {
  id: number;
  nome: string;
  especie: string;
  tutor_nome?: string;
}

interface Agendamento {
  id: number;
  pet_id: number;
  data_hora: string;
  motivo: string;
  observacoes: string | null;
  status: string;
  pet_nome: string;
  pet_especie: string;
  pet_ativo: number | boolean;
}

function ConteudoEditarAgendamentoPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [pets, setPets] = useState<Pet[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [formulario, setFormulario] = useState({
    pet_id: "",
    data_hora: "",
    motivo: "",
    observacoes: "",
    status: "PENDENTE",
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        const [respostaAgendamento, respostaPets] = await Promise.all([
          fetch(`/api/agendamentos/${id}`, {
            cache: "no-store",
          }),
          fetch("/api/pets", {
            cache: "no-store",
          }),
        ]);

        if (
          respostaAgendamento.status === 401 ||
          respostaPets.status === 401
        ) {
          window.location.href = "/login";
          return;
        }

        const dadosAgendamento = await respostaAgendamento.json();
        const dadosPets = await respostaPets.json();

        if (!respostaAgendamento.ok) {
          throw new Error(
            dadosAgendamento.mensagem ||
              "Não foi possível carregar o agendamento."
          );
        }

        if (!respostaPets.ok) {
          throw new Error(
            dadosPets.mensagem || "Não foi possível carregar os pets."
          );
        }

        const agendamento: Agendamento =
          dadosAgendamento.agendamento || dadosAgendamento;

        const listaPets: Pet[] = dadosPets.pets || [];

        // Mantém o pet atual disponível na seleção,
        // mesmo que tenha sido inativado posteriormente.
        const petAtualExiste = listaPets.some(
          (pet) => Number(pet.id) === Number(agendamento.pet_id)
        );

        if (!petAtualExiste) {
          listaPets.push({
            id: agendamento.pet_id,
            nome: `${agendamento.pet_nome} (pet inativo)`,
            especie: agendamento.pet_especie,
          });
        }

        setPets(listaPets);

        setFormulario({
          pet_id: String(agendamento.pet_id),
          data_hora: agendamento.data_hora || "",
          motivo: agendamento.motivo || "",
          observacoes: agendamento.observacoes || "",
          status: agendamento.status || "PENDENTE",
        });
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar as informações."
        );
      } finally {
        setCarregando(false);
      }
    }

    if (id) carregarDados();
  }, [id]);

  function atualizarCampo(
    campo: keyof typeof formulario,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function salvarAlteracoes(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setErro("");
    setSucesso("");

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
      const resposta = await fetch(`/api/agendamentos/${id}`, {
        method: "PUT",
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
          dados.mensagem ||
            "Não foi possível atualizar o agendamento."
        );
      }

      setSucesso("Agendamento atualizado com sucesso!");

      setTimeout(() => {
        router.push(`/dashboard/agendamentos/${id}`);
        router.refresh();
      }, 1000);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar o agendamento."
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
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800"
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
            className="flex items-center gap-3 rounded-xl bg-blue-800 px-4 py-3 font-medium"
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
            href={`/dashboard/agendamentos/${id}`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Voltar para detalhes
          </Link>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <CalendarDays size={25} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                Editar agendamento
              </h2>
              <p className="text-sm text-slate-500">
                Atualize as informações do atendimento.
              </p>
            </div>
          </div>

          {carregando ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Carregando informações...
            </div>
          ) : (
            <form
              onSubmit={salvarAlteracoes}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            >
              <div className="mb-7 border-b border-slate-100 pb-5">
                <h3 className="text-lg font-bold text-slate-800">
                  Informações do atendimento
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Altere os dados necessários e salve as modificações.
                </p>
              </div>

              {erro && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {erro}
                </div>
              )}

              {sucesso && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  {sucesso}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className={classeLabel}>Pet *</label>

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
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={classeLabel}>
                      Data e horário *
                    </label>
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
                  <label className={classeLabel}>
                    Motivo do atendimento *
                  </label>
                  <input
                    type="text"
                    value={formulario.motivo}
                    onChange={(e) =>
                      atualizarCampo("motivo", e.target.value)
                    }
                    required
                    minLength={3}
                    maxLength={240}
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
                  href={`/dashboard/agendamentos/${id}`}
                  className="rounded-xl border border-slate-300 px-6 py-3 text-center font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  disabled={salvando}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={18} />
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function EditarAgendamentoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
          Carregando página...
        </div>
      }
    >
      <ConteudoEditarAgendamentoPage />
    </Suspense>
  );
}
