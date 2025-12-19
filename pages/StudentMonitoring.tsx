
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from '../router';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
    ArrowLeft, User, BookOpen, AlertCircle, CheckCircle, 
    MessageSquare, Plus, Trash2, TrendingUp, Clock, Award, 
    AlertTriangle, FileText, MapPin, Phone, CreditCard, 
    Layers, Download, Printer, ShieldCheck, Activity, Zap, 
    Calendar, Hash, Briefcase, GraduationCap, ChevronRight
} from 'lucide-react';
import { RegistryStudent, TeacherNote, PerformanceRow, MovementRow } from '../types';

const CONCEPTS = {
  'DI': { label: 'Insatisfatório', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', val: 1 },
  'EP': { label: 'Em Processo', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', val: 2 },
  'DB': { label: 'Bom', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', val: 3 },
  'DE': { label: 'Excelente', color: 'bg-indigo-600', text: 'text-indigo-700', bg: 'bg-indigo-50', val: 4 },
  '': { label: 'Pendente', color: 'bg-slate-200', text: 'text-slate-400', bg: 'bg-slate-50', val: 0 }
};

const MetricCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-luxury flex items-center gap-8 group hover:-translate-y-2 transition-all duration-500">
        <div className={`p-6 rounded-[2rem] ${color} text-white shadow-2xl group-hover:rotate-12 transition-transform`}>
            <Icon className="h-8 w-8" />
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
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
    const [noteContent, setNoteContent] = useState('');
    const [noteType, setNoteType] = useState<TeacherNote['type']>('Pedagógico');

    useEffect(() => {
        if (studentId) {
            const found = students.find(s => s.id === studentId);
            if (found) setStudent(found);
        }
    }, [studentId, students]);

    if (!student) return (
        <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-12">
            <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-[10px] border-emerald-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-[10px] border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.5em] animate-pulse">Sincronizando Prontuário</p>
        </div>
    );

    const handleAddNote = async () => {
        if (!noteContent.trim()) return;
        const newNote: TeacherNote = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            type: noteType,
            content: noteContent,
            author: 'Coordenação Executiva' 
        };
        const updatedStudent = { ...student, teacherNotes: [newNote, ...(student.teacherNotes || [])] };
        await updateStudents([updatedStudent]);
        setStudent(updatedStudent);
        setNoteContent('');
        addToast('Anotação registrada com sucesso.', 'success');
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] py-16 px-8 page-transition">
            <div className="max-w-7xl mx-auto">
                {/* Header Premium */}
                <header className="mb-16 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12">
                    <div className="flex items-center gap-12 fade-in-premium">
                        <div className="relative">
                            <div className="w-44 h-44 rounded-[4rem] bg-white border-[12px] border-white shadow-luxury overflow-hidden group rotate-2 hover:rotate-0 transition-transform duration-700">
                                {student.photo ? <img src={student.photo} className="w-full h-full object-cover" /> : <User className="h-16 w-16 text-slate-200 mx-auto mt-8" />}
                                <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/10 transition-colors"></div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-emerald-600 p-4 rounded-3xl text-white shadow-2xl animate-luxury-float">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-ultra">INEP: {student.inepId || 'Não Consta'}</span>
                                <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-ultra ${student.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600'}`}>{student.status}</span>
                            </div>
                            <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6 uppercase text-display">{student.name}</h1>
                            <p className="text-slate-400 text-2xl font-medium tracking-tight flex items-center gap-4">
                                <GraduationCap className="h-8 w-8 text-emerald-600" /> {student.grade} • {student.className}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6 fade-in-premium" style={{animationDelay: '0.2s'}}>
                         <button onClick={() => window.print()} className="p-8 bg-white border border-slate-100 text-slate-400 rounded-[3rem] hover:text-emerald-600 transition shadow-luxury active:scale-90"><Printer className="h-8 w-8" /></button>
                         <button className="flex items-center gap-6 px-12 py-8 bg-slate-900 text-white rounded-[3.5rem] font-black text-[11px] uppercase tracking-ultra hover:bg-emerald-600 transition shadow-2xl active:scale-95">
                            <Download className="h-8 w-8" /> Exportar Prontuário
                         </button>
                    </div>
                </header>

                {/* Telemetria de Indicadores Excel */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 fade-in-premium" style={{animationDelay: '0.4s'}}>
                    <MetricCard icon={Activity} label="Frequência Global" value={`${((student.attendance?.presentDays || 0) / (student.attendance?.totalSchoolDays || 1) * 100).toFixed(0)}%`} color="bg-emerald-600" />
                    <MetricCard icon={Award} label="Score Acadêmico" value="9.4" color="bg-indigo-600" />
                    <MetricCard icon={Zap} label="AEE Ativo" value={student.specialNeeds ? 'SIM' : 'NÃO'} color="bg-pink-600" />
                    <MetricCard icon={Layers} label="Movimentação" value={student.movementHistory?.length || 0} color="bg-blue-600" />
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white p-4 rounded-[4rem] shadow-luxury border border-slate-100 mb-16 flex flex-wrap gap-4 items-center fade-in-premium" style={{animationDelay: '0.6s'}}>
                    {[
                        { id: 'pedagogico', label: 'Desempenho BNCC', icon: TrendingUp },
                        { id: 'movimento', label: 'Histórico de Rede', icon: Layers },
                        { id: 'cadastro', label: 'Ficha Nominal', icon: CreditCard },
                        { id: 'diario', label: 'Diário de Bordo', icon: MessageSquare }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 min-w-[200px] flex items-center justify-center gap-6 py-6 rounded-[3rem] font-black text-[11px] uppercase tracking-ultra transition-all ${activeTab === tab.id ? 'bg-slate-900 text-emerald-400 shadow-2xl scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <tab.icon className="h-6 w-6" /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {activeTab === 'pedagogico' && (
                        <div className="card-requinte overflow-hidden">
                            <div className="bg-slate-50/50 px-16 py-12 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-black text-slate-900 text-3xl tracking-tighter uppercase">Matriz de Rendimento</h3>
                                <span className="bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-ultra">Vigência 2025</span>
                            </div>
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/30">
                                            <th className="px-16 py-10 text-[11px] font-black text-slate-400 uppercase tracking-ultra">Área de Conhecimento</th>
                                            {['UNID I', 'UNID II', 'UNID III'].map(u => (
                                                <th key={u} className="px-10 py-10 text-[11px] font-black text-slate-400 uppercase tracking-ultra text-center">{u}</th>
                                            ))}
                                            <th className="px-16 py-10 text-[11px] font-black text-slate-400 uppercase tracking-ultra text-right">Resultado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {(student.performanceHistory || []).map((row, idx) => (
                                            <tr key={idx} className="group hover:bg-emerald-50/20 transition-all duration-500">
                                                <td className="px-16 py-12">
                                                    <p className="font-black text-slate-800 text-3xl tracking-tighter uppercase">{row.subject}</p>
                                                </td>
                                                {[0, 1, 2].map(cIdx => {
                                                    const concept = row.g1?.[cIdx] as keyof typeof CONCEPTS || '';
                                                    const style = CONCEPTS[concept];
                                                    return (
                                                        <td key={cIdx} className="px-10 py-12 text-center">
                                                            <div className={`w-20 h-20 mx-auto rounded-[2rem] flex flex-col items-center justify-center font-black text-2xl transition-all ${concept ? `${style.bg} ${style.text} shadow-lg scale-110` : 'bg-slate-50 text-slate-200 border border-dashed border-slate-200'}`}>
                                                                {concept || '--'}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                                <td className="px-16 py-12 text-right">
                                                    <div className="inline-flex flex-col items-end">
                                                        <span className="text-4xl font-black text-slate-900 tracking-tighter">{row.average?.toFixed(1) || '0.0'}</span>
                                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{row.concept}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'movimento' && (
                        <div className="card-requinte overflow-hidden">
                            <div className="bg-slate-50/50 px-16 py-12 border-b border-slate-100">
                                <h3 className="font-black text-slate-900 text-3xl tracking-tighter uppercase">Logística de Matrícula</h3>
                            </div>
                            <div className="p-12 space-y-12">
                                {(student.movementHistory || []).map((move, idx) => (
                                    <div key={idx} className="flex gap-12 relative group">
                                        {idx !== (student.movementHistory?.length || 0) - 1 && <div className="absolute left-10 top-20 bottom-[-48px] w-1 bg-slate-100"></div>}
                                        <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center text-emerald-400 shadow-2xl relative z-10 group-hover:rotate-12 transition-transform">
                                            <Layers className="h-8 w-8" />
                                        </div>
                                        <div className="flex-1 bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 group-hover:bg-white group-hover:shadow-luxury transition-all duration-700">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-ultra mb-2">{move.type}</p>
                                                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{move.description}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data da Operação</p>
                                                    <p className="text-xl font-black text-slate-700">{new Date(move.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 pt-6 border-t border-slate-200/50">
                                                <div className="bg-white p-3 rounded-2xl border border-slate-100 text-slate-400"><MapPin className="h-5 w-5" /></div>
                                                <p className="text-lg font-bold text-slate-500 uppercase tracking-tight">Origem/Destino: <span className="text-slate-900">{move.origin_dest}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'cadastro' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="card-requinte p-16 space-y-12">
                                <h3 className="font-black text-slate-900 text-4xl tracking-tighter uppercase flex items-center gap-8">
                                    <User className="h-12 w-12 text-emerald-600" /> Identificação Nominal
                                </h3>
                                <div className="grid grid-cols-2 gap-12">
                                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">CPF do Aluno</p><p className="text-2xl font-black text-slate-800">{student.cpf}</p></div>
                                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Data Nascimento</p><p className="text-2xl font-black text-slate-800">{student.birthDate}</p></div>
                                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Gênero</p><p className="text-2xl font-black text-slate-800">{student.gender || 'Não Inf.'}</p></div>
                                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cor/Raça</p><p className="text-2xl font-black text-slate-800">{student.colorRace || 'Não Inf.'}</p></div>
                                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">RG</p><p className="text-2xl font-black text-slate-800">{student.rg || 'PENDENTE'}</p></div>
                                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">NIS</p><p className="text-2xl font-black text-slate-800">{student.nis || 'Não possui'}</p></div>
                                </div>
                            </div>
                            <div className="card-requinte p-16 space-y-12">
                                <h3 className="font-black text-slate-900 text-4xl tracking-tighter uppercase flex items-center gap-8">
                                    <MapPin className="h-12 w-12 text-blue-600" /> Geolocalização e Endereço
                                </h3>
                                <div className="space-y-10">
                                    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Logradouro Completo</p>
                                        <p className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                                            {student.address?.street}, {student.address?.number} - {student.address?.neighborhood}
                                        </p>
                                        <div className="flex gap-6 mt-6">
                                            <span className="bg-white px-5 py-2 rounded-full border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">CEP: {student.address?.zipCode}</span>
                                            <span className="bg-white px-5 py-2 rounded-full border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">ZONA {student.address?.zone}</span>
                                        </div>
                                    </div>
                                    <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Solicitação de Transporte</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-3xl font-black tracking-tight">{student.transportRequest ? 'REQUISITADO' : 'NÃO SOLICITADO'}</p>
                                            <Zap className="h-8 w-8 text-emerald-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'diario' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-4 space-y-12">
                                <div className="card-requinte p-12 space-y-10 bg-slate-900 text-white shadow-2xl">
                                    <h3 className="font-black text-4xl tracking-tighter uppercase mb-6">Nova Observação</h3>
                                    <textarea 
                                        value={noteContent}
                                        onChange={(e) => setNoteContent(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white placeholder:text-white/20 outline-none focus:ring-8 focus:ring-white/5 transition-all resize-none h-64"
                                        placeholder="Descreva a ocorrência nominal..."
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Pedagógico', 'Elogio', 'Alerta', 'Ocorrência'].map(t => (
                                            <button key={t} onClick={() => setNoteType(t as any)} className={`py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${noteType === t ? 'bg-emerald-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>{t}</button>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={handleAddNote}
                                        className="w-full py-8 bg-emerald-600 rounded-[2.5rem] font-black text-[11px] uppercase tracking-ultra hover:bg-emerald-700 transition-all shadow-2xl active:scale-95"
                                    >
                                        Sincronizar Nota
                                    </button>
                                </div>
                            </div>
                            <div className="lg:col-span-8 space-y-12">
                                {(student.teacherNotes || []).length === 0 ? (
                                    <div className="h-[500px] flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[5rem] text-slate-300">
                                        <MessageSquare className="h-20 w-20 mb-8 opacity-20" />
                                        <p className="text-2xl font-black uppercase tracking-[0.3em]">Sem registros no diário</p>
                                    </div>
                                ) : (
                                    (student.teacherNotes || []).map(note => (
                                        <div key={note.id} className="card-requinte p-12 group transition-all duration-700 hover:border-emerald-500/30">
                                            <div className="flex justify-between items-start mb-10">
                                                <div className="flex items-center gap-8">
                                                    <div className={`p-5 rounded-[1.8rem] shadow-xl ${note.type === 'Ocorrência' ? 'bg-red-600' : 'bg-emerald-600'} text-white group-hover:rotate-12 transition-transform`}>
                                                        {note.type === 'Elogio' ? <Award className="h-8 w-8" /> : <BookOpen className="h-8 w-8" />}
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{note.type}</span>
                                                        <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mt-2">{new Date(note.date).toLocaleString()}</h4>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{note.author}</p>
                                                </div>
                                            </div>
                                            <p className="text-2xl font-medium text-slate-500 leading-relaxed italic">"{note.content}"</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
