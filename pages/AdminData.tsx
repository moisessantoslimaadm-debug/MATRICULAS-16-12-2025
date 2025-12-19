import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { useNavigate } from '../router';
import { 
  Search, Trash2, User, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Building, FileSpreadsheet,
  Edit3, X, Save, Loader2, Users, ArrowUp, ArrowDown, 
  ChevronDown, ShieldCheck, Zap
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
            <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
                <div className="bg-emerald-50 px-12 py-10 border-b border-emerald-100 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full -mr-16 -mt-16"></div>
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="bg-emerald-600 p-5 rounded-3xl shadow-2xl shadow-emerald-100">
                            <User className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Prontuário Nominal</h3>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-ultra">Protocolo: {student.enrollmentId || student.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-4 hover:bg-white rounded-full transition text-slate-400 relative z-10">
                        <X className="h-8 w-8" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-12 space-y-10 max-h-[65vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-ultra mb-4 ml-2">Identificação Completa</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:ring-8 focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-black text-slate-700 text-xl"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-ultra mb-4 ml-2">Status de Rede</label>
                            <div className="relative">
                                <select 
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:ring-8 focus:ring-emerald-50 outline-none font-black text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="Matriculado">Matriculado</option>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Em Análise">Em Análise</option>
                                </select>
                                <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-ultra mb-4 ml-2">Lotação Escolar</label>
                            <div className="relative">
                                <select 
                                    value={formData.school}
                                    onChange={e => setFormData({ ...formData, school: e.target.value })}
                                    className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:ring-8 focus:ring-emerald-50 outline-none font-black text-slate-700 cursor-pointer appearance-none"
                                >
                                    <option value="Não alocada">Aguardando Unidade</option>
                                    {schools.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                </select>
                                <Building className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-100">
                        <label className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] cursor-pointer hover:bg-emerald-50 transition border border-slate-100 group">
                            <input 
                                type="checkbox" 
                                checked={formData.specialNeeds}
                                onChange={e => setFormData({ ...formData, specialNeeds: e.target.checked })}
                                className="w-8 h-8 rounded-xl text-emerald-600 focus:ring-emerald-500 border-slate-300 transition-all"
                            />
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">AEE Ativo</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Atendimento Especial</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] cursor-pointer hover:bg-blue-50 transition border border-slate-100 group">
                            <input 
                                type="checkbox" 
                                checked={formData.transportRequest}
                                onChange={e => setFormData({ ...formData, transportRequest: e.target.checked })}
                                className="w-8 h-8 rounded-xl text-blue-600 focus:ring-blue-500 border-slate-300 transition-all"
                            />
                            <div className="flex flex-col">
                                <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Transporte</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Zona Rural/Difícil Acesso</span>
                            </div>
                        </label>
                    </div>
                </form>

                <div className="p-12 bg-slate-50/50 border-t border-slate-100 flex gap-8">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="flex-1 py-7 bg-white border border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-ultra rounded-[2.8rem] hover:text-slate-600 transition shadow-sm active:scale-95"
                    >
                        Descartar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 py-7 bg-slate-900 text-white font-black text-[11px] uppercase tracking-ultra rounded-[2.8rem] hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-6 disabled:opacity-50 active:scale-95"
                    >
                        {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                        Sincronizar Dados
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
        addToast('Base nominal sincronizada.', 'success');
    } catch (e) {
        addToast('Falha na comunicação com a rede.', 'error');
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
        className="px-12 py-10 text-[11px] font-black text-slate-400 uppercase tracking-ultra cursor-pointer hover:bg-slate-50 transition border-b border-slate-50"
        onClick={() => { setSortField(field); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}
    >
        <div className="flex items-center gap-4">
            {label}
            {sortField === field && (sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 text-emerald-600" /> : <ArrowDown className="h-4 w-4 text-emerald-600" />)}
        </div>
    </th>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 mb-20">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="flex items-center gap-5 mb-8">
                    <span className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-ultra shadow-lg shadow-emerald-100">Governança Digital</span>
                    <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-ultra">SME ITABERABA</span>
                </div>
                <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">Controle <br/> de <span className="text-emerald-600">Rede.</span></h1>
                <p className="text-slate-500 font-medium text-2xl max-w-2xl leading-relaxed">Administração centralizada do fluxo escolar e monitoramento nominal em tempo real.</p>
            </div>
            <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-right-8 duration-1000">
                 <button className="flex items-center gap-6 px-12 py-8 bg-emerald-50 text-emerald-700 rounded-[3rem] font-black text-[11px] uppercase tracking-ultra border border-emerald-100 hover:bg-emerald-100 transition shadow-2xl shadow-emerald-50 active:scale-95">
                    <FileSpreadsheet className="h-7 w-7" /> Exportar Dados
                 </button>
                 <button onClick={() => setIsViewerOpen(true)} className="flex items-center gap-6 px-12 py-8 bg-white border border-slate-100 text-slate-400 rounded-[3rem] font-black text-[11px] uppercase tracking-ultra hover:text-emerald-600 transition shadow-2xl shadow-slate-50 active:scale-95">
                    <Zap className="h-7 w-7" /> Sistema Debug
                 </button>
            </div>
        </header>

        <div className="bg-white p-12 rounded-[5rem] shadow-2xl shadow-slate-100 border border-slate-100 mb-16 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col lg:flex-row gap-12 justify-between items-center">
                <div className="flex p-3 bg-slate-50 rounded-[3.5rem] w-full lg:w-fit border border-slate-100">
                    <button 
                        onClick={() => { setActiveTab('students'); setCurrentPage(1); setSortField('name'); }} 
                        className={`flex-1 lg:px-20 py-6 rounded-[3rem] text-[11px] font-black uppercase tracking-ultra transition-all ${activeTab === 'students' ? 'bg-white text-emerald-600 shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Base de Alunos
                    </button>
                    <button 
                        onClick={() => { setActiveTab('schools'); setCurrentPage(1); setSortField('name'); }} 
                        className={`flex-1 lg:px-20 py-6 rounded-[3rem] text-[11px] font-black uppercase tracking-ultra transition-all ${activeTab === 'schools' ? 'bg-white text-emerald-600 shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Infraestrutura
                    </button>
                </div>
                <div className="relative w-full lg:w-[650px] group">
                    <Search className="absolute left-10 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-200 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar registro nominal..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-24 pr-12 py-8 bg-slate-50 border border-transparent rounded-[3.5rem] focus:bg-white focus:border-emerald-600 focus:ring-8 focus:ring-emerald-50 outline-none transition-all font-black text-slate-700 text-xl shadow-inner"
                    />
                </div>
            </div>
        </div>

        <div className="card-requinte overflow-hidden relative z-10 animate-in slide-in-from-bottom-12 duration-1000 delay-200">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr>
                            {activeTab === 'students' ? (
                                <>
                                    <th className="px-12 py-12 w-32 border-b border-slate-50"></th>
                                    <SortHeader label="Identificação" field="name" />
                                    <SortHeader label="Vínculo Escolar" field="school" />
                                    <th className="px-12 py-12 text-[11px] font-black text-slate-400 uppercase tracking-ultra border-b border-slate-50">Status</th>
                                    <th className="px-12 py-12 text-[11px] font-black text-slate-400 uppercase tracking-ultra text-right border-b border-slate-50">Gestão</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-12 py-14 text-[11px] font-black text-slate-400 uppercase tracking-ultra border-b border-slate-50">Unidade de Ensino</th>
                                    <th className="px-12 py-14 text-[11px] font-black text-slate-400 uppercase tracking-ultra text-center border-b border-slate-50">Ocupação</th>
                                    <th className="px-12 py-14 text-[11px] font-black text-slate-400 uppercase tracking-ultra text-right border-b border-slate-50">Visualização</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedData.map((item: any) => (
                            <React.Fragment key={item.id}>
                                <tr className={`group transition-all hover:bg-slate-50 ${expandedSchoolId === item.id ? 'bg-emerald-50/20' : ''}`}>
                                    {activeTab === 'students' ? (
                                        <>
                                            <td className="px-12 py-12">
                                                <div className="w-24 h-24 rounded-[2.5rem] bg-white border-[8px] border-white shadow-2xl flex items-center justify-center overflow-hidden transition-transform group-hover:rotate-6">
                                                    {item.photo ? <img src={item.photo} className="w-full h-full object-cover" /> : <User className="h-12 w-12 text-slate-200" />}
                                                </div>
                                            </td>
                                            <td className="px-12 py-12">
                                                <p className="font-black text-slate-900 text-2xl tracking-tighter leading-none mb-4 uppercase">{item.name}</p>
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
                                                    CPF: {item.cpf || '--'} <span className="w-2 h-2 rounded-full bg-slate-200"></span> ID: {item.enrollmentId || item.id}
                                                </p>
                                            </td>
                                            <td className="px-12 py-12">
                                                <div className="flex items-center gap-5">
                                                    <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 shadow-sm border border-emerald-100">
                                                        <Building className="h-6 w-6" />
                                                    </div>
                                                    <span className="text-base font-black text-slate-600 uppercase tracking-tight">{item.school || 'AGUARDANDO ALOCAÇÃO'}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-12">
                                                <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-ultra border shadow-xl shadow-slate-100 ${item.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : item.status === 'Pendente' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{item.status}</span>
                                            </td>
                                            <td className="px-12 py-12 text-right">
                                                <div className="flex justify-end gap-5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                                                    {canEdit && (
                                                        <button onClick={() => setEditingStudent(item)} className="p-6 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 rounded-[1.8rem] transition-all hover:shadow-2xl active:scale-90">
                                                            <Edit3 className="h-7 w-7" />
                                                        </button>
                                                    )}
                                                    {userData.role === UserRole.ADMIN_SME && (
                                                        <button onClick={() => {if(window.confirm('Excluir registro permanentemente?')) removeStudent(item.id)}} className="p-6 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-[1.8rem] transition-all hover:shadow-2xl active:scale-90">
                                                            <Trash2 className="h-7 w-7" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-12 py-16">
                                                <div className="flex items-center gap-12">
                                                    <div className="w-24 h-24 rounded-[3rem] bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:rotate-12 transition-transform border border-emerald-100">
                                                        <Building className="h-12 w-12" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 tracking-tighter text-4xl leading-none mb-4 uppercase">{item.name}</p>
                                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest truncate max-w-lg">{item.address}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-16 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="font-black text-slate-900 text-4xl tracking-tighter mb-4">{students.filter(s => s.school === item.name).length} <span className="text-slate-200 mx-3">/</span> {item.availableSlots}</span>
                                                    <div className="w-48 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                        <div className="h-full bg-emerald-500 rounded-full glow-emerald" style={{ width: `${(students.filter(s => s.school === item.name).length / item.availableSlots) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-16 text-right">
                                                <button 
                                                    onClick={() => setExpandedSchoolId(expandedSchoolId === item.id ? null : item.id)}
                                                    className={`flex items-center gap-6 ml-auto px-16 py-7 rounded-[3rem] font-black text-[11px] uppercase tracking-ultra transition-all ${expandedSchoolId === item.id ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white active:scale-95'}`}
                                                >
                                                    <Users className="h-7 w-7" />
                                                    {expandedSchoolId === item.id ? 'Fechar Quadro' : 'Quadro Nominal'}
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                                
                                {activeTab === 'schools' && expandedSchoolId === item.id && (
                                    <tr className="animate-in slide-in-from-top-12 duration-1000">
                                        <td colSpan={3} className="p-0">
                                            <div className="bg-slate-50/70 p-24 border-y border-slate-100">
                                                <div className="flex justify-between items-end mb-24">
                                                    <div>
                                                        <div className="flex items-center gap-5 mb-8">
                                                            <div className="h-4 w-4 rounded-full bg-emerald-500 glow-primary"></div>
                                                            <h4 className="text-[14px] font-black text-emerald-600 uppercase tracking-[0.5em]">Censo Nominal Ativo</h4>
                                                        </div>
                                                        <h5 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">{item.name}</h5>
                                                    </div>
                                                    <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-100 border border-slate-100 text-center min-w-[250px]">
                                                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Alunos</p>
                                                        <p className="text-5xl font-black text-slate-900">{students.filter(s => s.school === item.name).length}</p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                                                    {students.filter(s => s.school === item.name).map(studentInSchool => (
                                                        <div key={studentInSchool.id} className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-slate-100 border border-slate-100 flex justify-between items-center group/card hover:border-emerald-500 hover:-translate-y-3 transition-all duration-700">
                                                            <div className="flex items-center gap-10">
                                                                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-300 overflow-hidden shadow-inner border border-slate-100 group-hover/card:rotate-6 transition-transform">
                                                                    {studentInSchool.photo ? <img src={studentInSchool.photo} className="w-full h-full object-cover" /> : <User className="h-10 w-10" />}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-800 text-2xl tracking-tighter truncate max-w-[200px] leading-none mb-4 uppercase">{studentInSchool.name}</p>
                                                                    <div className="flex items-center gap-4">
                                                                         <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{studentInSchool.className || 'Sem Turma'}</span>
                                                                         {studentInSchool.specialNeeds && <Zap className="h-5 w-5 text-emerald-500" />}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {canEdit && (
                                                                <button 
                                                                    onClick={() => setEditingStudent(studentInSchool)}
                                                                    className="p-6 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-[2rem] transition-all opacity-0 group-hover/card:opacity-100 shadow-xl hover:scale-110 active:scale-90"
                                                                >
                                                                    <Edit3 className="h-7 w-7" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {students.filter(s => s.school === item.name).length === 0 && (
                                                        <div className="col-span-full py-40 text-center border-4 border-dashed border-slate-200 rounded-[6rem] text-slate-300 font-black uppercase tracking-[0.5em] animate-pulse">
                                                            Nenhum registro acadêmico localizado
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

            <div className="bg-slate-50/50 px-16 py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-8">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 glow-primary shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[12px] font-black text-slate-400 uppercase tracking-ultra">
                        Exibindo {paginatedData.length} de {sortedData.length} Registros • Página {currentPage} de {totalPages || 1}
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={() => {setCurrentPage(1); window.scrollTo({top: 400, behavior:'smooth'})}} disabled={currentPage === 1} className="p-6 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-xl active:scale-90"><ChevronsLeft className="h-8 w-8" /></button>
                    <button onClick={() => {setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({top: 400, behavior:'smooth'})}} disabled={currentPage === 1} className="p-6 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-xl active:scale-90"><ChevronLeft className="h-8 w-8" /></button>
                    <div className="bg-slate-900 text-white px-12 py-6 rounded-[2rem] font-black text-3xl shadow-2xl shadow-slate-200 mx-4">{currentPage}</div>
                    <button onClick={() => {setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({top: 400, behavior:'smooth'})}} disabled={currentPage >= totalPages} className="p-6 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-xl active:scale-90"><ChevronRight className="h-8 w-8" /></button>
                    <button onClick={() => {setCurrentPage(totalPages); window.scrollTo({top: 400, behavior:'smooth'})}} disabled={currentPage >= totalPages} className="p-6 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-emerald-600 disabled:opacity-20 transition shadow-xl active:scale-90"><ChevronsRight className="h-8 w-8" /></button>
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