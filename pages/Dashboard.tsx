
import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from '../router';
import { 
  Users, School, AlertTriangle, TrendingUp, PieChart, 
  Activity, CheckCircle, ArrowRight, UserCheck, 
  Award, FileText, LayoutGrid, Calendar, LogOut, Info, Loader2, BookOpen, ShieldCheck, Database, GraduationCap
} from 'lucide-react';
import { UserRole } from '../types';

const PremiumStatCard = ({ title, value, icon: Icon, colorClass, subtext, onClick }: any) => (
    <div 
        onClick={onClick}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 ${colorClass}`}></div>
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{title}</p>
                <h3 className="text-5xl font-black text-slate-900 leading-none">{value}</h3>
            </div>
            <div className={`p-5 rounded-3xl transition-all group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg ${colorClass} text-white`}>
                <Icon className="h-7 w-7" />
            </div>
        </div>
        {subtext && <p className="text-[10px] font-black text-slate-400 mt-8 uppercase flex items-center gap-2 tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span> {subtext}
        </p>}
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
    setRole(savedRole);
    setUserData(data);
  }, []);

  const schoolStudents = useMemo(() => {
    if (!role || role === UserRole.ADMIN_SME) return students;
    return students.filter(s => s.schoolId === userData?.schoolId || s.school?.includes(userData?.schoolId));
  }, [students, role, userData]);

  const stats = useMemo(() => ({
    total: schoolStudents.length,
    matriculados: schoolStudents.filter(s => s.status === 'Matriculado').length,
    pendentes: schoolStudents.filter(s => s.status !== 'Matriculado').length,
    aee: schoolStudents.filter(s => s.specialNeeds).length
  }), [schoolStudents]);

  if (isLoading) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <GraduationCap className="h-8 w-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Sincronizando Ecossistema...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <header className="mb-14 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase rounded-full tracking-widest">Cloud Active</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Painel de {role}</h1>
                <p className="text-slate-500 mt-4 text-lg font-medium">Bem-vindo(a) de volta, <span className="text-indigo-600 font-black">{userData?.name}</span>.</p>
            </div>
            
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
                <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Database className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Servidor Regional</p>
                        <p className="text-sm font-black text-emerald-500">Conectado • Supabase</p>
                    </div>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <PremiumStatCard 
                title="Rede de Alunos" 
                value={stats.total} 
                icon={Users} 
                colorClass="bg-indigo-600" 
                subtext="Dados Atualizados"
                onClick={() => navigate('/admin/data')}
            />
            <PremiumStatCard 
                title="Taxa de Ocupação" 
                value={`${((stats.matriculados/Math.max(stats.total, 1))*100).toFixed(0)}%`} 
                icon={CheckCircle} 
                colorClass="bg-emerald-500" 
                subtext={`${stats.matriculados} Vagas Ativas`}
            />
            <PremiumStatCard 
                title="Pré-Matrículas" 
                value={stats.pendentes} 
                icon={AlertTriangle} 
                colorClass="bg-amber-500" 
                subtext="Análise Documental"
                onClick={() => navigate('/status')}
            />
            <PremiumStatCard 
                title="AEE Atendimento" 
                value={stats.aee} 
                icon={Award} 
                colorClass="bg-pink-600" 
                subtext="Educação Inclusiva"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
                <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="font-black text-slate-900 flex items-center gap-4 text-2xl tracking-tight">
                                <LayoutGrid className="h-8 w-8 text-indigo-600" /> Ações do Dia
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">Sincronização em tempo real com a Secretaria</p>
                        </div>
                    </div>
                    <div className="p-8 grid md:grid-cols-2 gap-6">
                        {role === UserRole.TEACHER && (
                            <>
                                <Link to="/journal" className="flex flex-col gap-6 p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 hover:bg-indigo-600 group transition-all duration-500">
                                    <div className="bg-indigo-600 p-5 rounded-3xl text-white shadow-xl group-hover:bg-white group-hover:text-indigo-600 transition-colors self-start"><UserCheck className="h-8 w-8" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover:text-white text-xl">Frequência Digital</h4>
                                        <p className="text-sm text-slate-500 group-hover:text-indigo-100 mt-2">Chamada e registro de faltas integrados.</p>
                                    </div>
                                    <ArrowRight className="h-8 w-8 text-indigo-600 group-hover:text-white transition-all group-hover:translate-x-2" />
                                </Link>
                                <Link to="/performance" className="flex flex-col gap-6 p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 hover:bg-emerald-500 group transition-all duration-500">
                                    <div className="bg-emerald-500 p-5 rounded-3xl text-white shadow-xl group-hover:bg-white group-hover:text-emerald-600 transition-colors self-start"><TrendingUp className="h-8 w-8" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover:text-white text-xl">Lançamento de Notas</h4>
                                        <p className="text-sm text-slate-500 group-hover:text-emerald-100 mt-2">Avaliações oficiais e boletim municipal.</p>
                                    </div>
                                    <ArrowRight className="h-8 w-8 text-emerald-500 group-hover:text-white transition-all group-hover:translate-x-2" />
                                </Link>
                            </>
                        )}
                        {(role === UserRole.DIRECTOR || role === UserRole.ADMIN_SME) && (
                            <>
                                <Link to="/status" className="flex flex-col gap-6 p-8 bg-amber-50/50 rounded-[2.5rem] border border-amber-100 hover:bg-amber-500 group transition-all duration-500">
                                    <div className="bg-amber-500 p-5 rounded-3xl text-white shadow-xl group-hover:bg-white group-hover:text-amber-500 transition-colors self-start"><FileText className="h-8 w-8" /></div>
                                    <div>
                                        <h4 className="font-black text-slate-900 group-hover:text-white text-xl">Validar Documentos</h4>
                                        <p className="text-sm text-slate-500 group-hover:text-amber-100 mt-2">{stats.pendentes} solicitações aguardando conferência.</p>
                                    </div>
                                    <ArrowRight className="h-8 w-8 text-amber-500 group-hover:text-white transition-all group-hover:translate-x-2" />
                                </Link>
                                <Link to="/admin/data" className="flex flex-col gap-6 p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 hover:bg-slate-800 group transition-all duration-500">
                                    <div className="bg-white p-5 rounded-3xl text-slate-900 shadow-xl self-start"><LayoutGrid className="h-8 w-8" /></div>
                                    <div>
                                        <h4 className="font-black text-white text-xl">Gestão de Turmas</h4>
                                        <p className="text-sm text-slate-400 group-hover:text-slate-300 mt-2">Criação de classes, enturmação e censo.</p>
                                    </div>
                                    <ArrowRight className="h-8 w-8 text-white transition-all group-hover:translate-x-2" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                    <h3 className="font-black text-slate-900 mb-8 flex items-center gap-4 text-xl tracking-tight">
                        <Calendar className="h-6 w-6 text-indigo-600" /> Agenda Letiva
                    </h3>
                    <div className="space-y-6">
                        {[
                            { day: '15', month: 'OUT', title: 'Conselho Pedagógico', type: 'Reunião' },
                            { day: '20', month: 'NOV', title: 'Fechamento II Unid.', type: 'Sistema' }
                        ].map((event, i) => (
                            <div key={i} className="flex items-center gap-6 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                                <div className="bg-white p-3 rounded-2xl text-center w-16 border border-slate-200">
                                    <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">{event.month}</p>
                                    <p className="text-2xl font-black text-indigo-600 leading-none">{event.day}</p>
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 leading-tight">{event.title}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{event.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <button 
                        onClick={() => { sessionStorage.clear(); navigate('/'); }}
                        className="w-full py-5 bg-white/10 hover:bg-white text-sm font-black text-white hover:text-red-600 rounded-3xl transition-all flex items-center justify-center gap-3 border border-white/20 hover:border-white shadow-lg"
                    >
                        <LogOut className="h-5 w-5" /> Encerrar Sessão
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-3 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" /> 
                        Security: Verified
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
