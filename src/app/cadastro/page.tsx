
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, UserRound, Mail } from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  async function handleCadastro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem("");
    setErro(false);

    if (senha !== confirmarSenha) {
      setErro(true);
      setMensagem("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.mensagem || "Não foi possível realizar o cadastro.");
      }

      setMensagem("Administrador cadastrado com sucesso!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      setErro(true);
      setMensagem(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <LockKeyhole size={30} className="text-blue-700" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Criar administrador
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Cadastre os dados do responsável pelo sistema.
          </p>
        </div>

        <form onSubmit={handleCadastro} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nome completo
            </label>

            <div className="flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-blue-600">
              <UserRound size={18} className="text-slate-400" />

              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
                maxLength={120}
                required
                className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              E-mail
            </label>

            <div className="flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-blue-600">
              <Mail size={18} className="text-slate-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                maxLength={180}
                required
                className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Senha
            </label>

            <div className="flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-blue-600">
              <LockKeyhole size={18} className="text-slate-400" />

              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo de 8 caracteres"
                minLength={8}
                required
                className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 outline-none"
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="text-slate-400 hover:text-slate-700"
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Confirmar senha
            </label>

            <div className="flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-blue-600">
              <LockKeyhole size={18} className="text-slate-400" />

              <input
                type={mostrarSenha ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Digite a senha novamente"
                minLength={8}
                required
                className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 outline-none"
              />
            </div>
          </div>

          {mensagem && (
            <div
              className={`rounded-lg p-3 text-sm ${
                erro
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {mensagem}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {carregando ? "Cadastrando..." : "Cadastrar administrador"}
          </button>

        </form>
      </div>
    </main>
  );
}
