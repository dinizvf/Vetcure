
import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/auth";
import {
  Users,
  PawPrint,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

export const instant = false;

export default async function DashboardPage() {
  const sessao = await obterSessao();

  if (!sessao) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen bg-slate-100">
      {/* Menu lateral */}
      <aside className="hidden w-64 shrink-0 flex-col bg-blue-900 p-6 text-white md:flex">
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

        <nav className="flex-1 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl bg-blue-800 px-4 py-3 font-medium text-white"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/tutores"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800 hover:text-white"
          >
            <Users size={20} />
            <span>Tutores</span>
          </Link>

          <Link
            href="/dashboard/pets"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800 hover:text-white"
          >
            <PawPrint size={20} />
            <span>Pets</span>
          </Link>

          <Link
            href="/dashboard/agendamentos"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800 hover:text-white"
          >
            <CalendarDays size={20} />
            <span>Agendamentos</span>
          </Link>
        </nav>

        <div className="mt-auto border-t border-blue-800 pt-5">
          <a
            href="/api/auth/logout"
            className="mb-4 flex items-center gap-3 rounded-xl px-4 py-3 text-blue-200 transition hover:bg-blue-800 hover:text-white"
          >
            <LogOut size={20} />
            Sair do sistema
          </a>

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
        <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-700">
              PAINEL ADMINISTRATIVO
            </p>

            <h2 className="text-3xl font-bold text-slate-800">
              Dashboard
            </h2>

            <p className="mt-2 text-slate-500">
              Bem-vindo ao sistema de gestão da clínica veterinária.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800">
              {sessao.email.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Administrador
              </p>

              <p className="max-w-48 truncate text-xs text-slate-500">
                {sessao.email}
              </p>
            </div>

            <Link
              href="/api/auth/logout"
              className="ml-2 rounded-lg border border-slate-300 p-3 text-slate-600 transition hover:bg-slate-200"
              title="Sair"
            >
              <LogOut size={20} />
            </Link>
          </div>
        </header>

        {/* Apresentação */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-800 to-blue-600 p-7 text-white shadow-sm">
          <h3 className="text-2xl font-bold">
            Bem-vindo ao seu painel!
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
            Gerencie os tutores, acompanhe os animais cadastrados
            e organize os atendimentos da clínica em um só lugar.
          </p>
        </div>

        {/* Módulos */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-800">
            Módulos do sistema
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Selecione uma área para gerenciar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {/* Tutores */}
          <Link
            href="/dashboard/tutores"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
              <Users size={28} />
            </div>

            <h4 className="text-lg font-bold text-slate-800">
              Tutores
            </h4>

            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
              Cadastre e gerencie os responsáveis pelos animais
              atendidos pela clínica.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-700">
                Acessar módulo
              </span>
              <ArrowRight
                size={19}
                className="text-blue-700 transition group-hover:translate-x-1"
              />
            </div>
          </Link>

          {/* Pets */}
          <Link
            href="/dashboard/pets"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
              <PawPrint size={28} />
            </div>

            <h4 className="text-lg font-bold text-slate-800">
              Pets
            </h4>

            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
              Organize os cadastros dos animais e seus vínculos
              com os respectivos tutores.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-700">
                Acessar módulo
              </span>
              <ArrowRight
                size={19}
                className="text-blue-700 transition group-hover:translate-x-1"
              />
            </div>
          </Link>

          {/* Agendamentos */}
          <Link
            href="/dashboard/agendamentos"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
              <CalendarDays size={28} />
            </div>

            <h4 className="text-lg font-bold text-slate-800">
              Agendamentos
            </h4>

            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
              Organize os horários, acompanhe consultas e
              gerencie os atendimentos.
            </p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-700">
                Acessar módulo
              </span>
              <ArrowRight
                size={19}
                className="text-blue-700 transition group-hover:translate-x-1"
              />
            </div>
          </Link>

        </div>
      </section>
    </main>
  );
}
