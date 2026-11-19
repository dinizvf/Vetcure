"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  PawPrint,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  ArrowLeft,
  Save,
  UserRound,
  RefreshCw,
} from "lucide-react";

interface Tutor {
  id: number;
  nome: string;
  telefone: string;
}

export default function NovoPetPage() {
  const router = useRouter();

  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [carregandoTutores, setCarregandoTutores] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

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
    async function carregarTutores() {
      try {
        const resposta = await fetch("/api/tutores", {
          cache: "no-store",
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          if (resposta.status === 401) {
            router.push("/login");
            return;
          }

          throw new Error(dados.mensagem || "Erro ao carregar tutores.");
        }

        setTutores(dados.tutores || []);

      } catch (error) {
        setTipoMensagem("erro");
        setMensagem(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os tutores."
        );
      } finally {
        setCarregandoTutores(false);
      }
    }

    carregarTutores();
  }, [router]);

  function atualizarCampo(campo: string, valor: string) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function cadastrarPet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSalvando(true);
    setMensagem("");

    try {
      const resposta = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formulario,
          tutor_id: Number(formulario.tutor_id),
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        const erros = dados.erros
          ? Object.values(dados.erros).flat().join(" ")
          : dados.mensagem;

        throw new Error(erros || "Não foi possível cadastrar o pet.");
      }

      setTipoMensagem("sucesso");
      setMensagem("Pet cadastrado com sucesso!");

      setTimeout(() => {
        router.push("/dashboard/pets");
      }, 1200);

    } catch (error) {
      setTipoMensagem("erro");
      setMensagem(
        error instanceof Error
          ? error.message
          : "Erro ao cadastrar pet."
      );
    } finally {
      setSalvando(false);
    }
  }

  const estiloInput =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const estiloLabel = "text-sm font-semibold text-slate-700";

  return (
    <main className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 flex-col bg-blue-900 p-6 text-white md:flex">
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
          <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 hover:bg-blue-800">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/dashboard/tutores" className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 hover:bg-blue-800">
            <Users size={20} /> Tutores
          </Link>
          <Link href="/dashboard/pets" className="flex items-center gap-3 rounded-xl bg-blue-800 px-4 py-3 font-medium">
            <PawPrint size={20} /> Pets
          </Link>
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200">
            <CalendarDays size={20} /> Agendamentos
          </div>
        </nav>

        <div className="mt-auto border-t border-blue-800 pt-5 text-xs text-blue-300">
          Sistema de Gestão Veterinária
          <p className="mt-1">Versão 1.0</p>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-6 md:p-10">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">GERENCIAMENTO</p>
            <h2 className="text-3xl font-bold text-slate-800">Novo pet</h2>
            <p className="mt-2 text-slate-500">
              Cadastre um animal e associe-o ao seu tutor.
            </p>
          </div>

          <Link href="/api/auth/logout" className="flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-600 hover:bg-slate-200">
            <LogOut size={19} /> Sair
          </Link>
        </header>

        <Link
          href="/dashboard/pets"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft size={18} /> Voltar para pets
        </Link>

        <form onSubmit={cadastrarPet}>
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <PawPrint size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Dados do animal</h3>
                <p className="text-sm text-slate-500">
                  Preencha as informações de identificação do pet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={estiloLabel}>Nome do pet *</label>
                <input
                  required
                  minLength={2}
                  maxLength={120}
                  value={formulario.nome}
                  onChange={(e) => atualizarCampo("nome", e.target.value)}
                  placeholder="Ex.: Bob"
                  className={estiloInput}
                />
              </div>

              <div>
                <label className={estiloLabel}>Espécie *</label>
                <select
                  required
                  value={formulario.especie}
                  onChange={(e) => atualizarCampo("especie", e.target.value)}
                  className={estiloInput}
                >
                  <option value="">Selecione a espécie</option>
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Coelho">Coelho</option>
                  <option value="Roedor">Roedor</option>
                  <option value="Réptil">Réptil</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className={estiloLabel}>Raça</label>
                <input
                  value={formulario.raca}
                  onChange={(e) => atualizarCampo("raca", e.target.value)}
                  placeholder="Ex.: Labrador"
                  className={estiloInput}
                />
              </div>

              <div>
                <label className={estiloLabel}>Sexo *</label>
                <select
                  required
                  value={formulario.sexo}
                  onChange={(e) => atualizarCampo("sexo", e.target.value)}
                  className={estiloInput}
                >
                  <option value="NAO_INFORMADO">Não informado</option>
                  <option value="MACHO">Macho</option>
                  <option value="FEMEA">Fêmea</option>
                </select>
              </div>

              <div>
                <label className={estiloLabel}>Data de nascimento</label>
                <input
                  type="date"
                  value={formulario.data_nascimento}
                  onChange={(e) =>
                    atualizarCampo("data_nascimento", e.target.value)
                  }
                  className={estiloInput}
                />
              </div>

              <div className="md:col-span-2">
                <label className={estiloLabel}>Observações</label>
                <textarea
                  rows={4}
                  value={formulario.observacoes}
                  onChange={(e) =>
                    atualizarCampo("observacoes", e.target.value)
                  }
                  placeholder="Informações adicionais sobre o animal..."
                  className={estiloInput}
                />
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <UserRound size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Tutor responsável</h3>
                <p className="text-sm text-slate-500">
                  Selecione o responsável pelo animal.
                </p>
              </div>
            </div>

            <label className={estiloLabel}>Tutor *</label>
            <select
              required
              value={formulario.tutor_id}
              onChange={(e) => atualizarCampo("tutor_id", e.target.value)}
              disabled={carregandoTutores}
              className={estiloInput}
            >
              <option value="">
                {carregandoTutores ? "Carregando tutores..." : "Selecione um tutor"}
              </option>
              {tutores.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.nome} — {tutor.telefone}
                </option>
              ))}
            </select>

            {!carregandoTutores && tutores.length === 0 && (
              <p className="mt-3 text-sm text-red-600">
                Nenhum tutor cadastrado. Cadastre um tutor antes de registrar um pet.
              </p>
            )}

            <Link
              href="/dashboard/tutores/novo"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              <Users size={17} /> Cadastrar novo tutor
            </Link>
          </div>

          {mensagem && (
            <div
              className={`mb-6 rounded-xl border p-4 text-sm font-medium ${
                tipoMensagem === "sucesso"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {mensagem}
            </div>
          )}

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              href="/dashboard/pets"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={salvando || carregandoTutores || tutores.length === 0}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {salvando ? "Cadastrando..." : "Salvar pet"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}