import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from '../router';
import { 
  Users, School, AlertTriangle, TrendingUp, CheckCircle, 
  ArrowRight, UserCheck, Award, FileText, LayoutGrid, 
  Calendar, Loader2, BookOpen, GraduationCap,
  CloudLightning, Building, Map
} from 'lucide-react';
import { UserRole } from '../types';

const PremiumStatCard = ({ title, value, icon: Icon, colorClass, subtext, onClick }: any) => (
    <div 
        onClick={onClick}
        className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-[0.05] rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 group-hover:opacity-10 ${colorClass}`}></div>
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{title}</p>
                <h3 className="text-5xl font-black text-slate-900 leading-none tracking-tighter">{value}</h3>
            </div>
            <div className={`p-5 rounded-3xl transition-all group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg ${colorClass} text-white`}>
                <Icon className="h-7 w-7" />
            </div>
        </div>
        {subtext && (
            <div className="flex items-center gap-2 mt-8">
                <div className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
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
    <div className="h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="relative">
            <div className="w-24 h-24 border-[6px] border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
            <GraduationCap className="h-10 w-10 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">EducaMunicípio</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 animate-pulse">Sincronizando Rede Municipal...</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <header className="mb-14 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full tracking-widest border border-emerald-100">Matrícula Digital 2025</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">Painel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-500">{role}</span></h1>
                <p className="text-slate-500 text-xl font-medium flex items-center gap-2">
                    Operador: <span className="text-slate-900 font-black">{userData?.name}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                    <span className="text-sm uppercase tracking-widest text-slate-400">{userData?.schoolName || 'Gestão SME Itaberaba'}</span>
                </p>
            </div>
            
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-8 duration-1000">
                <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-white flex items-center gap-6 group hover:scale-105 transition-transform duration-500">
                    <div className="bg-emerald-600 p-4 rounded-3xl group-hover:rotate-12 transition-transform shadow-lg">
                        <CloudLightning className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-50 tracking-widest">Status da Rede</p>
                        <p className="text-2xl font-black">100% Digital</p>
                    </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <PremiumStatCard 
                title="Total Matriculados" 
                value={stats.matriculados} 
                icon={Users} 
                colorClass="bg-emerald-600" 
                subtext="Confirmados na Rede"
                onClick={() => navigate('/admin/data')}
            />
            <PremiumStatCard 
                title="Suporte AEE" 
                value={stats.aee} 
                icon={Award} 
                colorClass="bg-pink-600" 
                subtext="Inclusão Ativa"
            />
            <PremiumStatCard 
                title="Solicitações" 
                value={stats.pendentes} 
                icon={AlertTriangle} 
                colorClass="bg-amber-500" 
                subtext="Pendente Triagem"
                onClick={() => navigate('/status')}
            />
            <PremiumStatCard 
                title="Escolas Ativas" 
                value={schools.length} 
                icon={School} 
                colorClass="bg-blue-600" 
                subtext="Unidades de Ensino"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
                <div className="bg-white rounded-[3.5rem] shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden group">
                    <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="font-black text-slate-900 flex items-center gap-4 text-3xl tracking-tight">
                                <LayoutGrid className="h-9 w-9 text-emerald-600" /> Cockpit de Gestão
                            </h3>
                            <p className="text-slate-400 text-sm mt-2 font-medium">Acesso rápido aos módulos administrativos</p>
                        </div>
                    </div>
                    <div className="p-10 grid md:grid-cols-2 gap-8">
                        {role === UserRole.TEACHER && (
                            <>
                                <Link to="/journal" className="group/card flex flex-col gap-8 p-10 bg-emerald-50/50 rounded-[3rem] border border-emerald-100 hover:bg-emerald-600 transition-all duration-700">
                                    <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl group-hover/card:bg-white group-hover/card:text-emerald-600 transition-colors self-start"><UserCheck className="h-8 w-8" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover/card:text-white text-2xl tracking-tight">Diário Digital</h4>
                                        <p className="text-slate-500 group-hover/card:text-emerald-100 mt-2 font-medium">Controle nominal de frequência e rendimento.</p>
                                    </div>
                                    <ArrowRight className="h-8 w-8 text-emerald-600 group-hover/card:text-white transition-all group-hover/card:translate-x-4" />
                                </Link>
                                <Link to="/performance" className="group/card flex flex-col gap-8 p-10 bg-blue-50/50 rounded-[3rem] border border-blue-100 hover:bg-blue-600 transition-all duration-700">
                                    <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl group-hover/card:bg-white group-hover/card:text-blue-600 transition-colors self-start"><TrendingUp className="h-8 w-8" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover/card:text-white text-2xl tracking-tight">Indicadores</h4>
                                        <p className="text-slate-500 group-hover/card:text-blue-100 mt-2 font-medium">Monitoramento do progresso acadêmico da turma.</p>
                                    </div>
                                    <ArrowRight className="h-8 w-8 text-blue-600 group-hover/card:text-white transition-all group-hover/card:translate-x-4" />
                                </Link>
                            </>
                        )}
                        {(role === UserRole.DIRECTOR || role === UserRole.ADMIN_SME) && (
                            <>
                                <Link to="/admin/map" className="group/card flex flex-col gap-8 p-10 bg-emerald-50/50 rounded-[3rem] border border-emerald-100 hover:bg-emerald-600 transition-all duration-700">
                                    <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl group-hover/card:bg-white group-hover/card:text-emerald-600 transition-colors self-start"><Map className="h-8 w-8" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover/card:text-white text-2xl tracking-tight">Geolocalização</h4>
                                        <p className="text-slate-500 group-hover/card:text-emerald-100 mt-2 font-medium">Mapa de calor e densidade de demanda por bairro.</p>
                                    </div>
                                    <ArrowRight className="h-8 w-8 text-emerald-600 group-hover/card:text-white transition-all group-hover/card:translate-x-4" />
                                </Link>
                                <Link to="/admin/data" className="group/card flex flex-col gap-8 p-10 bg-slate-900 rounded-[3rem] border border-slate-800 hover:bg-slate-800 transition-all duration-700">
                                    <div className="bg-white p-6 rounded-[2rem] text-slate-900 shadow-xl self-start group-hover/card:scale-110 transition-transform"><Building className="h-8 w-8" /></div>
                                    <div>
                                        <h4 className="font-black text-white text-2xl tracking-tight">Base de Dados</h4>
                                        <p className="text-slate-400 group-hover/card:text-slate-200 mt-2 font-medium">Gestão nominal de matrículas e quadro escolar.</p>
                                    </div>
                                    <ArrowRight className="h-8 w-8 text-white transition-all group-hover/card:translate-x-4" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-slate-100 border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-10 flex items-center gap-4 text-2xl tracking-tight">
                        <Calendar className="h-7 w-7 text-emerald-600" /> Agenda 2025
                    </h3>
                    <div className="space-y-8">
                        {[
                            { day: '30', month: 'NOV', title: 'Matrículas Regulares', type: 'Prazo Limite', color: 'bg-red-50 text-red-600' },
                            { day: '15', month: 'DEZ', title: 'Rematrícula Automática', type: 'SME / Itaberaba', color: 'bg-emerald-50 text-emerald-700' }
                        ].map((event, i) => (
                            <div key={i} className="flex items-center gap-8 group cursor-pointer">
                                <div className="bg-white p-4 rounded-3xl text-center w-20 border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                                    <p className="text-[10px] font-black text-slate-300 uppercase mb-1">{event.month}</p>
                                    <p className="text-3xl font-black text-slate-900">{event.day}</p>
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-slate-800 text-lg leading-tight group-hover:text-emerald-600 transition-colors">{event.title}</p>
                                    <p className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mt-2 ${event.color}`}>{event.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CloudLightning className="h-4 w-4 text-amber-500" /> Sincronização
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            A base do Educacenso Itaberaba foi atualizada há <span className="text-slate-900 font-bold">2 minutos</span>. 
                            Todos os dados nominais estão em conformidade com o MEC.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};