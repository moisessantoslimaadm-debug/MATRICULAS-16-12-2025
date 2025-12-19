import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { useNavigate } from '../router';
import { 
  Search, Trash2, LogOut, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User, 
  FileText, ArrowUp, ArrowDown, ArrowUpDown, ChevronDown, 
  FileTerminal, Building, FileSpreadsheet,
  HeartPulse, Bus, CheckCircle2, Edit3, X, Save, Loader2,
  Users, GraduationCap, MapPin, Calendar, Info
} from 'lucide-react';
import { RegistryStudent, School, UserRole } from '../types';

// --- Subcomponente: Modal de Edição de Aluno ---
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
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Prontuário de Registro</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {student.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nome Completo do Aluno</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-black text-slate-700"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Status da Matrícula</label>
                            <select 
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 appearance-none"
                            >
                                <option value="Matriculado">Matriculado</option>
                                <option value="Pendente">Pendente</option>
                                <option value="Em Análise">Em Análise</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Unidade Alocada</label>
                            <select 
                                value={formData.school}
                                onChange={e => setFormData({ ...formData, school: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700"
                            >
                                <option value="Não alocada">Não alocada</option>
                                {schools.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Turma / Grupamento</label>
                            <input 
                                type="text" 
                                value={formData.className || ''}
                                onChange={e => setFormData({ ...formData, className: e.target.value.toUpperCase() })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700"
                                placeholder="Ex: GRUPO 3 C"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Turno</label>
                            <select 
                                value={formData.shift}
                                onChange={e => setFormData({ ...formData, shift: e.target.value })}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700"
                            >
                                <option value="Definição Pendente">Definição Pendente</option>
                                <option value="Matutino">Matutino</option>
                                <option value="Vespertino">Vespertino</option>
                                <option value="Integral">Integral</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-indigo-50 transition border border-slate-200">
                            <input 
                                type="checkbox" 
                                checked={formData.specialNeeds}
                                onChange={e => setFormData({ ...formData, specialNeeds: e.target.checked })}
                                className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Educação Especial (AEE)</span>
                        </label>
                        <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-indigo-50 transition border border-slate-200">
                            <input 
                                type="checkbox" 
                                checked={formData.transportRequest}
                                onChange={e => setFormData({ ...formData, transportRequest: e.target.checked })}
                                className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Transporte Escolar</span>
                        </label>
                    </div>
                </form>

                <div className="p-8 bg-slate-50 border-t border-slate-200 flex gap-4">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition shadow-sm"
                    >
                        Descartar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 py-4 bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Salvar Alterações
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estados de Edição
  const [editingStudent, setEditingStudent] = useState<RegistryStudent | null>(null);
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);

  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filtros
  const [schoolFilter, setSchoolFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [shiftFilter, setShiftFilter] = useState('Todos');
  const [zoneFilter, setZoneFilter] = useState('Todas');

  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
      const isAuth = sessionStorage.getItem('admin_auth') === 'true';
      const role = sessionStorage.getItem('user_role') as UserRole;
      if (!isAuth) navigate('/login');
      setUserRole(role);
  }, [navigate]);

  const canEdit = useMemo(() => {
    return userRole === UserRole.ADMIN_SME || userRole === UserRole.DIRECTOR;
  }, [userRole]);

  const handleUpdateStudent = async (updated: RegistryStudent) => {
    const newStudents = students.map(s => s.id === updated.id ? updated : s);
    try {
        await updateStudents(newStudents);
        addToast('Registro atualizado no sistema central.', 'success');
    } catch (e) {
        addToast('Erro na sincronização.', 'error');
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = student.name.toLowerCase().includes(searchLower) || (student.cpf && student.cpf.includes(searchTerm));
      const matchesSchool = schoolFilter === 'Todas' || student.school === schoolFilter;
      const matchesStatus = statusFilter === 'Todos' || student.status === statusFilter;
      const matchesShift = shiftFilter === 'Todos' || student.shift === shiftFilter;
      const matchesZone = zoneFilter === 'Todas' || (student.residenceZone || 'Urbana') === zoneFilter;

      return matchesSearch && matchesSchool && matchesStatus && matchesShift && matchesZone;
    });
  }, [students, searchTerm, schoolFilter, statusFilter, shiftFilter, zoneFilter]);

  const sortedStudents = useMemo(() => {
      const data = [...filteredStudents];
      data.sort((a, b) => {
          const field = sortField as keyof RegistryStudent;
          let valA: any = a[field] || '';
          let valB: any = b[field] || '';
          if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
      });
      return data;
  }, [filteredStudents, sortField, sortDirection]);

  const filteredSchools = useMemo(() => {
      return schools.filter(school => school.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [schools, searchTerm]);

  const currentTotalItems = activeTab === 'students' ? sortedStudents.length : filteredSchools.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = useMemo(() => {
      const data = activeTab === 'students' ? sortedStudents : filteredSchools;
      return data.slice(startIndex, startIndex + itemsPerPage);
  }, [activeTab, sortedStudents, filteredSchools, startIndex, itemsPerPage]);

  const handleExportCSV = () => {
    const headers = ["Nome", "Escola", "Turma", "Status"];
    const rows = sortedStudents.map(s => [`"${s.name}"`, `"${s.school}"`, `"${s.className || '-'}"`, `"${s.status}"`]);
    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `gestao_educa_${Date.now()}.csv`;
    link.click();
  };

  const SortHeader = ({ label, field }: { label: string; field: string }) => (
      <th 
          className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:bg-slate-50 transition"
          onClick={() => { setSortField(field); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); }}
      >
          <div className="flex items-center gap-2">
              {label}
              {sortField === field && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
          </div>
      </th>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">Painel de <span className="text-indigo-600">Gestão Estratégica</span></h1>
                <p className="text-slate-500 font-medium">Administração centralizada da rede municipal de {userRole}.</p>
            </div>
            <div className="flex flex-wrap gap-4">
                 <button onClick={handleExportCSV} className="flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition shadow-sm">
                    <FileSpreadsheet className="h-4 w-4" /> Exportar Dados
                 </button>
                 <button onClick={() => setIsViewerOpen(true)} className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-100 transition">
                    <FileTerminal className="h-4 w-4" /> Logs
                 </button>
            </div>
        </header>

        {/* Abas e Filtros */}
        <div className="bg-white p-6 rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-6 pb-6 border-b border-slate-50">
                <div className="flex p-1.5 bg-slate-100 rounded-2xl w-full lg:w-fit">
                    <button onClick={() => setActiveTab('students')} className={`flex-1 lg:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'students' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}>Estudantes</button>
                    <button onClick={() => setActiveTab('schools')} className={`flex-1 lg:px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'schools' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}>Unidades Escolares</button>
                </div>
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar registro nominal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-700 shadow-inner"
                    />
                </div>
            </div>

            {activeTab === 'students' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in duration-500">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Unidade</label>
                        <select value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none">
                            <option value="Todas">Todas as Escolas</option>
                            {schools.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Situação</label>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none">
                            <option value="Todos">Todos os Status</option>
                            <option value="Matriculado">Matriculado</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Em Análise">Em Análise</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Turno</label>
                        <select value={shiftFilter} onChange={e => setShiftFilter(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none">
                            <option value="Todos">Todos os Turnos</option>
                            <option value="Matutino">Matutino</option>
                            <option value="Vespertino">Vespertino</option>
                            <option value="Integral">Integral</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Localização</label>
                        <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none">
                            <option value="Todas">Zonas Urbana e Rural</option>
                            <option value="Urbana">Apenas Urbana</option>
                            <option value="Rural">Apenas Rural</option>
                        </select>
                    </div>
                </div>
            )}
        </div>

        {/* Tabela Principal */}
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden relative z-10 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            {activeTab === 'students' ? (
                                <>
                                    <th className="px-8 py-5 w-16"></th>
                                    <SortHeader label="Estudante" field="name" />
                                    <SortHeader label="Unidade Vinculada" field="school" />
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">AEE / Transp.</th>
                                    <SortHeader label="Situação" field="status" />
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade Escolar</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Endereço / Localidade</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Vagas Totais</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedData.map((item: any) => (
                            <React.Fragment key={item.id}>
                                <tr className={`group hover:bg-slate-50 transition-all ${expandedSchoolId === item.id ? 'bg-indigo-50/30' : ''}`}>
                                    {activeTab === 'students' ? (
                                        <>
                                            <td className="px-8 py-6">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                                                    {item.photo ? <img src={item.photo} className="w-full h-full object-cover" /> : <User className="h-6 w-6 text-slate-300" />}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-900 tracking-tight">{item.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">CPF: {item.cpf || 'Pendente'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Building className="h-3 w-3 text-slate-300" />
                                                    <span className="text-sm font-bold text-slate-600">{item.school || 'Aguardando Alocação'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-2">
                                                    {item.specialNeeds && <HeartPulse className="h-5 w-5 text-pink-500" title="AEE" />}
                                                    {item.transportRequest && <Bus className="h-5 w-5 text-orange-500" title="Transporte" />}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${item.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{item.status}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    {canEdit && (
                                                        <button onClick={() => setEditingStudent(item)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-xl transition shadow-sm">
                                                            <Edit3 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button onClick={() => removeStudent(item.id)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 rounded-xl transition shadow-sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-8 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                        <Building className="h-6 w-6" />
                                                    </div>
                                                    <p className="font-black text-slate-900 tracking-tight">{item.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-8 text-sm font-medium text-slate-500">{item.address}</td>
                                            <td className="px-8 py-8 text-center font-black text-slate-900 text-lg">{item.availableSlots}</td>
                                            <td className="px-8 py-8 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button 
                                                        onClick={() => setExpandedSchoolId(expandedSchoolId === item.id ? null : item.id)}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 transition shadow-lg"
                                                    >
                                                        <Users className="h-3.5 w-3.5" />
                                                        {expandedSchoolId === item.id ? 'Ocultar Alunos' : 'Ver Alunos'}
                                                    </button>
                                                    <button onClick={() => removeSchool(item.id)} className="p-3 bg-white border border-slate-200 text-slate-300 hover:text-red-500 rounded-xl transition">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                                
                                {/* Aba de expansão da Escola (Alunos Matriculados nela) */}
                                {activeTab === 'schools' && expandedSchoolId === item.id && (
                                    <tr className="animate-in slide-in-from-top-2 duration-300">
                                        <td colSpan={4} className="p-0">
                                            <div className="bg-slate-50/80 p-10 border-y border-slate-100">
                                                <div className="flex justify-between items-center mb-8">
                                                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-3">
                                                        <GraduationCap className="h-5 w-5" />
                                                        Quadro Nominal de Alunos • {item.name}
                                                    </h4>
                                                    <span className="bg-white px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                        Total: {students.filter(s => s.school === item.name).length} registros
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {students.filter(s => s.school === item.name).map(studentInSchool => (
                                                        <div key={studentInSchool.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group/item hover:border-indigo-200 transition-colors">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                                                                    <User className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-800 text-sm tracking-tight truncate max-w-[150px]">{studentInSchool.name}</p>
                                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{studentInSchool.className || 'Sem Turma'}</p>
                                                                </div>
                                                            </div>
                                                            {canEdit && (
                                                                <button 
                                                                    onClick={() => setEditingStudent(studentInSchool)}
                                                                    className="p-2 bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover/item:opacity-100"
                                                                >
                                                                    <Edit3 className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {students.filter(s => s.school === item.name).length === 0 && (
                                                        <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold uppercase tracking-widest text-xs">
                                                            Nenhum aluno matriculado nesta unidade
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

            {/* Paginação */}
            <div className="bg-slate-50/50 px-10 py-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Exibindo {startIndex + 1} a {Math.min(startIndex + itemsPerPage, currentTotalItems)} de {currentTotalItems} registros
                </span>

                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 disabled:opacity-30 transition shadow-sm">
                        <ChevronsLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 disabled:opacity-30 transition shadow-sm">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-6 text-sm font-black text-slate-900">{currentPage}</span>
                    <button onClick={() => setCurrentPage(p => p + 1)} disabled={startIndex + itemsPerPage >= currentTotalItems} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 disabled:opacity-30 transition shadow-sm">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        {/* Modal de Edição */}
        {editingStudent && (
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