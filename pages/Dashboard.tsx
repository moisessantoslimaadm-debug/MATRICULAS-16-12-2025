import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from '../router';
import { 
  Users, School, AlertTriangle, TrendingUp, 
  ArrowRight, UserCheck, Award, LayoutGrid, 
  GraduationCap, CloudLightning, Building, Map
} from 'lucide-react';
import { UserRole } from '../types';

const PremiumStatCard = ({ title, value, icon: Icon, colorClass, subtext, onClick }: any) => (
    <div 
        onClick={onClick}
        className="group relative bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-40 h-40 opacity-[0.05] rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-150 group-hover:opacity-10 ${colorClass}`}></div>
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{title}</p>
                <h3 className="text-6xl font-black text-slate-900 leading-none tracking-tighter">{value}</h3>
            </div>
            <div className={`p-6 rounded-[2rem] transition-all group-hover:rotate-[15deg] group-hover:scale-110 shadow-xl ${colorClass} text-white`}>
                <Icon className="h-8 w-8" />
            </div>
        </div>
        {subtext && (
            <div className="flex items-center gap-3 mt-10">
                <div className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subtext}</p>
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
    <div className="h-screen bg-white flex flex-col items-center justify-center gap-8">
        <div className="relative">
            <div className="w-28 h-28 border-[8px] border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <GraduationCap className="h-12 w-12 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-[0.4em]">EducaMunicípio</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.5em] mt-3 animate-pulse">Base Nominal Ativa...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-16">
      <div className="max-w-7xl mx-auto px-8">
        <header className="mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="flex items-center gap-4 mb-6">
                    <span className="px-5 py-2 bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase rounded-full tracking-ultra border border-emerald-100 glow-emerald">Rede Digital 2025</span>
                    <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                    <span className="text-slate-400 text-[11px] font-black uppercase tracking-ultra">{new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6">Painel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-500">{role}</span></h1>
                <p className="text-slate-500 text-2xl font-medium tracking-tight">
                    Gestor: <span className="text-slate-900 font-black">{userData?.name}</span>
                </p>
            </div>
            
            <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-8 duration-1000">
                <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl shadow-slate-200 text-white flex items-center gap-8 group hover:scale-105 transition-transform duration-700">
                    <div className="bg-emerald-600 p-5 rounded-[2rem] group-hover:rotate-12 transition-transform shadow-lg">
                        <CloudLightning className="h-10 w-10" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase opacity-50 tracking-ultra">SME ITABERABA</p>
                        <p className="text-3xl font-black">Status: Online</p>
                    </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <PremiumStatCard 
                title="Matriculados" 
                value={stats.matriculados} 
                icon={Users} 
                colorClass="bg-emerald-600" 
                subtext="Censo Escolar Ativo"
                onClick={() => navigate('/admin/data')}
            />
            <PremiumStatCard 
                title="Educação Especial" 
                value={stats.aee} 
                icon={Award} 
                colorClass="bg-pink-600" 
                subtext="Atendimento AEE"
            />
            <PremiumStatCard 
                title="Solicitações" 
                value={stats.pendentes} 
                icon={AlertTriangle} 
                colorClass="bg-amber-500" 
                subtext="Triagem de Rede"
                onClick={() => navigate('/status')}
            />
            <PremiumStatCard 
                title="Unidades" 
                value={schools.length} 
                icon={School} 
                colorClass="bg-blue-600" 
                subtext="Rede Municipal Ativa"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
                <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden group">
                    <div className="p-14 border-b border-slate-50 flex justify-between items-center bg-slate-50/40">
                        <div>
                            <h3 className="font-black text-slate-900 flex items-center gap-5 text-4xl tracking-tighter">
                                <LayoutGrid className="h-10 w-10 text-emerald-600" /> Ecossistema SME
                            </h3>
                        </div>
                    </div>
                    <div className="p-12 grid md:grid-cols-2 gap-10">
                        {role === UserRole.TEACHER && (
                            <>
                                <Link to="/journal" className="group/card flex flex-col gap-10 p-12 bg-emerald-50/50 rounded-[3.5rem] border border-emerald-100 hover:bg-emerald-600 transition-all duration-700">
                                    <div className="bg-emerald-600 p-8 rounded-[2rem] text-white shadow-xl group-hover/card:bg-white group-hover/card:text-emerald-600 transition-colors self-start"><UserCheck className="h-10 w-10" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover/card:text-white text-3xl tracking-tighter">Diário Digital</h4>
                                        <p className="text-slate-500 group-hover/card:text-emerald-100 mt-3 text-lg font-medium">Controle nominal de frequência.</p>
                                    </div>
                                    <ArrowRight className="h-10 w-10 text-emerald-600 group-hover/card:text-white transition-all group-hover/card:translate-x-6" />
                                </Link>
                                <Link to="/performance" className="group/card flex flex-col gap-10 p-12 bg-blue-50/50 rounded-[3.5rem] border border-blue-100 hover:bg-blue-600 transition-all duration-700">
                                    <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl group-hover/card:bg-white group-hover/card:text-blue-600 transition-colors self-start"><TrendingUp className="h-10 w-10" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover/card:text-white text-3xl tracking-tighter">Indicadores</h4>
                                        <p className="text-slate-500 group-hover/card:text-blue-100 mt-3 text-lg font-medium">Lançamento de conceitos BNCC.</p>
                                    </div>
                                    <ArrowRight className="h-10 w-10 text-blue-600 group-hover/card:text-white transition-all group-hover/card:translate-x-6" />
                                </Link>
                            </>
                        )}
                        {(role === UserRole.DIRECTOR || role === UserRole.ADMIN_SME) && (
                            <>
                                <Link to="/admin/map" className="group/card flex flex-col gap-10 p-12 bg-emerald-50/50 rounded-[3.5rem] border border-emerald-100 hover:bg-emerald-600 transition-all duration-700">
                                    <div className="bg-emerald-600 p-8 rounded-[2rem] text-white shadow-xl group-hover/card:bg-white group-hover/card:text-emerald-600 transition-colors self-start"><Map className="h-10 w-10" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover/card:text-white text-3xl tracking-tighter">Geoprocess</h4>
                                        <p className="text-slate-500 group-hover/card:text-emerald-100 mt-3 text-lg font-medium">Análise macro de demanda escolar.</p>
                                    </div>
                                    <ArrowRight className="h-10 w-10 text-emerald-600 group-hover/card:text-white transition-all group-hover/card:translate-x-6" />
                                </Link>
                                <Link to="/admin/data" className="group/card flex flex-col gap-10 p-12 bg-slate-900 rounded-[3.5rem] border border-slate-800 hover:bg-slate-800 transition-all duration-700">
                                    <div className="bg-white p-8 rounded-[2.2rem] text-slate-900 shadow-xl self-start group-hover/card:scale-110 transition-transform"><Building className="h-10 w-10" /></div>
                                    <div>
                                        <h4 className="font-black text-white text-3xl tracking-tighter">Gestão de Rede</h4>
                                        <p className="text-slate-400 group-hover/card:text-slate-200 mt-3 text-lg font-medium">Controle nominal e vagas totais.</p>
                                    </div>
                                    <ArrowRight className="h-10 w-10 text-white transition-all group-hover/card:translate-x-6" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};