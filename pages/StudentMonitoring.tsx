import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from '../router';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
    ArrowLeft, User, BookOpen, MessageSquare, TrendingUp, Award, 
    FileText, MapPin, CreditCard, Layers, Download, Printer, 
    ShieldCheck, Activity, Zap, GraduationCap, ChevronRight
} from 'lucide-react';
import { RegistryStudent, TeacherNote, PerformanceRow } from '../types';

const MetricCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} text-white shadow-sm`}>
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
    </div>
);

export const StudentMonitoring: React.FC = () => {
    const { students, updateStudents } = useData();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const studentId = params.get('id');

    const [student, setStudent] = useState<RegistryStudent | null>(null);
    const [activeTab, setActiveTab] = useState<'pedagogico' | 'cadastro' | 'movimento' | 'diario'>('pedagogico');

    useEffect(() => {
        if (studentId) {
            const found = students.find(s => s.id === studentId);
            if (found) setStudent(found);
        }
    }, [studentId, students]);

    if (!student) return null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-8 page-transition">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-sm overflow-hidden">
                                {student.photo ? <img src={student.photo} className="w-full h-full object-cover" /> : <User className="h-10 w-10 text-slate-200 mx-auto mt-6" />}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 rounded-lg text-white shadow-md">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase">INEP: {student.inepId || 'N/A'}</span>
                                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-emerald-100">{student.status}</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2">{student.name}</h1>
                            <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-blue-600" /> {student.grade} • {student.className}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                         <button onClick={() => window.print()} className="p-3 bg-white border border-slate-300 text-slate-500 rounded-xl hover:text-blue-600 transition shadow-sm"><Printer className="h-5 w-5" /></button>
                         <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition shadow-sm">
                            <Download className="h-4 w-4" /> Exportar Prontuário
                         </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <MetricCard icon={Activity} label="Frequência" value={`${((student.attendance?.presentDays || 0) / (student.attendance?.totalSchoolDays || 1) * 100).toFixed(0)}%`} color="bg-emerald-600" />
                    <MetricCard icon={Award} label="Score Médio" value="9.4" color="bg-blue-600" />
                    <MetricCard icon={Zap} label="AEE Ativo" value={student.specialNeeds ? 'SIM' : 'NÃO'} color="bg-pink-600" />
                    <MetricCard icon={Layers} label="Eventos Rede" value={student.movementHistory?.length || 0} color="bg-slate-700" />
                </div>

                <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap">
                    {[
                        { id: 'pedagogico', label: 'Desempenho BNCC', icon: TrendingUp },
                        { id: 'movimento', label: 'Histórico de Rede', icon: Layers },
                        { id: 'cadastro', label: 'Ficha Cadastral', icon: CreditCard },
                        { id: 'diario', label: 'Diário de Bordo', icon: MessageSquare }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <tab.icon className="h-4 w-4" /> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="animate-in fade-in duration-500">
                    {activeTab === 'pedagogico' && (
                        <div className="card-requinte overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Rendimento Acadêmico (Conceitos)</h3>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Ciclo 2025</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Componente</th>
                                            {['Unid I', 'Unid II', 'Unid III'].map(u => (
                                                <th key={u} className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">{u}</th>
                                            ))}
                                            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">Média</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(student.performanceHistory || []).map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 font-bold text-slate-800 text-sm uppercase">{row.subject}</td>
                                                {[0, 1, 2].map(cIdx => (
                                                    <td key={cIdx} className="px-6 py-4 text-center">
                                                        <span className="inline-block w-8 h-8 leading-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">{row.g1?.[cIdx] || '--'}</span>
                                                    </td>
                                                ))}
                                                <td className="px-6 py-4 text-right font-black text-blue-600">{row.average?.toFixed(1) || '--'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'cadastro' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="card-requinte p-8">
                                <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-3">
                                    <User className="h-5 w-5 text-blue-600" /> Identificação Civil
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">CPF</p><p className="text-sm font-bold text-slate-800">{student.cpf}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">NIS/PIS</p><p className="text-sm font-bold text-slate-800">{student.nis || 'Não Informado'}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nacionalidade</p><p className="text-sm font-bold text-slate-800">{student.nationality || 'Brasileira'}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Gênero</p><p className="text-sm font-bold text-slate-800">{student.gender || '-'}</p></div>
                                </div>
                            </div>
                            <div className="card-requinte p-8">
                                <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-blue-600" /> Residência e Logística
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Endereço Declarado</p>
                                        <p className="text-sm font-bold text-slate-800">
                                            {student.address?.street}, {student.address?.number} - {student.address?.neighborhood}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center bg-blue-600 p-4 rounded-xl text-white">
                                        <div>
                                            <p className="text-[10px] font-bold opacity-80 uppercase mb-1">Transporte Escolar</p>
                                            <p className="text-sm font-bold">{student.transportRequest ? 'SOLICITADO' : 'NÃO REQUISITADO'}</p>
                                        </div>
                                        <Zap className="h-5 w-5 opacity-80" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};