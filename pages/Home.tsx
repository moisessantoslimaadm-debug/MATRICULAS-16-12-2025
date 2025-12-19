import React, { useState } from 'react';
import { Link, useNavigate } from '../router';
import { Calendar, CheckCircle2, MapPin, ArrowRight, Loader2, ShieldCheck, GraduationCap, Building2, Search, Zap, Globe, Sparkles } from 'lucide-react';
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
      <section className="relative min-h-[95vh] flex items-center bg-[#0F172A] overflow-hidden">
        {/* Elementos Abstratos */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center py-20">
          <div className="animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full mb-10 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-200 text-[10px] font-black uppercase tracking-[0.3em]">Censo Escolar 2025 • Rede Digital</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-10">
              Educação em <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-500">Transformação.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-lg font-medium">
              Transformamos a gestão de matrículas em uma experiência fluida, inteligente e <span className="text-white font-bold">totalmente transparente</span> para a rede municipal de {MUNICIPALITY_NAME}.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={handleRegistrationClick}
                disabled={isLoading}
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-white text-slate-900 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all duration-500 shadow-2xl overflow-hidden active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Nova Matrícula 2025
                    <ArrowRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </>
                )}
              </button>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-12 py-6 bg-white/5 text-white border border-white/10 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all backdrop-blur-xl active:scale-95"
              >
                Painel Administrativo
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
             <div className="relative z-10 p-2 rounded-[5rem] border border-white/5 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80" 
                  alt="Educação" 
                  className="rounded-[4.8rem] shadow-2xl grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-1000 scale-105 hover:scale-100"
                />
             </div>
             
             {/* Badges Flutuantes Premium */}
             <div className="absolute -bottom-12 -left-12 bg-white p-10 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] animate-float z-20">
                <div className="flex items-center gap-5">
                    <div className="bg-emerald-600 p-5 rounded-3xl text-white shadow-xl shadow-emerald-100">
                        <GraduationCap className="h-10 w-10" />
                    </div>
                    <div>
                        <p className="text-5xl font-black text-slate-900 tracking-tighter">100%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SME Itaberaba Digital</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Benefícios com Visual Clean */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
             <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-6">Eficiência Pública de Classe Mundial</h2>
             <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Inovação e Transparência <br/> a serviço da rede escolar.</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Zoneamento Inteligente",
                desc: "Algoritmos de geoprocessamento vinculam o aluno à unidade mais próxima de sua residência automaticamente.",
                color: "bg-blue-600",
                shadow: "shadow-blue-100"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Assistente Virtual",
                desc: "O 'Edu', nosso assistente cognitivo, tira dúvidas complexas sobre documentação e vagas em tempo real.",
                color: "bg-emerald-600",
                shadow: "shadow-emerald-100"
              },
              {
                icon: <CheckCircle2 className="h-8 w-8" />,
                title: "Gestão Nominal",
                desc: "Acompanhamento em tempo real da frequência e desempenho através do Diário Digital do Docente.",
                color: "bg-emerald-800",
                shadow: "shadow-emerald-100"
              }
            ].map((item, idx) => (
              <div key={idx} className="group p-12 bg-white rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-6 transition-all duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-50 transition-colors"></div>
                <div className={`${item.color} w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 text-white ${item.shadow} group-hover:rotate-[15deg] transition-all duration-500 relative z-10 shadow-2xl`}>
                  {item.icon}
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-6 tracking-tight relative z-10">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer com Logo Municipal */}
      <footer className="py-20 bg-white border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-4 group cursor-pointer">
                <div className="bg-slate-900 p-3 rounded-2xl group-hover:rotate-6 transition-transform shadow-lg"><GraduationCap className="h-7 w-7 text-white" /></div>
                <span className="font-black text-2xl text-slate-900 tracking-tighter uppercase">Educa<span className="text-emerald-600">Município</span></span>
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2025 • Itaberaba Digital • Gestão da Transformação</p>
        </div>
      </footer>
    </div>
  );
};