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

// --- Subcomponente: Modal de Edição de Aluno (Prontuário) ---
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
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-emerald-50 px-8 py-6 border-b border-emerald-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-100">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Prontuário do Aluno</h3>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Protocolo: {student.enrollmentId || student.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition text-slate-400">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-bold text-slate-700"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Situação Cadastral</label>
                            <select 
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none font-bold text-slate-700 appearance-none"
                            >
                                <option value="Matriculado">Matriculado</option>
                                <option value="Pendente">Pendente</option>
                                <option value="Em Análise">Em Análise</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Unidade Escolar</label>
                            <select 
                                value={formData.school}
                                onChange={e => setFormData({ ...formData, school: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none font-bold text-slate-700"
                            >
                                <option value="Não alocada">Aguardando Vaga</option>
                                {schools.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Turma / Grupamento</label>
                            <input 
                                type="text" 
                                value={formData.className || ''}
                                onChange={e => setFormData({ ...formData, className: e.target.value.toUpperCase() })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none font-bold text-slate-700"
                                placeholder="Ex: GRUPO 04 A"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Turno</label>
                            <select 
                                value={formData.shift}
                                onChange={e => setFormData({ ...formData, shift: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none font-bold text-slate-700"
                            >
                                <option value="Matutino">Matutino</option>
                                <option value="Vespertino">Vespertino</option>
                                <option value="Integral">Integral</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-emerald-50 transition border border-slate-200">
                            <input 
                                type="checkbox" 
                                checked={formData.specialNeeds}
                                onChange={e => setFormData({ ...formData, specialNeeds: e.target.checked })}
                                className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Educação Especial (AEE)</span>
                        </label>
                        <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-emerald-50 transition border border-slate-200">
                            <input 
                                type="checkbox" 
                                checked={formData.transportRequest}
                                onChange={e => setFormData({ ...formData, transportRequest: e.target.checked })}
                                className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Transporte Escolar</span>
                        </label>
                    </div>
                </form>

                <div className="p-8 bg-slate-50 border-t border-slate-200 flex gap-4">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition shadow-sm"
                    >
                        Descartar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Salvar Prontuário
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AdminData: React.FC = () => {
  const { students, schools, removeStudent, removeSchool, updateStudents } = useData();
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
  
  const canEdit = useMemo(() => {
    return userData.role === UserRole.ADMIN_SME || userData.role === UserRole.DIRECTOR;
  }, [userData]);

  const handleUpdateStudent = async (updated: RegistryStudent) => {
    const newStudents = students.map(s => s.id === updated.id ? updated : s);
    try {
        await updateStudents(newStudents);
        addToast('Registro nominal atualizado com sucesso.', 'success');
    } catch (e) {
        addToast('Falha na sincronização dos dados.', 'error');
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
        className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition"
        onClick={() => { setSortField(field); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}
    >
        <div className="flex items-center gap-2">
            {label}
            {sortField === field && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-emerald-600" /> : <ArrowDown className="h-3 w-3 text-emerald-600" />)}
        </div>
    </th>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-2 mb-3">
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Painel Administrativo</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">SME Itaberaba</span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">Gestão de <span className="text-emerald-600">Rede Digital</span></h1>
                <p className="text-slate-500 font-medium text-lg">Administração centralizada e controle nominal de fluxo escolar.</p>
            </div>
            <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
                 <button className="flex items-center gap-3 px-6 py-3.5 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition shadow-sm">
                    <FileSpreadsheet className="h-4 w-4" /> Exportar Dados
                 </button>
                 <button onClick={() => setIsViewerOpen(true)} className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-emerald-600 transition shadow-sm">
                    <FileTerminal className="h-4 w-4" /> Console Logs
                 </button>
            </div>
        </header>

        {/* Barra de Ações Premium */}
        <div className="bg-white p-6 rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-100 mb-8 animate-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full lg:w-fit">
                    <button 
                        onClick={() => { setActiveTab('students'); setCurrentPage(1); setSortField('name'); }} 
                        className={`flex-1 lg:px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'students' ? 'bg-white text-emerald-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Users className="h-4 w-4 inline mr-2" /> Estudantes
                    </button>
                    <button 
                        onClick={() => { setActiveTab('schools'); setCurrentPage(1); setSortField('name'); }} 
                        className={`flex-1 lg:px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'schools' ? 'bg-white text-emerald-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Building className="h-4 w-4 inline mr-2" /> Unidades Escolares
                    </button>
                </div>
                <div className="relative w-full lg:w-[500px] group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder={activeTab === 'students' ? "Filtrar por Nome, CPF ou Protocolo..." : "Filtrar por Nome da Unidade..."}
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-transparent rounded-[1.8rem] focus:bg-white focus:border-emerald-600 focus:ring-8 focus:ring-emerald-50 outline-none transition-all font-bold text-slate-700 shadow-inner"
                    />
                </div>
            </div>
        </div>

        {/* Tabela de Dados Refinada */}
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden relative z-10 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            {activeTab === 'students' ? (
                                <>
                                    <th className="px-8 py-5 w-16"></th>
                                    <SortHeader label="Identificação do Estudante" field="name" />
                                    <SortHeader label="Vínculo Escolar" field="school" />
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Especiais</th>
                                    <SortHeader label="Status" field="status" />
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade de Ensino</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Endereço Institucional</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lotação</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Controle Nominal</th>
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
                                            <td className="px-8 py-6">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-100 border-4 border-white shadow-md flex items-center justify-center overflow-hidden group-hover:rotate-3 transition-transform">
                                                    {item.photo ? <img src={item.photo} className="w-full h-full object-cover" /> : <User className="h-6 w-6 text-slate-300" />}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-900 tracking-tight">{item.name}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">CPF: {item.cpf || 'PENDENTE'} • {item.enrollmentId || item.id}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-3.5 w-3.5 text-emerald-600" />
                                                    <span className="text-sm font-bold text-slate-600">{item.school || 'AGUARDANDO ALOCAÇÃO'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-2">
                                                    {item.specialNeeds && <div className="p-2 bg-pink-50 text-pink-600 rounded-xl border border-pink-100" title="AEE Requerido"><HeartPulse className="h-4 w-4" /></div>}
                                                    {item.transportRequest && <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100" title="Transporte Escolar"><Bus className="h-4 w-4" /></div>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${item.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : item.status === 'Pendente' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{item.status}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    {canEdit && (
                                                        <button onClick={() => setEditingStudent(item)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 rounded-xl transition shadow-sm hover:scale-110 active:scale-95">
                                                            <Edit3 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    {userData.role === UserRole.ADMIN_SME && (
                                                        <button onClick={() => removeStudent(item.id)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-xl transition shadow-sm hover:scale-110 active:scale-95">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                                                        <Building className="h-7 w-7" />
                                                    </div>
                                                    <p className="font-black text-slate-900 tracking-tighter text-lg">{item.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8 text-sm font-medium text-slate-500 leading-relaxed max-w-xs">{item.address}</td>
                                            <td className="px-8 py-8 text-center">
                                                <span className="font-black text-slate-900 text-xl">{students.filter(s => s.school === item.name).length} / {item.availableSlots}</span>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Ocupação Atual</p>
                                            </td>
                                            <td className="px-8 py-8 text-right">
                                                <button 
                                                    onClick={() => setExpandedSchoolId(expandedSchoolId === item.id ? null : item.id)}
                                                    className={`flex items-center gap-3 ml-auto px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${expandedSchoolId === item.id ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'}`}
                                                >
                                                    <Users className="h-4 w-4" />
                                                    {expandedSchoolId === item.id ? 'Ocultar Quadro' : 'Quadro Nominal'}
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                                
                                {/* Expansão: Quadro Nominal por Escola */}
                                {activeTab === 'schools' && expandedSchoolId === item.id && (
                                    <tr className="animate-in slide-in-from-top-4 duration-500">
                                        <td colSpan={4} className="p-0">
                                            <div className="bg-slate-50/50 p-12 border-y border-slate-100">
                                                <div className="flex justify-between items-end mb-10">
                                                    <div>
                                                        <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-3 mb-2">
                                                            <GraduationCap className="h-5 w-5" /> Quadro Acadêmico Nominal
                                                        </h4>
                                                        <h5 className="text-3xl font-black text-slate-900 tracking-tighter">{item.name}</h5>
                                                    </div>
                                                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                                        <Users className="h-5 w-5 text-emerald-600" />
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                            Alunos Ativos: {students.filter(s => s.school === item.name).length}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                    {students.filter(s => s.school === item.name).map(studentInSchool => (
                                                        <div key={studentInSchool.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center group/card hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 overflow-hidden shadow-inner">
                                                                    {studentInSchool.photo ? <img src={studentInSchool.photo} className="w-full h-full object-cover" /> : <User className="h-5 w-5" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-800 text-sm tracking-tight truncate max-w-[160px]">{studentInSchool.name}</p>
                                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{studentInSchool.className || 'TURMA NÃO ALOCADA'}</p>
                                                                </div>
                                                            </div>
                                                            {canEdit && (
                                                                <button 
                                                                    onClick={() => setEditingStudent(studentInSchool)}
                                                                    className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all opacity-0 group-hover/card:opacity-100 shadow-sm hover:scale-110 active:scale-95"
                                                                >
                                                                    <Edit3 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {students.filter(s => s.school === item.name).length === 0 && (
                                                        <div className="col-span-full py-16 text-center border-4 border-dashed border-slate-200 rounded-[3rem] text-slate-300 font-black uppercase tracking-[0.2em]">
                                                            Sem registros acadêmicos vinculados
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

            {/* Paginação Estilizada */}
            <div className="bg-slate-50/50 px-12 py-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 glow-primary"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Página {currentPage} de {totalPages || 1} • {sortedData.length} Registros Totais
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-sm"><ChevronsLeft className="h-5 w-5" /></button>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-sm"><ChevronLeft className="h-5 w-5" /></button>
                    <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-emerald-100">{currentPage}</div>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-sm"><ChevronRight className="h-5 w-5" /></button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages} className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-sm"><ChevronsRight className="h-5 w-5" /></button>
                </div>
            </div>
        </div>

        {/* Modal de Edição (Somente se autorizado) */}
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