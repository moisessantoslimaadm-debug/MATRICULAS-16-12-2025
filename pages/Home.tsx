
import React, { useState } from 'react';
import { Link, useNavigate } from '../router';
import { Calendar, CheckCircle2, MapPin, ArrowRight, Loader2, ShieldCheck, GraduationCap, Building2, Search } from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistrationClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/registration');
    }, 400);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      {/* Hero Section - High Requinte */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-900 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-indigo-200 text-[10px] font-black uppercase tracking-[0.2em]">Plataforma Oficial de Matrícula 2025</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              Educação que <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300">Transforma.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg font-medium">
              Gestão inteligente de vagas e matrículas para a rede municipal de <span className="text-white font-bold">{MUNICIPALITY_NAME}</span>. Simples, digital e transparente.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={handleRegistrationClick}
                disabled={isLoading}
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all duration-300 shadow-2xl shadow-white/10 overflow-hidden"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Iniciar Matrícula
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </>
                )}
              </button>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-10 py-5 bg-slate-800/50 text-white border border-white/10 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all backdrop-blur-md"
              >
                Acesso Restrito
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
             <div className="relative z-10 bg-gradient-to-br from-indigo-600/20 to-transparent p-1 rounded-[4rem] border border-white/10 backdrop-blur-sm">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80" 
                  alt="Educação" 
                  className="rounded-[3.8rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                />
             </div>
             {/* Floating Badge */}
             <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[3rem] shadow-2xl animate-bounce-slow">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-4 rounded-2xl text-white">
                        <GraduationCap className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-4xl font-black text-slate-900">100%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digitalizado</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats/Benefits Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Search className="h-7 w-7" />,
                title: "Localização Inteligente",
                desc: "O sistema encontra as escolas mais próximas de sua residência usando geoprocessamento avançado.",
                color: "bg-blue-600"
              },
              {
                icon: <ShieldCheck className="h-7 w-7" />,
                title: "Segurança de Dados",
                desc: "Seus dados estão protegidos pela LGPD e sincronizados diretamente com a base do INEP/MEC.",
                color: "bg-emerald-600"
              },
              {
                icon: <Building2 className="h-7 w-7" />,
                title: "Gestão Transparente",
                desc: "Acompanhe o status da sua solicitação em tempo real através do portal de consultas.",
                color: "bg-indigo-600"
              }
            ].map((item, idx) => (
              <div key={idx} className="group p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50 hover:-translate-y-4 transition-all duration-500">
                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg group-hover:rotate-12 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 bg-white border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="bg-slate-900 p-2 rounded-lg"><GraduationCap className="h-5 w-5 text-white" /></div>
                <span className="font-black text-xl text-slate-900 tracking-tighter uppercase">Educa<span className="text-indigo-600">Município</span></span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Secretaria de Educação de {MUNICIPALITY_NAME} © 2025</p>
        </div>
      </footer>
      
      <style>{`
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
