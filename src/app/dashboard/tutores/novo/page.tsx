
"use client";

import { useState } from "react";
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
  MapPin,
} from "lucide-react";

export default function NovoTutorPage() {
  const router = useRouter();

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const [formulario, setFormulario] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  function atualizarCampo(
    campo: string,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function formatarCPF(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    return numeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 10) {
      return numeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  function formatarCEP(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);

    return numeros.replace(/(\d{5})(\d)/, "$1-$2");
  }

  async function cadastrarTutor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCarregando(true);
    setMensagem("");

    try {
      const resposta = await fetch("/api/tutores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formulario),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        const erros = dados.erros
          ? Object.values(dados.erros).flat().join(" ")
          : dados.mensagem;

        setTipoMensagem("erro");
        setMensagem(erros || "Não foi possível cadastrar o tutor.");
        return;
      }

      setTipoMensagem("sucesso");
      setMensagem("Tutor cadastrado com sucesso!");

      setTimeout(() => {
        router.push("/dashboard/tutores");
      }, 1200);

    } catch {
      setTipoMensagem("erro");
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  const estiloInput =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const estiloLabel =
    "text-sm font-semibold text-slate-700";

  return (
    <main className="flex min-h-screen bg-slate-100">

      {/* Menu lateral */}
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

          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200">
            <PawPrint size={20} />
            <span>Pets</span>
          </div>

          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200">
            <CalendarDays size={20} />
            <span>Agendamentos</span>
          </div>
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

      {/* Conteúdo principal */}
      <section className="min-w-0 flex-1 p-6 md:p-10">

        {/* Cabeçalho */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">
              GERENCIAMENTO
            </p>

            <h2 className="text-3xl font-bold text-slate-800">
              Novo tutor
            </h2>

            <p className="mt-2 text-slate-500">
              Cadastre os dados do responsável pelo animal.
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

        {/* Voltar */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
        >
          <ArrowLeft size={18} />
          Voltar ao dashboard
        </Link>

        {/* Formulário */}
        <form onSubmit={cadastrarTutor}>

          {/* Dados pessoais */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <UserRound size={24} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Dados pessoais
                </h3>

                <p className="text-sm text-slate-500">
                  Informações de identificação e contato.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="md:col-span-2">
                <label className={estiloLabel}>
                  Nome completo *
                </label>

                <input
                  type="text"
                  required
                  maxLength={120}
                  value={formulario.nome}
                  onChange={(e) =>
                    atualizarCampo("nome", e.target.value)
                  }
                  placeholder="Digite o nome completo"
                  className={estiloInput}
                />
              </div>

              <div>
                <label className={estiloLabel}>
                  CPF *
                </label>

                <input
                  type="text"
                  required
                  inputMode="numeric"
                  value={formulario.cpf}
                  onChange={(e) =>
                    atualizarCampo("cpf", formatarCPF(e.target.value))
                  }
                  placeholder="000.000.000-00"
                  className={estiloInput}
                />

                <p className="mt-2 text-xs text-slate-400">
                  O CPF será armazenado de forma criptografada.
                </p>
              </div>

              <div>
                <label className={estiloLabel}>
                  Telefone *
                </label>

                <input
                  type="tel"
                  required
                  value={formulario.telefone}
                  onChange={(e) =>
                    atualizarCampo(
                      "telefone",
                      formatarTelefone(e.target.value)
                    )
                  }
                  placeholder="(00) 00000-0000"
                  className={estiloInput}
                />
              </div>

              <div className="md:col-span-2">
                <label className={estiloLabel}>
                  E-mail
                </label>

                <input
                  type="email"
                  value={formulario.email}
                  onChange={(e) =>
                    atualizarCampo("email", e.target.value)
                  }
                  placeholder="exemplo@email.com"
                  className={estiloInput}
                />
              </div>

            </div>
          </div>

          {/* Endereço */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-7 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <MapPin size={24} />
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

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="md:col-span-2">
                <label className={estiloLabel}>
                  Logradouro
                </label>

                <input
                  type="text"
                  value={formulario.logradouro}
                  onChange={(e) =>
                    atualizarCampo("logradouro", e.target.value)
                  }
                  placeholder="Rua, avenida, travessa..."
                  className={estiloInput}
                />
              </div>

              <div>
                <label className={estiloLabel}>
                  Número
                </label>

                <input
                  type="text"
                  value={formulario.numero}
                  onChange={(e) =>
                    atualizarCampo("numero", e.target.value)
                  }
                  placeholder="Número"
                  className={estiloInput}
                />
              </div>

              <div>
                <label className={estiloLabel}>
                  Complemento
                </label>

                <input
                  type="text"
                  value={formulario.complemento}
                  onChange={(e) =>
                    atualizarCampo("complemento", e.target.value)
                  }
                  placeholder="Apartamento, casa..."
                  className={estiloInput}
                />
              </div>

              <div>
                <label className={estiloLabel}>
                  Bairro
                </label>

                <input
                  type="text"
                  value={formulario.bairro}
                  onChange={(e) =>
                    atualizarCampo("bairro", e.target.value)
                  }
                  placeholder="Bairro"
                  className={estiloInput}
                />
              </div>

              <div>
                <label className={estiloLabel}>
                  Cidade
                </label>

                <input
                  type="text"
                  value={formulario.cidade}
                  onChange={(e) =>
                    atualizarCampo("cidade", e.target.value)
                  }
                  placeholder="Cidade"
                  className={estiloInput}
                />
              </div>

              <div>
                <label className={estiloLabel}>
                  Estado
                </label>

                <input
                  type="text"
                  maxLength={2}
                  value={formulario.estado}
                  onChange={(e) =>
                    atualizarCampo(
                      "estado",
                      e.target.value.toUpperCase()
                    )
                  }
                  placeholder="UF"
                  className={estiloInput}
                />
              </div>

              <div>
                <label className={estiloLabel}>
                  CEP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={formulario.cep}
                  onChange={(e) =>
                    atualizarCampo("cep", formatarCEP(e.target.value))
                  }
                  placeholder="00000-000"
                  className={estiloInput}
                />
              </div>

            </div>
          </div>

          {/* Mensagens */}
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

          {/* Botões */}
          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={carregando}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {carregando ? "Cadastrando..." : "Salvar tutor"}
            </button>

          </div>

        </form>
      </section>
    </main>
  );
}
