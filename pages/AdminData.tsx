import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { useNavigate } from '../router';
import { 
  Search, Filter, Trash2, Download, RefreshCw, LogOut, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User, School as SchoolIcon, 
  FileText, ArrowUp, ArrowDown, ArrowUpDown, ChevronDown, 
  FileTerminal, Hash, Home, Navigation, FileSpreadsheet, Layers, MapPin,
  HeartPulse, Bus, CheckCircle2, XCircle, List
} from 'lucide-react';
import { RegistryStudent, School } from '../types';

export const AdminData: React.FC = () => {
  const { students, schools, removeStudent, removeSchool, resetData, registerBackup, isLoading, updateStudents } = useData();
  const { addToast } = useToast();
  const { setIsViewerOpen } = useLog();
  const navigate = useNavigate();

  // Estados de Visualização e Paginação
  const [activeTab, setActiveTab] = useState<'students' | 'schools'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estados de Ordenação
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Estados de Filtros
  const [schoolFilter, setSchoolFilter] = useState('Todas');
  const [isSchoolFilterOpen, setIsSchoolFilterOpen] = useState(false);
  const [schoolFilterSearch, setSchoolFilterSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState('Todos');
  const [shiftFilter, setShiftFilter] = useState('Todos');
  const [classFilter, setClassFilter] = useState('Todas');
  const [zoneFilter, setZoneFilter] = useState('Todas');
  const [transportFilter, setTransportFilter] = useState('Todos');
  const [aeeFilter, setAeeFilter] = useState('Todos');

  // Segurança: Verifica se o administrador está autenticado
  useEffect(() => {
      const isAuth = sessionStorage.getItem('admin_auth') === 'true';
      if (!isAuth) {
          navigate('/login');
      }
  }, [navigate]);

  // RESET DE PAGINAÇÃO: Sempre que um critério de busca ou filtro mudar, volta para a primeira página
  useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm, schoolFilter, shiftFilter, classFilter, statusFilter, transportFilter, zoneFilter, aeeFilter, activeTab, itemsPerPage]);

  // Extrai turmas únicas do banco para preencher o dropdown de filtro
  const uniqueClasses = useMemo(() => {
    const classes = students
      .map(s => s.className)
      .filter((c): c is string => !!c && c !== 'Definição Pendente');
    return Array.from(new Set(classes)).sort();
  }, [students]);

  const handleSort = (field: string) => {
      if (sortField === field) {
          setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
          setSortField(field);
          setSortDirection('asc');
      }
  };

  // 1. FILTRAGEM DINÂMICA
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        student.name.toLowerCase().includes(searchLower) ||
        (student.cpf && student.cpf.includes(searchTerm)) ||
        (student.enrollmentId && student.enrollmentId.toLowerCase().includes(searchLower));

      const matchesSchool = schoolFilter === 'Todas' || student.school === schoolFilter;
      const matchesStatus = statusFilter === 'Todos' || student.status === statusFilter;
      const matchesClass = classFilter === 'Todas' || student.className === classFilter;
      const matchesShift = shiftFilter === 'Todos' || student.shift === shiftFilter;
      
      const studentZone = student.residenceZone || 'Urbana';
      const matchesZone = zoneFilter === 'Todas' || studentZone === zoneFilter;

      const matchesAee = aeeFilter === 'Todos' 
        ? true 
        : aeeFilter === 'Sim' ? student.specialNeeds 
        : !student.specialNeeds;
      
      const matchesTransport = transportFilter === 'Todos' 
        ? true 
        : transportFilter === 'Sim' ? student.transportRequest 
        : !student.transportRequest;

      return matchesSearch && matchesSchool && matchesStatus && matchesShift && matchesTransport && matchesZone && matchesClass && matchesAee;
    });
  }, [students, searchTerm, schoolFilter, statusFilter, shiftFilter, classFilter, transportFilter, zoneFilter, aeeFilter]);

  // 2. ORDENAÇÃO
  const sortedStudents = useMemo(() => {
      const data = [...filteredStudents];
      data.sort((a, b) => {
          const field = sortField as keyof RegistryStudent;
          let valA: any = a[field];
          let valB: any = b[field];

          if (typeof valA === 'boolean') {
              valA = valA ? 1 : 0;
              valB = valB ? 1 : 0;
          } else {
              valA = (valA || '').toString().toLowerCase();
              valB = (valB || '').toString().toLowerCase();
          }

          if (sortField === 'cpf') {
             valA = valA.replace(/\D/g, '');
             valB = valB.replace(/\D/g, '');
          }

          if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
      });
      return data;
  }, [filteredStudents, sortField, sortDirection]);

  // Filtragem de escolas
  const filteredSchools = useMemo(() => {
      return schools.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [schools, searchTerm]);

  // 3. CÁLCULO DE PAGINAÇÃO
  const currentTotalItems = activeTab === 'students' ? sortedStudents.length : filteredSchools.length;
  const totalPages = Math.ceil(currentTotalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, currentTotalItems);

  const paginatedData = useMemo(() => {
      const data = activeTab === 'students' ? sortedStudents : filteredSchools;
      return data.slice(startIndex, startIndex + itemsPerPage);
  }, [activeTab, sortedStudents, filteredSchools, startIndex, itemsPerPage]);

  // Gerador de páginas visíveis
  const pageNumbers = useMemo(() => {
    const pages = [];
    const delta = 2; // Número de páginas adjacentes à atual para mostrar
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  const handleExportCSV = () => {
    if (activeTab !== 'students') return;
    const headers = ["Nome do Aluno", "CPF", "Matrícula", "Escola", "Turma", "Turno", "Zona", "AEE", "Transporte", "Status"];
    const rows = sortedStudents.map(s => [
        `"${s.name}"`, `"${s.cpf || ''}"`, `"${s.enrollmentId || ''}"`, `"${s.school || 'Não alocada'}"`, `"${s.className || '-'}"`, `"${s.shift || '-'}"`, `"${s.residenceZone || 'Urbana'}"`, `"${s.specialNeeds ? 'SIM' : 'NÃO'}"`, `"${s.transportRequest ? 'SIM' : 'NÃO'}"`, `"${s.status}"`
    ]);
    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio_matriculas_filtrado_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Relatório CSV gerado com sucesso!', 'success');
  };

  const SortHeader = ({ label, field, icon: Icon }: { label: string; field: string; icon?: any }) => (
      <th 
          className="px-6 py-4 text-xs font-bold text-slate-500 uppercase cursor-pointer hover:bg-slate-100 transition select-none group"
          onClick={() => handleSort(field)}
      >
          <div className="flex items-center gap-1.5">
              {Icon && <Icon className="h-3 w-3 opacity-60" />}
              {label}
              {sortField === field ? (
                  sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-blue-600" /> : <ArrowDown className="h-3 w-3 text-blue-600" />
              ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-30 transition-opacity" />
              )}
          </div>
      </th>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Gestão de Dados</h1>
                <p className="text-slate-600 mt-1">Administração, auditoria e exportação da rede municipal.</p>
            </div>
            <div className="flex flex-wrap gap-2">
                 {activeTab === 'students' && (
                    <button 
                        onClick={handleExportCSV}
                        disabled={sortedStudents.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition shadow-md disabled:opacity-50 disabled:grayscale"
                    >
                        <FileSpreadsheet className="h-4 w-4" /> Exportar CSV Filtrado
                    </button>
                 )}
                 <button 
                    onClick={() => setIsViewerOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition"
                 >
                    <FileTerminal className="h-4 w-4" /> Logs
                 </button>
                 <button 
                    onClick={() => { sessionStorage.removeItem('admin_auth'); navigate('/login'); }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium transition"
                 >
                    <LogOut className="h-4 w-4" /> Sair
                 </button>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-4 border-b border-slate-100 pb-4">
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setActiveTab('students')} className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${activeTab === 'students' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        Alunos
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'students' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                            {filteredStudents.length}
                        </span>
                    </button>
                    <button onClick={() => setActiveTab('schools')} className={`px-4 py-2 rounded-md text-sm font-bold transition flex items-center gap-2 ${activeTab === 'schools' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        Escolas
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'schools' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                            {filteredSchools.length}
                        </span>
                    </button>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, CPF ou matrícula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            {activeTab === 'students' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 relative z-20">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                            <option value="Todos">Todos</option>
                            <option value="Matriculado">Matriculado</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Em Análise">Em Análise</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Escola</label>
                        <div className="relative">
                            <button onClick={() => setIsSchoolFilterOpen(!isSchoolFilterOpen)} className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-left flex justify-between items-center outline-none transition-colors hover:border-slate-400">
                                <span className="truncate">{schoolFilter}</span>
                                <ChevronDown className="h-3 w-3 text-slate-500" />
                            </button>
                            {isSchoolFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsSchoolFilterOpen(false)}></div>
                                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-2xl max-h-72 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                                        <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0">
                                            <div className="relative">
                                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                                <input 
                                                    type="text" 
                                                    placeholder="Pesquisar unidade..." 
                                                    value={schoolFilterSearch} 
                                                    onChange={(e) => setSchoolFilterSearch(e.target.value)} 
                                                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded outline-none focus:border-blue-400" 
                                                    autoFocus 
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto custom-scrollbar">
                                            <div 
                                                onClick={() => { setSchoolFilter('Todas'); setIsSchoolFilterOpen(false); }} 
                                                className={`px-3 py-2.5 text-xs hover:bg-blue-50 cursor-pointer flex items-center justify-between ${schoolFilter === 'Todas' ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}
                                            >
                                                Todas as Escolas
                                                {schoolFilter === 'Todas' && <CheckCircle2 className="h-3 w-3" />}
                                            </div>
                                            {schools
                                                .filter(s => s.name.toLowerCase().includes(schoolFilterSearch.toLowerCase()))
                                                .map(s => (
                                                <div 
                                                    key={s.id} 
                                                    onClick={() => { setSchoolFilter(s.name); setIsSchoolFilterOpen(false); }} 
                                                    className={`px-3 py-2.5 text-xs hover:bg-blue-50 cursor-pointer border-t border-slate-50 flex items-center justify-between ${schoolFilter === s.name ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}
                                                >
                                                    {s.name}
                                                    {schoolFilter === s.name && <CheckCircle2 className="h-3 w-3" />}
                                                </div>
                                            ))}
                                            {schools.filter(s => s.name.toLowerCase().includes(schoolFilterSearch.toLowerCase())).length === 0 && (
                                                <div className="p-4 text-center text-slate-400 text-[10px]">Nenhuma escola encontrada</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Turma</label>
                        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none cursor-pointer">
                            <option value="Todas">Todas</option>
                            {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Turno</label>
                        <select value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg text-xs bg-white cursor-pointer">
                            <option value="Todos">Todos</option>
                            <option value="Matutino">Matutino</option>
                            <option value="Vespertino">Vespertino</option>
                            <option value="Integral">Integral</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Zona</label>
                        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg text-xs bg-white cursor-pointer">
                            <option value="Todas">Todas</option>
                            <option value="Urbana">Urbana</option>
                            <option value="Rural">Rural</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">AEE</label>
                        <select value={aeeFilter} onChange={(e) => setAeeFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg text-xs bg-white cursor-pointer">
                            <option value="Todos">Todos</option>
                            <option value="Sim">Sim (Especial)</option>
                            <option value="Não">Não (Regular)</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Transporte</label>
                        <select value={transportFilter} onChange={(e) => setTransportFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg text-xs bg-white cursor-pointer">
                            <option value="Todos">Todos</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </div>
                </div>
            )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative z-10">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {activeTab === 'students' ? (
                                <>
                                    <th className="px-6 py-4 w-12">Foto</th>
                                    <SortHeader label="Aluno" field="name" />
                                    <SortHeader label="CPF / Matrícula" field="cpf" />
                                    <SortHeader label="Escola" field="school" />
                                    <SortHeader label="Turno" field="shift" />
                                    <SortHeader label="Zona" field="residenceZone" />
                                    <SortHeader label="AEE" field="specialNeeds" icon={HeartPulse} />
                                    <SortHeader label="Status" field="status" />
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nome da Unidade</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Localização / INEP</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Vagas</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {paginatedData.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition group">
                                {activeTab === 'students' ? (
                                    <>
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                                                {item.photo ? (
                                                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-slate-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{item.className || 'Sem Turma'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-slate-600 text-xs">{item.cpf || '-'}</div>
                                            <div className="text-[10px] text-blue-500 font-mono">{item.enrollmentId}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="truncate max-w-[140px] font-medium text-slate-700">{item.school || 'Pendente'}</div>
                                            {item.transportRequest && (
                                                <div className="flex items-center gap-1 text-[9px] text-orange-600 font-bold uppercase">
                                                    <Bus className="h-2.5 w-2.5" /> Com Transporte
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium">{item.shift || '-'}</td>
                                        <td className="px-6 py-4">
                                            {item.residenceZone === 'Rural' ? (
                                                <span className="flex items-center gap-1.5 text-indigo-600 font-bold">
                                                    <Navigation className="h-3 w-3" /> Rural
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                                                    <Home className="h-3 w-3" /> Urbana
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.specialNeeds ? (
                                                <div className="flex flex-col items-center gap-0.5 text-pink-600" title="Atendimento Educacional Especializado">
                                                    <HeartPulse className="h-4 w-4" />
                                                    <span className="text-[9px] font-bold uppercase">Sim</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                                item.status === 'Matriculado' ? 'bg-green-50 text-green-700 border-green-200' :
                                                item.status === 'Pendente' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                                'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => navigate(`/student/monitoring?id=${item.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600 transition hover:bg-blue-50 rounded-lg" title="Perfil e Monitoramento"><FileText className="h-4 w-4" /></button>
                                                <button onClick={() => removeStudent(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition hover:bg-red-50 rounded-lg" title="Excluir"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-500">INEP: {item.inep || 'N/A'} • {item.address}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="font-bold text-slate-700">{item.availableSlots}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">Capacidade</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => removeSchool(item.id)} className="p-2 text-slate-400 hover:text-red-600 transition hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan={activeTab === 'students' ? 10 : 4} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 text-slate-400">
                                        <Search className="h-10 w-10 opacity-20" />
                                        <p className="italic">Nenhum registro encontrado com os critérios de busca atuais.</p>
                                        <button onClick={() => { setSearchTerm(''); setSchoolFilter('Todas'); setStatusFilter('Todos'); }} className="text-blue-600 text-xs font-bold hover:underline">Limpar Filtros</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginação Robusta */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tight whitespace-nowrap">
                        Exibindo {startIndex + 1}-{endIndex} de {currentTotalItems} registros
                    </span>
                    <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Itens por página:</label>
                        <select 
                            value={itemsPerPage} 
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="bg-white border border-slate-300 rounded text-xs p-1 outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    {/* Botões de Navegação Direta */}
                    <button 
                        onClick={() => setCurrentPage(1)} 
                        disabled={currentPage === 1 || totalPages === 0} 
                        className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition disabled:opacity-30 shadow-sm group"
                        title="Primeira Página"
                    >
                        <ChevronsLeft className="h-4 w-4 text-slate-600 group-hover:text-blue-600" />
                    </button>
                    
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1 || totalPages === 0} 
                        className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition disabled:opacity-30 shadow-sm group"
                        title="Anterior"
                    >
                        <ChevronLeft className="h-4 w-4 text-slate-600 group-hover:text-blue-600" />
                    </button>

                    {/* Números de Página */}
                    <div className="hidden sm:flex items-center gap-1 px-2">
                        {pageNumbers.map((page, idx) => (
                            page === '...' ? (
                                <span key={`dots-${idx}`} className="px-2 text-slate-400 text-xs font-bold">...</span>
                            ) : (
                                <button
                                    key={`page-${page}`}
                                    onClick={() => setCurrentPage(page as number)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                                        currentPage === page 
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                                        : 'bg-white border border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        ))}
                    </div>

                    {/* Indicador Mobile */}
                    <div className="sm:hidden bg-white border border-slate-300 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm min-w-[100px] text-center">
                        Pág {currentPage} de {Math.max(1, totalPages)}
                    </div>

                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages || totalPages === 0} 
                        className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition disabled:opacity-30 shadow-sm group"
                        title="Próxima"
                    >
                        <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-blue-600" />
                    </button>

                    <button 
                        onClick={() => setCurrentPage(totalPages)} 
                        disabled={currentPage === totalPages || totalPages === 0} 
                        className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition disabled:opacity-30 shadow-sm group"
                        title="Última Página"
                    >
                        <ChevronsRight className="h-4 w-4 text-slate-600 group-hover:text-blue-600" />
                    </button>
                </div>
            </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};