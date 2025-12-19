import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from '../router';
import { 
  Users, School, AlertTriangle, TrendingUp, 
  ArrowRight, UserCheck, Award, LayoutGrid, 
  GraduationCap, Building, Map,
  Sparkles, Activity, ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';

const ExecutiveWidget = ({ title, value, icon: Icon, colorClass, subtext, onClick }: any) => (
    <div 
        onClick={onClick}
        className="group relative bg-white p-12 rounded-[4rem] border border-slate-100 shadow-luxury flex flex-col justify-between hover:-translate-y-4 transition-all duration-700 cursor-pointer overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-64 h-64 opacity-[0.03] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-150 ${colorClass}`}></div>
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">{title}</p>
                <h3 className="text-8xl font-black text-slate-900 leading-none tracking-tighter text-display">{value}</h3>
            </div>
            <div className={`p-8 rounded-[2.5rem] transition-all group-hover:rotate-[12deg] group-hover:scale-110 shadow-2xl ${colorClass} text-white`}>
                <Icon className="h-10 w-10" />
            </div>
        </div>
        {subtext && (
            <div className="flex items-center gap-4 mt-12 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse glow-emerald"></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{subtext}</p>
            </div>
        )}
    </div>
);

export const Dashboard: React.FC = () => {
  const { students, schools, isLoading } = useData();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const savedRole = sessionStorage.getItem('user_role') as UserRole;
    const data = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    if (!savedRole) { navigate('/login'); return; }
    setRole(savedRole);
    setUserData(data);
  }, [navigate]);

  const stats = useMemo(() => ({
    total: students.length,
    matriculados: students.filter(s => s.status === 'Matriculado').length,
    pendentes: students.filter(s => s.status !== 'Matriculado').length,
    aee: students.filter(s => s.specialNeeds).length
  }), [students]);

  if (isLoading) return (
    <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-12">
        <div className="relative w-40 h-40">
            <div className="absolute inset-0 border-[12px] border-emerald-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-[12px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <GraduationCap className="h-16 w-16 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-black text-emerald-500 uppercase tracking-[0.6em]">Sincronizando Rede</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-6 animate-pulse">Base de Dados Itaberaba Digital</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-8 page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12">
            <div className="fade-in-premium">
                <div className="flex items-center gap-5 mb-10">
                    <span className="px-7 py-2.5 bg-emerald-600 text-white text-[11px] font-black uppercase rounded-full tracking-[0.3em] shadow-2xl border border-emerald-500">Núcleo Estratégico</span>
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-200"></div>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-ultra">Vigência 2025</span>
                </div>
                <h1 className="text-9xl font-black text-slate-900 tracking-tighter leading-none mb-10 text-display uppercase">Comando <br/><span className="text-emerald-600">Digital.</span></h1>
                <p className="text-slate-400 text-3xl font-medium tracking-tight">Gestor: <span className="text-slate-900 font-black">{userData?.name}</span></p>
            </div>
            
            <div className="flex items-center gap-8 fade-in-premium" style={{animationDelay: '0.2s'}}>
                <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-luxury text-white flex items-center gap-10 group hover:scale-105 transition-all duration-700">
                    <div className="bg-emerald-600 p-6 rounded-[2.2rem] group-hover:rotate-12 transition-transform shadow-2xl">
                        <Activity className="h-10 w-10" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-40 tracking-ultra mb-3">Rede Integrada</p>
                        <p className="text-4xl font-black flex items-center gap-3">Ativo <ShieldCheck className="h-8 w-8 text-emerald-400" /></p>
                    </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24 fade-in-premium" style={{animationDelay: '0.4s'}}>
            <ExecutiveWidget title="Matriculados" value={stats.matriculados} icon={Users} colorClass="bg-emerald-600" subtext="Censo Nominal Ativo" onClick={() => navigate('/admin/data')} />
            <ExecutiveWidget title="Esp. Ativo" value={stats.aee} icon={Award} colorClass="bg-pink-600" subtext="Atendimento AEE" />
            <ExecutiveWidget title="Pendências" value={stats.pendentes} icon={AlertTriangle} colorClass="bg-amber-500" subtext="Triagem em Curso" onClick={() => navigate('/status')} />
            <ExecutiveWidget title="Unidades" value={schools.length} icon={School} colorClass="bg-blue-600" subtext="Rede Municipal" onClick={() => navigate('/schools')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 fade-in-premium" style={{animationDelay: '0.6s'}}>
            <div className="lg:col-span-8 space-y-16">
                <div className="bg-white rounded-[5rem] shadow-luxury border border-slate-100 overflow-hidden group">
                    <div className="p-16 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-black text-slate-900 flex items-center gap-8 text-5xl tracking-tighter">
                            <LayoutGrid className="h-12 w-12 text-emerald-600" /> Operação SME
                        </h3>
                    </div>
                    <div className="p-16 grid md:grid-cols-2 gap-12">
                        {role === UserRole.TEACHER && (
                            <>
                                <Link to="/journal" className="group/card flex flex-col gap-12 p-16 bg-emerald-50/30 rounded-[4rem] border border-emerald-100 hover:bg-emerald-600 transition-all duration-1000">
                                    <div className="bg-emerald-600 p-10 rounded-[2.5rem] text-white shadow-2xl group-hover/card:bg-white group-hover/card:text-emerald-600 transition-colors self-start"><UserCheck className="h-12 w-12" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover/card:text-white text-4xl tracking-tighter mb-4">Diário de Bordo</h4>
                                        <p className="text-slate-500 group-hover/card:text-emerald-100 text-xl font-medium leading-relaxed">Controle nominal de frequência e planos pedagógicos.</p>
                                    </div>
                                    <ArrowRight className="h-12 w-12 text-emerald-600 group-hover/card:text-white transition-all group-hover/card:translate-x-8" />
                                </Link>
                                <Link to="/performance" className="group/card flex flex-col gap-12 p-16 bg-blue-50/30 rounded-[4rem] border border-blue-100 hover:bg-blue-600 transition-all duration-1000">
                                    <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-2xl group-hover/card:bg-white group-hover/card:text-blue-600 transition-colors self-start"><TrendingUp className="h-12 w-12" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover/card:text-white text-4xl tracking-tighter mb-4">Indicadores BNCC</h4>
                                        <p className="text-slate-500 group-hover/card:text-blue-100 text-xl font-medium leading-relaxed">Matriz de competências e rendimento acadêmico.</p>
                                    </div>
                                    <ArrowRight className="h-12 w-12 text-blue-600 group-hover/card:text-white transition-all group-hover/card:translate-x-8" />
                                </Link>
                            </>
                        )}
                        {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) && (
                            <>
                                <Link to="/admin/map" className="group/card flex flex-col gap-12 p-16 bg-emerald-50/30 rounded-[4rem] border border-emerald-100 hover:bg-emerald-600 transition-all duration-1000">
                                    <div className="bg-emerald-600 p-10 rounded-[2.5rem] text-white shadow-2xl group-hover/card:bg-white group-hover/card:text-emerald-600 transition-colors self-start"><Map className="h-12 w-12" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover/card:text-white text-4xl tracking-tighter mb-4">Geoprocess 2025</h4>
                                        <p className="text-slate-500 group-hover/card:text-emerald-100 text-xl font-medium leading-relaxed">Análise espacial de demanda e saturação de rede.</p>
                                    </div>
                                    <ArrowRight className="h-12 w-12 text-emerald-600 group-hover/card:text-white transition-all group-hover/card:translate-x-8" />
                                </Link>
                                <Link to="/admin/data" className="group/card flex flex-col gap-12 p-16 bg-slate-900 rounded-[4rem] border border-slate-800 hover:bg-slate-800 transition-all duration-1000">
                                    <div className="bg-white p-10 rounded-[2.5rem] text-slate-900 shadow-2xl self-start group-hover/card:scale-110 transition-transform"><Building className="h-12 w-12" /></div>
                                    <div>
                                        <h4 className="font-black text-white text-4xl tracking-tighter mb-4">Central SME</h4>
                                        <p className="text-slate-400 group-hover/card:text-slate-200 text-xl font-medium leading-relaxed">Administração central de vagas e protocolos.</p>
                                    </div>
                                    <ArrowRight className="h-12 w-12 text-white transition-all group-hover/card:translate-x-8" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-12 animate-luxury-float">
                <div className="bg-emerald-600 p-16 rounded-[5rem] text-white shadow-luxury relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
                    <Sparkles className="h-20 w-20 mb-12 opacity-50" />
                    <h3 className="text-6xl font-black tracking-tighter leading-none mb-8">Assistência Digital.</h3>
                    <p className="text-emerald-50 text-2xl font-medium leading-relaxed mb-16">O sistema "Edu" processa solicitações nominais em tempo real através da rede municipal.</p>
                    <div className="pt-12 border-t border-emerald-500/50 flex items-center justify-between">
                        <span className="text-[12px] font-black uppercase tracking-ultra">Gov Tech • 2025</span>
                        <div className="h-4 w-4 rounded-full bg-white animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};