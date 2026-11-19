
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
}

function ConteudoEditarPetPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [formulario, setFormulario] = useState({
    tutor_id: "",
    nome: "",
    especie: "",
    raca: "",
    sexo: "NAO_INFORMADO",
    data_nascimento: "",
    observacoes: "",
  });

  useEffect(() => {
    async function carregarDados() {
      try {
        const [respostaPet, respostaTutores] = await Promise.all([
          fetch(`/api/pets/${id}`),
          fetch("/api/tutores"),
        ]);

        if (
          respostaPet.status === 401 ||
          respostaTutores.status === 401
        ) {
          window.location.href = "/login";
          return;
        }

        const dadosPet = await respostaPet.json();
        const dadosTutores = await respostaTutores.json();

        if (!respostaPet.ok) {
          throw new Error(
            dadosPet.mensagem ||
              dadosPet.erro ||
              "Não foi possível carregar o pet."
          );
        }

        if (!respostaTutores.ok) {
          throw new Error(
            dadosTutores.mensagem ||
              dadosTutores.erro ||
              "Não foi possível carregar os tutores."
          );
        }

        // Aceita tanto a resposta direta quanto a resposta dentro de "pet".
        const pet = dadosPet.pet || dadosPet;

        // Aceita diferentes formatos de resposta da API de tutores.
        let listaTutores: Tutor[] = [];

        if (Array.isArray(dadosTutores)) {
          listaTutores = dadosTutores;
        } else if (Array.isArray(dadosTutores.tutores)) {
          listaTutores = dadosTutores.tutores;
        } else if (Array.isArray(dadosTutores.dados)) {
          listaTutores = dadosTutores.dados;
        }

        // Padroniza os dados recebidos.
        listaTutores = listaTutores.map((tutor: any) => ({
          id: Number(tutor.id),
          nome: tutor.nome,
        }));

        // Garante que o tutor atual apareça na lista.
        const tutorAtualId = Number(pet.tutor_id);

        const tutorAtualExiste = listaTutores.some(
          (tutor) => tutor.id === tutorAtualId
        );

        if (
          tutorAtualId &&
          !tutorAtualExiste &&
          pet.tutor_nome
        ) {
          listaTutores.unshift({
            id: tutorAtualId,
            nome: pet.tutor_nome,
          });
        }

        setTutores(listaTutores);

        setFormulario({
          tutor_id: String(pet.tutor_id || ""),
          nome: pet.nome || "",
          especie: pet.especie || "",
          raca: pet.raca || "",
          sexo: pet.sexo || "NAO_INFORMADO",
          data_nascimento: pet.data_nascimento
            ? String(pet.data_nascimento).substring(0, 10)
            : "",
          observacoes: pet.observacoes || "",
        });

      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar informações."
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
      !formulario.tutor_id ||
      !formulario.nome.trim() ||
      !formulario.especie.trim()
    ) {
      setErro("Preencha o tutor, o nome e a espécie do pet.");
      return;
    }

    setSalvando(true);

    try {
      const resposta = await fetch(`/api/pets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formulario,
          tutor_id: Number(formulario.tutor_id),
          nome: formulario.nome.trim(),
          especie: formulario.especie.trim(),
          raca: formulario.raca.trim(),
          data_nascimento: formulario.data_nascimento || "",
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
            "Não foi possível atualizar o cadastro."
        );
      }

      setSucesso("Cadastro do pet atualizado com sucesso!");

      setTimeout(() => {
        router.push(`/dashboard/pets/${id}`);
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
            href={`/dashboard/pets/${id}`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Voltar para detalhes
          </Link>

          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <PawPrint size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">
                  Editar pet
                </h2>
                <p className="text-sm text-slate-500">
                  Atualize as informações do animal cadastrado.
                </p>
              </div>
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
                  Informações do pet
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Atualize os dados abaixo. Os campos com * são obrigatórios.
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
                    Tutor responsável *
                  </label>

                  <select
                    value={formulario.tutor_id}
                    onChange={(e) =>
                      atualizarCampo("tutor_id", e.target.value)
                    }
                    required
                    className={classeCampo}
                  >
                    <option value="">Selecione um tutor</option>

                    {tutores.map((tutor) => (
                      <option key={tutor.id} value={tutor.id}>
                        {tutor.nome}
                      </option>
                    ))}
                  </select>

                  {tutores.length === 0 && (
                    <p className="mt-2 text-sm text-amber-600">
                      Nenhum tutor foi encontrado. Verifique se existem tutores cadastrados.
                    </p>
                  )}
                </div>

                <div>
                  <label className={classeLabel}>
                    Nome do pet *
                  </label>

                  <input
                    type="text"
                    value={formulario.nome}
                    onChange={(e) =>
                      atualizarCampo("nome", e.target.value)
                    }
                    required
                    minLength={2}
                    placeholder="Ex.: Bob"
                    className={classeCampo}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={classeLabel}>
                      Espécie *
                    </label>

                    <select
                      value={formulario.especie}
                      onChange={(e) =>
                        atualizarCampo("especie", e.target.value)
                      }
                      required
                      className={classeCampo}
                    >
                      <option value="">Selecione</option>
                      <option value="Cachorro">Cachorro</option>
                      <option value="Gato">Gato</option>
                      <option value="Ave">Ave</option>
                      <option value="Roedor">Roedor</option>
                      <option value="Réptil">Réptil</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className={classeLabel}>Raça</label>

                    <input
                      type="text"
                      value={formulario.raca}
                      onChange={(e) =>
                        atualizarCampo("raca", e.target.value)
                      }
                      placeholder="Ex.: Labrador"
                      className={classeCampo}
                    />
                  </div>

                  <div>
                    <label className={classeLabel}>Sexo</label>

                    <select
                      value={formulario.sexo}
                      onChange={(e) =>
                        atualizarCampo("sexo", e.target.value)
                      }
                      className={classeCampo}
                    >
                      <option value="NAO_INFORMADO">
                        Não informado
                      </option>
                      <option value="MACHO">Macho</option>
                      <option value="FEMEA">Fêmea</option>
                    </select>
                  </div>

                  <div>
                    <label className={classeLabel}>
                      Data de nascimento
                    </label>

                    <input
                      type="date"
                      value={formulario.data_nascimento}
                      onChange={(e) =>
                        atualizarCampo("data_nascimento", e.target.value)
                      }
                      className={classeCampo}
                    />
                  </div>
                </div>

                <div>
                  <label className={classeLabel}>Observações</label>

                  <textarea
                    value={formulario.observacoes}
                    onChange={(e) =>
                      atualizarCampo("observacoes", e.target.value)
                    }
                    rows={4}
                    placeholder="Informações adicionais sobre o pet..."
                    className={`${classeCampo} resize-y`}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row">
                <Link
                  href={`/dashboard/pets/${id}`}
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

export default function EditarPetPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">
          Carregando página...
        </div>
      }
    >
      <ConteudoEditarPetPage />
    </Suspense>
  );
}
