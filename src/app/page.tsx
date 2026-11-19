
import Link from "next/link";
import {
  PawPrint,
  CalendarDays,
  Users,
  ClipboardList,
  ShieldCheck,
  Heart,
  ArrowRight,
  Stethoscope,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* NAVBAR */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-900 p-2 text-white">
              <PawPrint size={25} />
            </div>
            <span className="text-2xl font-bold text-blue-950">
              Sistema
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#inicio" className="transition hover:text-blue-700">
              Início
            </a>
            <a href="#funcionalidades" className="transition hover:text-blue-700">
              Funcionalidades
            </a>
            <a href="#sobre" className="transition hover:text-blue-700">
              Sobre o sistema
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Entrar
            </Link>

            <Link
              href="/cadastro"
              className="hidden rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800 sm:block"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        id="inicio"
        className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 pt-32"
      >
        <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-100">
              <Heart size={16} />
              Cuidado e organização em um só lugar
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Cuidar dos animais ficou
              <span className="text-cyan-300"> mais simples.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-blue-100">
              O Sistema é uma plataforma de gerenciamento veterinário
              desenvolvida para facilitar a organização de tutores, pets e
              agendamentos, tornando a rotina de atendimento mais prática e
              eficiente.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-blue-950 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
              >
                Acessar sistema
                <ArrowRight size={19} />
              </Link>

              <a
                href="#funcionalidades"
                className="rounded-xl border border-white/40 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                Conhecer funcionalidades
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-blue-100">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-cyan-300" />
                Fácil utilização
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-cyan-300" />
                Dados organizados
              </span>
            </div>
          </div>

          {/* CARD ILUSTRATIVO */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-cyan-300/20 blur-2xl" />

            <div className="relative rounded-3xl border border-white/20 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Painel de gerenciamento
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-blue-950">
                    Bem-vindo ao Sistema!
                  </h2>
                </div>
                <div className="rounded-xl bg-blue-100 p-3 text-blue-900">
                  <PawPrint size={27} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-blue-50 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                    <Users size={21} />
                  </div>
                  <p className="text-2xl font-bold text-blue-950">Tutores</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Cadastro e consulta
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <PawPrint size={21} />
                  </div>
                  <p className="text-2xl font-bold text-blue-950">Pets</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Informações dos animais
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                      <CalendarDays size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-blue-950">
                        Agendamentos
                      </p>
                      <p className="text-xs text-slate-500">
                        Organização dos atendimentos
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={19} className="text-slate-400" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-blue-900 p-4 text-white">
                <div className="rounded-xl bg-white/15 p-3">
                  <ShieldCheck size={23} />
                </div>
                <div>
                  <p className="font-semibold">Gestão centralizada</p>
                  <p className="text-xs text-blue-100">
                    Mais praticidade para a rotina veterinária
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-bold uppercase tracking-widest text-blue-700">
              Funcionalidades
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
              Tudo o que você precisa para organizar sua clínica
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Ferramentas desenvolvidas para centralizar informações e
              simplificar o gerenciamento dos atendimentos veterinários.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: "Gestão de tutores",
                description:
                  "Cadastre e consulte os dados dos responsáveis pelos animais.",
                color: "bg-blue-100 text-blue-700",
              },
              {
                icon: PawPrint,
                title: "Cadastro de pets",
                description:
                  "Organize as informações dos animais e seus respectivos tutores.",
                color: "bg-emerald-100 text-emerald-700",
              },
              {
                icon: CalendarDays,
                title: "Agendamentos",
                description:
                  "Registre, consulte e acompanhe os horários de atendimento.",
                color: "bg-orange-100 text-orange-700",
              },
              {
                icon: ClipboardList,
                title: "Controle de informações",
                description:
                  "Mantenha os registros organizados em um único sistema.",
                color: "bg-violet-100 text-violet-700",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
                  >
                    <Icon size={27} />
                  </div>

                  <h3 className="text-lg font-bold text-blue-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
          <div className="relative">
            <div className="rounded-3xl bg-blue-900 p-8 text-white shadow-xl md:p-12">
              <div className="mb-8 inline-flex rounded-2xl bg-white/10 p-4">
                <Stethoscope size={36} />
              </div>

              <h2 className="text-3xl font-extrabold leading-tight">
                Tecnologia trabalhando a favor do cuidado animal.
              </h2>

              <p className="mt-5 leading-relaxed text-blue-100">
                Uma plataforma que reúne os principais registros da rotina
                veterinária, contribuindo para uma administração mais
                organizada e eficiente.
              </p>

              <div className="mt-9 flex items-center gap-3 border-t border-white/20 pt-6">
                <Heart size={24} className="text-cyan-300" />
                <span className="font-semibold">
                  Mais organização, mais praticidade e mais cuidado.
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="font-bold uppercase tracking-widest text-blue-700">
              Sobre o Sistema
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
              Uma maneira mais simples de gerenciar atendimentos.
            </h2>

            <p className="mt-6 leading-relaxed text-slate-600">
              O Sistema foi pensado para auxiliar no gerenciamento de
              informações de uma clínica veterinária. Por meio de uma
              interface intuitiva, permite administrar cadastros de tutores,
              informações dos pets e agendamentos.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-800">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-950">
                    Mais organização
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Informações centralizadas para facilitar o acesso e a
                    consulta.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-950">
                    Acesso controlado
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Área de gerenciamento protegida por autenticação de
                    usuários.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/login"
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-blue-900 px-7 py-4 font-bold text-white shadow-lg transition hover:bg-blue-800"
            >
              Conhecer o sistema
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-900 text-white">
            <PawPrint size={32} />
          </div>

          <h2 className="text-3xl font-extrabold text-blue-950 md:text-4xl">
            Pronto para começar?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Acesse o Sistema e tenha as ferramentas de gerenciamento
            veterinário reunidas em um só lugar.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-900 px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-800"
          >
            Acessar plataforma
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-950 px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <PawPrint size={22} />
            <span className="text-xl font-bold">Sistema</span>
          </Link>

          <p className="text-center text-sm text-blue-200">
            Sistema de Gerenciamento Veterinário
          </p>

          <p className="text-sm text-blue-300">
            © 2026 Sistema
          </p>
        </div>
      </footer>
    </main>
  );
}
