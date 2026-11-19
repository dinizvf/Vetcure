
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

function ConteudoEditarTutorPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [formulario, setFormulario] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

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

        const tutor: Tutor = dados.tutor || dados;

        setFormulario({
          nome: tutor.nome || "",
          cpf: tutor.cpf || "",
          telefone: tutor.telefone || "",
          email: tutor.email || "",
          cep: tutor.cep || "",
          logradouro: tutor.logradouro || "",
          numero: tutor.numero || "",
          complemento: tutor.complemento || "",
          bairro: tutor.bairro || "",
          cidade: tutor.cidade || "",
          estado: tutor.estado || "",
        });
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
      !formulario.nome.trim() ||
      !formulario.telefone.trim()
    ) {
      setErro("Preencha o nome e o telefone do tutor.");
      return;
    }

    setSalvando(true);

    try {
      const resposta = await fetch(`/api/tutores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formulario,
          nome: formulario.nome.trim(),
          telefone: formulario.telefone.trim(),
          email: formulario.email.trim(),
          cep: formulario.cep.trim(),
          logradouro: formulario.logradouro.trim(),
          numero: formulario.numero.trim(),
          complemento: formulario.complemento.trim(),
          bairro: formulario.bairro.trim(),
          cidade: formulario.cidade.trim(),
          estado: formulario.estado.trim().toUpperCase(),
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
          dados.erro ||
          "Não foi possível atualizar o tutor."
        );
      }

      setSucesso("Cadastro do tutor atualizado com sucesso!");

      setTimeout(() => {
        router.push(`/dashboard/tutores/${id}`);
        router.refresh();
      }, 1000);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar o cadastro."
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
            href={`/dashboard/tutores/${id}`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Voltar para detalhes
          </Link>

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Users size={25} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                Editar tutor
              </h2>
              <p className="text-sm text-slate-500">
                Atualize as informações do responsável cadastrado.
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
                  Informações do tutor
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Atualize os dados abaixo.
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
                  <label className={classeLabel}>
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    value={formulario.nome}
                    onChange={(e) =>
                      atualizarCampo("nome", e.target.value)
                    }
                    required
                    minLength={2}
                    className={classeCampo}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={classeLabel}>CPF</label>
                    <input
                      type="text"
                      value={formulario.cpf}
                      readOnly
                      className={`${classeCampo} cursor-not-allowed bg-slate-100`}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      O CPF é protegido e não pode ser alterado nesta tela.
                    </p>
                  </div>

                  <div>
                    <label className={classeLabel}>
                      Telefone *
                    </label>
                    <input
                      type="text"
                      value={formulario.telefone}
                      onChange={(e) =>
                        atualizarCampo("telefone", e.target.value)
                      }
                      required
                      className={classeCampo}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={classeLabel}>E-mail</label>
                    <input
                      type="email"
                      value={formulario.email}
                      onChange={(e) =>
                        atualizarCampo("email", e.target.value)
                      }
                      className={classeCampo}
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="mb-5 text-lg font-bold text-slate-800">
                    Endereço
                  </h4>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className={classeLabel}>CEP</label>
                      <input
                        type="text"
                        value={formulario.cep}
                        onChange={(e) =>
                          atualizarCampo("cep", e.target.value)
                        }
                        className={classeCampo}
                      />
                    </div>

                    <div>
                      <label className={classeLabel}>Logradouro</label>
                      <input
                        type="text"
                        value={formulario.logradouro}
                        onChange={(e) =>
                          atualizarCampo("logradouro", e.target.value)
                        }
                        className={classeCampo}
                      />
                    </div>

                    <div>
                      <label className={classeLabel}>Número</label>
                      <input
                        type="text"
                        value={formulario.numero}
                        onChange={(e) =>
                          atualizarCampo("numero", e.target.value)
                        }
                        className={classeCampo}
                      />
                    </div>

                    <div>
                      <label className={classeLabel}>Complemento</label>
                      <input
                        type="text"
                        value={formulario.complemento}
                        onChange={(e) =>
                          atualizarCampo("complemento", e.target.value)
                        }
                        className={classeCampo}
                      />
                    </div>

                    <div>
                      <label className={classeLabel}>Bairro</label>
                      <input
                        type="text"
                        value={formulario.bairro}
                        onChange={(e) =>
                          atualizarCampo("bairro", e.target.value)
                        }
                        className={classeCampo}
                      />
                    </div>

                    <div>
                      <label className={classeLabel}>Cidade</label>
                      <input
                        type="text"
                        value={formulario.cidade}
                        onChange={(e) =>
                          atualizarCampo("cidade", e.target.value)
                        }
                        className={classeCampo}
                      />
                    </div>

                    <div>
                      <label className={classeLabel}>Estado (UF)</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={formulario.estado}
                        onChange={(e) =>
                          atualizarCampo("estado", e.target.value)
                        }
                        className={classeCampo}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                <Link
                  href={`/dashboard/tutores/${id}`}
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

export default function EditarTutorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
          Carregando página...
        </div>
      }
    >
      <ConteudoEditarTutorPage />
    </Suspense>
  );
}
