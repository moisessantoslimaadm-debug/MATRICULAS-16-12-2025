import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { useNavigate } from '../router';
import { 
  Search, Trash2, User, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Building, FileSpreadsheet,
  HeartPulse, Bus, Edit3, X, Save, Loader2,
  Users, GraduationCap, ArrowUp, ArrowDown, FileTerminal,
  Filter, LayoutGrid, CheckCircle2, ChevronDown, Award,
  ShieldCheck, MapPin, Calendar, Database
} from 'lucide-react';
import { RegistryStudent, School, UserRole } from '../types';

const EditStudentModal: React.FC<{ 
    student: RegistryStudent; 
    onClose: () => void; 
    onSave: (updated: RegistryStudent) => Promise<void>;
    schools: School[];
}> = ({ student, onClose, onSave, schools }) => {
    const [formData, setFormData] = useState<RegistryStudent>({ ...student });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-emerald-50 px-10 py-8 border-b border-emerald-100 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <div className="bg-emerald-600 p-4 rounded-3xl shadow-xl shadow-emerald-100">
                            <User className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Prontuário Nominal</h3>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">ID: {student.enrollmentId || student.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition text-slate-400">
                        <X className="h-7 w-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Identificação Completa</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.8rem] focus:ring-8 focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-black text-slate-700"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Situação de Rede</label>
                            <select 
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.8rem] focus:ring-8 focus:ring-emerald-50 outline-none font-black text-slate-700 appearance-none cursor-pointer"
                            >
                                <option value="Matriculado">Matriculado</option>
                                <option value="Pendente">Pendente</option>
                                <option value="Em Análise">Em Análise</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Lotação Escolar</label>
                            <select 
                                value={formData.school}
                                onChange={e => setFormData({ ...formData, school: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.8rem] focus:ring-8 focus:ring-emerald-50 outline-none font-black text-slate-700 cursor-pointer"
                            >
                                <option value="Não alocada">Aguardando Vaga</option>
                                {schools.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                        <label className="flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] cursor-pointer hover:bg-emerald-50 transition border border-slate-100 group">
                            <input 
                                type="checkbox" 
                                checked={formData.specialNeeds}
                                onChange={e => setFormData({ ...formData, specialNeeds: e.target.checked })}
                                className="w-6 h-6 rounded-lg text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-emerald-700 transition-colors">AEE Ativo</span>
                        </label>
                        <label className="flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] cursor-pointer hover:bg-emerald-50 transition border border-slate-100 group">
                            <input 
                                type="checkbox" 
                                checked={formData.transportRequest}
                                onChange={e => setFormData({ ...formData, transportRequest: e.target.checked })}
                                className="w-6 h-6 rounded-lg text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-emerald-700 transition-colors">Transporte Escolar</span>
                        </label>
                    </div>
                </form>

                <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-6">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="flex-1 py-5 bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.8rem] hover:bg-white hover:text-slate-600 transition shadow-sm"
                    >
                        Descartar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 py-5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.8rem] hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Sincronizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AdminData: React.FC = () => {
  const { students, schools, removeStudent, updateStudents } = useData();
  const { addToast } = useToast();
  const { setIsViewerOpen } = useLog();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'students' | 'schools'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<RegistryStudent | null>(null);

  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const userData = useMemo(() => JSON.parse(sessionStorage.getItem('user_data') || '{}'), []);
  const canEdit = useMemo(() => userData.role === UserRole.ADMIN_SME || userData.role === UserRole.DIRECTOR, [userData]);

  const handleUpdateStudent = async (updated: RegistryStudent) => {
    const newStudents = students.map(s => s.id === updated.id ? updated : s);
    try {
        await updateStudents(newStudents);
        addToast('Base nominal atualizada.', 'success');
    } catch (e) {
        addToast('Erro na sincronização.', 'error');
    }
  };

  const filteredData = useMemo(() => {
    if (activeTab === 'students') {
        return students.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (s.cpf && s.cpf.includes(searchTerm)) ||
            (s.enrollmentId && s.enrollmentId.includes(searchTerm))
        );
    } else {
        return schools.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
  }, [students, schools, searchTerm, activeTab]);

  const sortedData = useMemo(() => {
    const data = [...filteredData];
    data.sort((a: any, b: any) => {
        const valA = (a[sortField] || '').toString().toLowerCase();
        const valB = (b[sortField] || '').toString().toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    return data;
  }, [filteredData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const SortHeader = ({ label, field }: { label: string; field: string }) => (
    <th 
        className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] cursor-pointer hover:bg-slate-50 transition"
        onClick={() => { setSortField(field); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}
    >
        <div className="flex items-center gap-3">
            {label}
            {sortField === field && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-emerald-600" /> : <ArrowDown className="h-3 w-3 text-emerald-600" />)}
        </div>
    </th>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-20">
      <div className="max-w-7xl mx-auto px-8">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
            <div className="animate-in fade-in slide-in-from-left-6 duration-700">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.3em]">Gestão de Ativos</span>
                    <span className="text-slate-300 font-bold">/</span>
                    <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">SME Itaberaba</span>
                </div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">Gestão de <span className="text-emerald-600">Rede.</span></h1>
                <p className="text-slate-500 font-medium text-xl">Monitoramento nominal e controle de fluxo escolar digital.</p>
            </div>
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-right-6 duration-700">
                 <button className="flex items-center gap-4 px-8 py-5 bg-emerald-50 text-emerald-700 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] border border-emerald-100 hover:bg-emerald-100 transition shadow-xl shadow-emerald-50">
                    <FileSpreadsheet className="h-5 w-5" /> Exportar Base
                 </button>
                 <button onClick={() => setIsViewerOpen(true)} className="flex items-center gap-4 px-8 py-5 bg-white border border-slate-100 text-slate-400 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:text-emerald-600 transition shadow-xl shadow-slate-50">
                    <FileTerminal className="h-5 w-5" /> Debug Console
                 </button>
            </div>
        </header>

        <div className="bg-white p-8 rounded-[4rem] shadow-2xl shadow-slate-100 border border-slate-100 mb-12 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex flex-col lg:flex-row gap-8 justify-between items-center">
                <div className="flex p-2 bg-slate-50 rounded-[2.5rem] w-full lg:w-fit border border-slate-100">
                    <button 
                        onClick={() => { setActiveTab('students'); setCurrentPage(1); setSortField('name'); }} 
                        className={`flex-1 lg:px-14 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'students' ? 'bg-white text-emerald-600 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Estudantes
                    </button>
                    <button 
                        onClick={() => { setActiveTab('schools'); setCurrentPage(1); setSortField('name'); }} 
                        className={`flex-1 lg:px-14 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === 'schools' ? 'bg-white text-emerald-600 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Unidades
                    </button>
                </div>
                <div className="relative w-full lg:w-[600px] group">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-200 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar por Nome, CPF ou Protocolo..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-transparent rounded-[2.5rem] focus:bg-white focus:border-emerald-600 focus:ring-8 focus:ring-emerald-50 outline-none transition-all font-black text-slate-700 shadow-inner"
                    />
                </div>
            </div>
        </div>

        <div className="card-requinte overflow-hidden relative z-10 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            {activeTab === 'students' ? (
                                <>
                                    <th className="px-10 py-8 w-24"></th>
                                    <SortHeader label="Estudante" field="name" />
                                    <SortHeader label="Escola Atribuída" field="school" />
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Status</th>
                                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-right">Ações</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-10 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Unidade de Ensino</th>
                                    <th className="px-10 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-center">Vagas</th>
                                    <th className="px-10 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-right">Controle Nominal</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedData.map((item: any) => (
                            <React.Fragment key={item.id}>
                                <tr className={`group hover:bg-slate-50 transition-all ${expandedSchoolId === item.id ? 'bg-emerald-50/30' : ''}`}>
                                    {activeTab === 'students' ? (
                                        <>
                                            <td className="px-10 py-10">
                                                <div className="w-16 h-16 rounded-[1.8rem] bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-transform group-hover:rotate-6">
                                                    {item.photo ? <img src={item.photo} className="w-full h-full object-cover" /> : <User className="h-8 w-8 text-slate-300" />}
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <p className="font-black text-slate-900 text-lg tracking-tighter leading-tight">{item.name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">CPF: {item.cpf || 'Pendente'} • {item.enrollmentId || item.id}</p>
                                            </td>
                                            <td className="px-10 py-10">
                                                <div className="flex items-center gap-3">
                                                    <Building className="h-4 w-4 text-emerald-600" />
                                                    <span className="text-sm font-black text-slate-600 uppercase tracking-tight">{item.school || 'AGUARDANDO'}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${item.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : item.status === 'Pendente' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{item.status}</span>
                                            </td>
                                            <td className="px-10 py-10 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                    {canEdit && (
                                                        <button onClick={() => setEditingStudent(item)} className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 rounded-2xl transition-all hover:shadow-2xl hover:scale-110 active:scale-95">
                                                            <Edit3 className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    {userData.role === UserRole.ADMIN_SME && (
                                                        <button onClick={() => removeStudent(item.id)} className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-2xl transition-all hover:shadow-2xl hover:scale-110 active:scale-95">
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-10 py-12">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-16 h-16 rounded-[1.8rem] bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                                                        <Building className="h-8 w-8" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 tracking-tighter text-2xl leading-none">{item.name}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 truncate max-w-xs">{item.address}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-12 text-center">
                                                <span className="font-black text-slate-900 text-2xl">{students.filter(s => s.school === item.name).length} / {item.availableSlots}</span>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Ocupação</p>
                                            </td>
                                            <td className="px-10 py-12 text-right">
                                                <button 
                                                    onClick={() => setExpandedSchoolId(expandedSchoolId === item.id ? null : item.id)}
                                                    className={`flex items-center gap-4 ml-auto px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all ${expandedSchoolId === item.id ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white'}`}
                                                >
                                                    <Users className="h-5 w-5" />
                                                    {expandedSchoolId === item.id ? 'Ocultar' : 'Ver Quadro'}
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                                
                                {activeTab === 'schools' && expandedSchoolId === item.id && (
                                    <tr className="animate-in slide-in-from-top-6 duration-700">
                                        <td colSpan={3} className="p-0">
                                            <div className="bg-slate-50/50 p-20 border-y border-slate-100">
                                                <div className="flex justify-between items-end mb-16">
                                                    <div>
                                                        <h4 className="text-[12px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-4">Quadro Nominal Ativo</h4>
                                                        <h5 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{item.name}</h5>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                                    {students.filter(s => s.school === item.name).map(studentInSchool => (
                                                        <div key={studentInSchool.id} className="bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-100 flex justify-between items-center group/card hover:border-emerald-500 hover:shadow-2xl transition-all duration-500">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-300 overflow-hidden shadow-inner border border-slate-100">
                                                                    {studentInSchool.photo ? <img src={studentInSchool.photo} className="w-full h-full object-cover" /> : <User className="h-6 w-6" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-800 text-lg tracking-tight truncate max-w-[160px] leading-none">{studentInSchool.name}</p>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3">{studentInSchool.className || 'Sem Turma'}</p>
                                                                </div>
                                                            </div>
                                                            {canEdit && (
                                                                <button 
                                                                    onClick={() => setEditingStudent(studentInSchool)}
                                                                    className="p-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all opacity-0 group-hover/card:opacity-100 shadow-lg hover:scale-110 active:scale-95"
                                                                >
                                                                    <Edit3 className="h-5 w-5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {students.filter(s => s.school === item.name).length === 0 && (
                                                        <div className="col-span-full py-24 text-center border-4 border-dashed border-slate-200 rounded-[4rem] text-slate-300 font-black uppercase tracking-[0.5em]">
                                                            Sem registros acadêmicos
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50/50 px-16 py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 glow-primary"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                        Exibindo {paginatedData.length} de {sortedData.length} Registros • Página {currentPage} / {totalPages || 1}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-xl shadow-slate-50 active:scale-90"><ChevronsLeft className="h-6 w-6" /></button>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-xl shadow-slate-50 active:scale-90"><ChevronLeft className="h-6 w-6" /></button>
                    <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-2xl shadow-slate-200">{currentPage}</div>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-xl shadow-slate-50 active:scale-90"><ChevronRight className="h-6 w-6" /></button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages} className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-xl shadow-slate-50 active:scale-90"><ChevronsRight className="h-6 w-6" /></button>
                </div>
            </div>
        </div>

        {editingStudent && canEdit && (
            <EditStudentModal 
                student={editingStudent} 
                onClose={() => setEditingStudent(null)} 
                onSave={handleUpdateStudent}
                schools={schools}
            />
        )}
      </div>
    </div>
  );
};