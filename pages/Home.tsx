import React, { useState } from 'react';
import { Link, useNavigate } from '../router';
import { Calendar, CheckCircle2, MapPin, ArrowRight, Loader2, ShieldCheck, GraduationCap, Building2, Search, Zap, Globe, Sparkles, MoveRight } from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistrationClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/registration');
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfe]">
      {/* Hero Section - High-End Aesthetic */}
      <section className="relative min-h-screen flex items-center bg-[#0F172A] overflow-hidden m-4 rounded-[4rem] shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[80%] bg-indigo-600/10 blur-[180px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-12 grid lg:grid-cols-2 gap-24 items-center py-24">
          <div className="animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full mb-12 backdrop-blur-2xl">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-200 text-[10px] font-black uppercase tracking-[0.4em]">Censo Digital 2025 • Rede Integrada</span>
            </div>
            
            <h1 className="text-8xl md:text-[9rem] font-black text-white tracking-tighter leading-[0.82] mb-12">
              Educar <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-indigo-400">É Evoluir.</span>
            </h1>
            
            <p className="text-2xl text-slate-400 mb-16 leading-relaxed max-w-xl font-medium">
              Transformamos a gestão de matrículas em um ecossistema inteligente, <span className="text-white font-bold">nominal e georeferenciado</span> para o município de {MUNICIPALITY_NAME}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8">
              <button
                onClick={handleRegistrationClick}
                disabled={isLoading}
                className="group relative inline-flex items-center justify-center px-16 py-8 bg-white text-slate-900 rounded-[2.8rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-50 transition-all duration-700 shadow-2xl hover:shadow-emerald-500/20 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Solicitar Vaga 2025
                    <MoveRight className="ml-5 h-6 w-6 transition-transform group-hover:translate-x-3" />
                  </>
                )}
              </button>
              <Link
                to="/status"
                className="inline-flex items-center justify-center px-16 py-8 bg-white/5 text-white border border-white/10 rounded-[2.8rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-2xl active:scale-95"
              >
                Protocolo Ativo
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
             <div className="relative z-10 p-3 rounded-[6rem] border border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-1000">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80" 
                  alt="Aprendizado Digital" 
                  className="rounded-[5.5rem] shadow-2xl grayscale brightness-90 hover:grayscale-0 hover:brightness-110 transition-all duration-1000 scale-105 hover:scale-100"
                />
             </div>
             
             {/* Badges Flutuantes Premium */}
             <div className="absolute -bottom-16 -left-16 bg-white p-12 rounded-[4rem] shadow-[0_45px_90px_-25px_rgba(0,0,0,0.5)] animate-float z-20">
                <div className="flex items-center gap-6">
                    <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-2xl shadow-emerald-100">
                        <Zap className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Global</p>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">Excelência Educacional</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-40 relative px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
             <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.5em] bg-emerald-50 px-8 py-3 rounded-full mb-10 inline-block border border-emerald-100">Inteligência Governamental</span>
             <h3 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">Inovação nominal em <br/> <span className="text-emerald-600">cada etapa.</span></h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                icon: <Globe className="h-10 w-10" />,
                title: "Localizador Smart",
                desc: "Vínculo automatizado baseado em coordenadas geográficas de alta precisão.",
                color: "bg-indigo-600",
                shadow: "shadow-indigo-100"
              },
              {
                icon: <Sparkles className="h-10 w-10" />,
                title: "Assistência IA",
                desc: "O 'Edu' processa dúvidas complexas e legislação educacional em segundos.",
                color: "bg-emerald-600",
                shadow: "shadow-emerald-100"
              },
              {
                icon: <CheckCircle2 className="h-10 w-10" />,
                title: "Transparência Total",
                desc: "Acompanhamento em tempo real da posição nominal do aluno na rede municipal.",
                color: "bg-slate-900",
                shadow: "shadow-slate-200"
              }
            ].map((item, idx) => (
              <div key={idx} className="group p-16 bg-white rounded-[5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 hover:-translate-y-8 transition-all duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className={`${item.color} w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-12 text-white ${item.shadow} group-hover:rotate-[15deg] transition-all duration-700 relative z-10 shadow-2xl`}>
                  {item.icon}
                </div>
                <h4 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter relative z-10">{item.title}</h4>
                <p className="text-slate-500 font-medium text-xl leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Refinado */}
      <footer className="py-24 bg-white border-t border-slate-100 m-4 rounded-[4rem] shadow-inner mt-auto">
        <div className="max-w-7xl mx-auto px-12 flex flex-col lg:flex-row justify-between items-center gap-16">
            <div className="flex items-center gap-5 group cursor-pointer">
                <div className="bg-slate-900 p-4 rounded-3xl group-hover:rotate-12 transition-transform shadow-2xl shadow-slate-200">
                  <GraduationCap className="h-8 w-8 text-emerald-400" />
                </div>
                <span className="font-black text-3xl text-slate-900 tracking-tighter uppercase">Educa<span className="text-emerald-600">Município</span></span>
            </div>
            <div className="flex flex-col items-center lg:items-end">
              <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em] mb-4">© 2025 • Itaberaba Digital • Gestão da Transformação</p>
              <div className="flex gap-8">
                 <Link to="/login" className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors">Sistema SME</Link>
                 <Link to="/schools" className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors">Mapa da Rede</Link>
                 <Link to="/status" className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors">Suporte Técnico</Link>
              </div>
            </div>
        </div>
      </footer>
    </div>
  );
};