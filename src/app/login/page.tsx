
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function realizarLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem || "Não foi possível realizar o login.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErro("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">
          Acessar sistema
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Entre com os dados do administrador.
        </p>

        <form onSubmit={realizarLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 p-3 text-black outline-none focus:border-blue-600"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Senha
            </label>

            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 p-3 text-black outline-none focus:border-blue-600"
              placeholder="Digite sua senha"
            />
          </div>

          {erro && (
            <p className="text-sm text-red-600">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
