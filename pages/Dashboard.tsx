import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from '../router';
import { 
  Users, School, AlertTriangle, TrendingUp, 
  UserCheck, Award, LayoutGrid, Building, Map,
  Sparkles, Activity, ShieldCheck, ChevronRight, Loader2,
  Calendar, Info, FileText
} from 'lucide-react';
import { UserRole } from '../types';

const MetricCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${colorClass} text-white shadow-sm`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
            </div>
        </div>
        {trend && (
            <div className="flex flex-col items-end">
                <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                    {trend}
                </span>
                <span className="text-[8px] font-bold text-slate-300 uppercase">vs mês ant.</span>
            </div>
        )}
    </div>
);

const ActionTile = ({ icon: Icon, title, description, to, color }: any) => (
    <Link to={to} className="group p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col h-full">
        <div className={`p-2.5 rounded-lg ${color} text-white w-fit mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
            <Icon className="h-5 w-5" />
        </div>
        <h4 className="font-bold text-slate-900 text-sm mb-1">{title}</h4>
        <p className="text-slate-500 text-[11px] leading-relaxed flex-1">{description}</p>
        <div className="mt-4 flex items-center text-blue-600 text-[9px] font-black uppercase tracking-widest group-hover:gap-2 transition-all">
            Gerenciar <ChevronRight className="h-3 w-3" />
        </div>
    </Link>
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
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Sincronizando Base SME...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-8 page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Módulo Administrativo</span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Ano Letivo 2025
                    </span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard de <span className="text-blue-600">Indicadores.</span></h1>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Ambiente SEED</p>
                    <p className="text-sm font-bold text-slate-900">{userData?.name}</p>
                </div>
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg">
                    {userData?.name?.charAt(0)}
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard title="Total Matriculados" value={stats.matriculados} icon={Users} colorClass="bg-blue-600" trend="+4.2%" />
            <MetricCard title="Educação Especial" value={stats.aee} icon={Award} colorClass="bg-pink-600" trend="+0.8%" />
            <MetricCard title="Pendências" value={stats.pendentes} icon={AlertTriangle} colorClass="bg-amber-500" />
            <MetricCard title="Unidades Escolares" value={schools.length} icon={School} colorClass="bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="card-requinte overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <LayoutGrid className="h-4 w-4 text-blue-600" /> Atividades Críticas
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) && (
                            <>
                                <ActionTile 
                                    icon={Map} 
                                    title="Geoprocessamento SME" 
                                    description="Análise espacial de demanda nominal e saturação por logradouro em Itaberaba." 
                                    to="/admin/map" 
                                    color="bg-blue-600"
                                />
                                <ActionTile 
                                    icon={Building} 
                                    title="Base de Dados Nominal" 
                                    description="Gestão centralizada de alocações, transferências e exportação de Censo INEP." 
                                    to="/admin/data" 
                                    color="bg-slate-800"
                                />
                                <ActionTile 
                                    icon={FileText} 
                                    title="Relatórios Estratégicos" 
                                    description="Indicadores de rendimento e fluxo por unidade de ensino." 
                                    to="/reports" 
                                    color="bg-emerald-600"
                                />
                                <ActionTile 
                                    icon={ShieldCheck} 
                                    title="Controle de Vagas" 
                                    description="Configuração de limites e triagem de documentação civil." 
                                    to="/schools" 
                                    color="bg-indigo-600"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <Sparkles className="h-8 w-8 mb-4 text-blue-400" />
                        <h3 className="text-xl font-bold mb-2 tracking-tight leading-tight">Suporte Inteligente 'Edu'</h3>
                        <p className="text-slate-400 text-[11px] leading-relaxed mb-6">Utilize o assistente para gerar relatórios rápidos sobre a rede municipal via linguagem natural.</p>
                        <button className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition">Ativar Assistente</button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-blue-600/10 rounded-full blur-2xl"></div>
                </div>

                <div className="card-requinte p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
                        <Info className="h-4 w-4 text-amber-500" /> Próximos Eventos
                    </h3>
                    <div className="space-y-4">
                        {[
                            { date: '15 Nov', title: 'Fechamento de Censo', type: 'Crítico' },
                            { date: '20 Nov', title: 'Conselho de Classe', type: 'Pedagógico' }
                        ].map((event, i) => (
                            <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="text-center min-w-[40px]">
                                    <p className="text-[10px] font-black text-slate-900 leading-none">{event.date.split(' ')[0]}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase">{event.date.split(' ')[1]}</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-800">{event.title}</p>
                                    <p className="text-[9px] text-slate-500">{event.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};