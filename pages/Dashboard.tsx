
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from '../router';
import { 
  Users, School, AlertTriangle, Bus, TrendingUp, PieChart, 
  Activity, CheckCircle, Clock, GraduationCap, Map as MapIcon, 
  ArrowRight, UserCheck, BookOpen, Award, FileText, LayoutGrid, Calendar, LogOut,
  // Fix: Added missing Info icon import
  Info
} from 'lucide-react';
import { SchoolType, UserRole } from '../types';

// Reaproveitando os charts leves do arquivo anterior
const SimpleCardStat = ({ title, value, icon: Icon, colorClass, subtext, onClick }: any) => (
    <div 
        onClick={onClick}
        className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group`}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${colorClass}`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
        {subtext && <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase flex items-center gap-1.5">
            <Activity className="h-3 w-3" /> {subtext}
        </p>}
    </div>
);

export const Dashboard: React.FC = () => {
  const { students, schools } = useData();
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
    if (role === UserRole.ADMIN_SME) return students;
    return students.filter(s => s.schoolId === userData?.schoolId || s.school === schools.find(sch => sch.id === userData?.schoolId)?.name);
  }, [students, role, userData, schools]);

  const stats = useMemo(() => ({
    total: schoolStudents.length,
    matriculados: schoolStudents.filter(s => s.status === 'Matriculado').length,
    pendentes: schoolStudents.filter(s => s.status === 'Pendente' || s.status === 'Em Análise').length,
    aee: schoolStudents.filter(s => s.specialNeeds).length,
    transporte: schoolStudents.filter(s => s.transportRequest).length
  }), [schoolStudents]);

  if (!role) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header de Boas Vindas Personalizado */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Painel de {role}</h1>
                <p className="text-slate-500 mt-1">Olá, {userData?.name}. Veja o que temos para hoje.</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
                <Calendar className="h-4 w-4 text-blue-500" />
                Letivo {new Date().getFullYear() + 1}
            </div>
        </div>

        {/* Estatísticas Rápidas baseadas no Perfil */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SimpleCardStat 
                title="Total Alunos" 
                value={stats.total} 
                icon={Users} 
                colorClass="bg-blue-100 text-blue-600" 
                subtext="Sob sua gestão"
                onClick={() => navigate('/admin/data')}
            />
            <SimpleCardStat 
                title="Matrículas" 
                value={stats.matriculados} 
                icon={CheckCircle} 
                colorClass="bg-green-100 text-green-600" 
                subtext={`${((stats.matriculados/stats.total)*100).toFixed(1)}% Efetivados`}
            />
            <SimpleCardStat 
                title="Pendentes" 
                value={stats.pendentes} 
                icon={AlertTriangle} 
                colorClass="bg-yellow-100 text-yellow-600" 
                subtext="Aguardando Ação"
                onClick={() => navigate('/status')}
            />
            <SimpleCardStat 
                title="Necess. Especiais" 
                value={stats.aee} 
                icon={Award} 
                colorClass="bg-pink-100 text-pink-600" 
                subtext="Atendimento AEE"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seção Principal: Tarefas do Dia */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-blue-600" /> Atividades Pendentes
                        </h3>
                    </div>
                    <div className="p-2">
                        {role === UserRole.TEACHER ? (
                            <div className="space-y-1">
                                <Link to="/performance" className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition group">
                                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all"><TrendingUp className="h-6 w-6" /></div>
                                    <div className="flex-1"><h4 className="font-bold text-slate-800">Lançar Notas - II Trimestre</h4><p className="text-xs text-slate-500">2 turmas aguardando fechamento</p></div>
                                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600" />
                                </Link>
                                <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition group cursor-pointer">
                                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all"><UserCheck className="h-6 w-6" /></div>
                                    <div className="flex-1"><h4 className="font-bold text-slate-800">Chamada do Dia</h4><p className="text-xs text-slate-500">Registre a frequência dos alunos agora</p></div>
                                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-600" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <Link to="/status" className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition group">
                                    <div className="bg-yellow-50 p-3 rounded-xl text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-all"><FileText className="h-6 w-6" /></div>
                                    <div className="flex-1"><h4 className="font-bold text-slate-800">Validar Pré-Matrículas</h4><p className="text-xs text-slate-500">{stats.pendentes} solicitações aguardando análise de documentos</p></div>
                                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-yellow-600" />
                                </Link>
                                <Link to="/reports" className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition group">
                                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><PieChart className="h-6 w-6" /></div>
                                    <div className="flex-1"><h4 className="font-bold text-slate-800">Consolidado da Rede</h4><p className="text-xs text-slate-500">Gere o relatório para a reunião de gestão</p></div>
                                    <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notificações / Avisos */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Info className="h-6 w-6 text-blue-400" /> Informe da Secretaria
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                            O prazo para fechamento do II Trimestre foi prorrogado até o dia 15/07. Certifique-se de que todos os diários de classe estejam sincronizados para evitar inconsistências no boletim online dos alunos.
                        </p>
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/20">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>

            {/* Coluna Lateral: Atalhos e Utilitários */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <LayoutGrid className="h-5 w-5 text-indigo-600" /> Ferramentas
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/performance" className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all text-center group">
                            <Award className="h-6 w-6 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase">Boletins</span>
                        </Link>
                        <Link to="/admin/data" className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-all text-center group">
                            <Users className="h-6 w-6 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase">Alunos</span>
                        </Link>
                        <Link to="/schools" className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition-all text-center group">
                            <School className="h-6 w-6 text-emerald-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase">Rede</span>
                        </Link>
                        <Link to="/external" className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-purple-50 hover:border-purple-100 transition-all text-center group">
                            <LayoutGrid className="h-6 w-6 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase">Apps</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-orange-500" /> Status da Sessão
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Último Acesso</span>
                            <span className="font-mono text-slate-700">Hoje, 08:42</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">IP de Origem</span>
                            <span className="font-mono text-slate-700">177.34.XX.XX</span>
                        </div>
                        <button 
                            onClick={() => { sessionStorage.clear(); navigate('/'); }}
                            className="w-full mt-2 py-2 border border-slate-200 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition flex items-center justify-center gap-2"
                        >
                            <LogOut className="h-3 w-3" /> Encerrar Conexão
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
