import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from '../router';
import { 
  Users, School, AlertTriangle, TrendingUp, 
  ArrowRight, UserCheck, Award, LayoutGrid, 
  GraduationCap, Building, Map,
  Sparkles, Activity, ShieldCheck, ChevronRight,
  // Added Loader2 to fix the compilation error
  Loader2
} from 'lucide-react';
import { UserRole } from '../types';

const ExecutiveWidget = ({ title, value, icon: Icon, colorClass, subtext, onClick }: any) => (
    <div 
        onClick={onClick}
        className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-all cursor-pointer"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl shadow-sm ${colorClass} text-white`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
        {subtext && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                {subtext}
            </p>
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
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Sincronizando Base INEP...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-8 page-transition">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase rounded-md tracking-wider">Censo Digital</span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Base Territorial 2025</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Painel de <span className="text-blue-600">Gestão.</span></h1>
            </div>
            
            <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="bg-slate-100 p-2 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Usuário Autenticado</p>
                    <p className="text-sm font-bold text-slate-900">{userData?.name}</p>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ExecutiveWidget title="Total Matriculados" value={stats.matriculados} icon={Users} colorClass="bg-emerald-600" subtext="Dados Nominais" onClick={() => navigate('/admin/data')} />
            <ExecutiveWidget title="Educação Especial" value={stats.aee} icon={Award} colorClass="bg-pink-600" subtext="Alunos com Laudo" />
            <ExecutiveWidget title="Pendências" value={stats.pendentes} icon={AlertTriangle} colorClass="bg-amber-500" subtext="Em Triagem" onClick={() => navigate('/status')} />
            <ExecutiveWidget title="Unidades Escolares" value={schools.length} icon={School} colorClass="bg-blue-600" subtext="Rede Municipal" onClick={() => navigate('/schools')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="card-requinte overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-3 text-lg">
                            <LayoutGrid className="h-5 w-5 text-blue-600" /> Atividades Administrativas
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) && (
                            <>
                                <Link to="/admin/map" className="group flex flex-col p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                                    <Map className="h-8 w-8 text-blue-600 mb-4" />
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">Mapa de Calor Demográfico</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed flex-1">Análise espacial de demanda e saturação por bairro.</p>
                                    <div className="mt-4 flex items-center text-blue-600 text-[10px] font-bold uppercase tracking-wider">Acessar Geoprocess <ChevronRight className="h-4 w-4 ml-1" /></div>
                                </Link>
                                <Link to="/admin/data" className="group flex flex-col p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                                    <Building className="h-8 w-8 text-blue-600 mb-4" />
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">Base de Dados Nominal</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed flex-1">Gestão central de alocações e exportação de Censo.</p>
                                    <div className="mt-4 flex items-center text-blue-600 text-[10px] font-bold uppercase tracking-wider">Gerenciar Rede <ChevronRight className="h-4 w-4 ml-1" /></div>
                                </Link>
                            </>
                        )}
                        {role === UserRole.TEACHER && (
                            <>
                                <Link to="/journal" className="group flex flex-col p-6 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all">
                                    <UserCheck className="h-8 w-8 text-emerald-600 mb-4" />
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">Registro de Classe</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed flex-1">Lançamento de frequência e ocorrências pedagógicas.</p>
                                    <div className="mt-4 flex items-center text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Abrir Diário <ChevronRight className="h-4 w-4 ml-1" /></div>
                                </Link>
                                <Link to="/performance" className="group flex flex-col p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                                    <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">Avaliação BNCC</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed flex-1">Lançamento de conceitos e acompanhamento de metas.</p>
                                    <div className="mt-4 flex items-center text-blue-600 text-[10px] font-bold uppercase tracking-wider">Ver Rendimento <ChevronRight className="h-4 w-4 ml-1" /></div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden">
                    <Sparkles className="h-10 w-10 mb-6 text-blue-400 opacity-80" />
                    <h3 className="text-2xl font-bold mb-4 tracking-tight leading-tight">Suporte Inteligente ao Gestor.</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">Utilize o assistente 'Edu' para gerar relatórios rápidos ou tirar dúvidas sobre a legislação municipal.</p>
                    <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <span>Status: Operacional</span>
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};