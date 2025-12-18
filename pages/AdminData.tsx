import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { useNavigate } from '../router';
import { 
  Search, Trash2, LogOut, 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, User, 
  FileText, ArrowUp, ArrowDown, ArrowUpDown, ChevronDown, 
  FileTerminal, Home, Navigation, FileSpreadsheet,
  HeartPulse, Bus, CheckCircle2
} from 'lucide-react';
import { RegistryStudent, School } from '../types';

export const AdminData: React.FC = () => {
  const { students, schools, removeStudent, removeSchool, updateStudents } = useData();
  const { addToast } = useToast();
  const { setIsViewerOpen } = useLog();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'students' | 'schools'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [schoolFilter, setSchoolFilter] = useState('Todas');
  const [isSchoolFilterOpen, setIsSchoolFilterOpen] = useState(false);
  const [schoolFilterSearch, setSchoolFilterSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState('Todos');
  const [shiftFilter, setShiftFilter] = useState('Todos');
  const [classFilter, setClassFilter] = useState('Todas');
  const [zoneFilter, setZoneFilter] = useState('Todas');
  const [transportFilter, setTransportFilter] = useState('Todos');
  const [aeeFilter, setAeeFilter] = useState('Todos');

  useEffect(() => {
      const isAuth = sessionStorage.getItem('admin_auth') === 'true';
      if (!isAuth) {
          navigate('/login');
      }
  }, [navigate]);

  useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm, schoolFilter, shiftFilter, classFilter, statusFilter, transportFilter, zoneFilter, aeeFilter, activeTab, itemsPerPage]);

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
        : aeeFilter === 'Sim' ? !!student.specialNeeds 
        : !student.specialNeeds;
      
      const matchesTransport = transportFilter === 'Todos' 
        ? true 
        : transportFilter === 'Sim' ? !!student.transportRequest 
        : !student.transportRequest;

      return matchesSearch && matchesSchool && matchesStatus && matchesShift && matchesTransport && matchesZone && matchesClass && matchesAee;
    });
  }, [students, searchTerm, schoolFilter, statusFilter, shiftFilter, classFilter, transportFilter, zoneFilter, aeeFilter]);

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

  const filteredSchools = useMemo(() => {
      return schools.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [schools, searchTerm]);

  const currentTotalItems = activeTab === 'students' ? sortedStudents.length : filteredSchools.length;
  const totalPages = Math.ceil(currentTotalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, currentTotalItems);

  const paginatedData = useMemo(() => {
      const data = activeTab === 'students' ? sortedStudents : filteredSchools;
      return data.slice(startIndex, startIndex + itemsPerPage);
  }, [activeTab, sortedStudents, filteredSchools, startIndex, itemsPerPage]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const delta = 2;
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
    link.download = `relatorio_matriculas_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Relatório CSV gerado.', 'success');
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
                <p className="text-slate-600 mt-1">Administração e auditoria da rede municipal.</p>
            </div>
            <div className="flex flex-wrap gap-2">
                 {activeTab === 'students' && (
                    <button 
                        onClick={handleExportCSV}
                        disabled={sortedStudents.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition shadow-md disabled:opacity-50"
                    >
                        <FileSpreadsheet className="h-4 w-4" /> Exportar CSV
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
                        placeholder="Buscar registro..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {activeTab === 'students' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 relative z-20">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg text-xs bg-white cursor-pointer">
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
                                                    placeholder="Pesquisar..." 
                                                    value={schoolFilterSearch} 
                                                    onChange={(e) => setSchoolFilterSearch(e.target.value)} 
                                                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded outline-none" 
                                                    autoFocus 
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto">
                                            <div onClick={() => { setSchoolFilter('Todas'); setIsSchoolFilterOpen(false); }} className={`px-3 py-2.5 text-xs hover:bg-blue-50 cursor-pointer ${schoolFilter === 'Todas' ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}>Todas</div>
                                            {schools.filter(s => s.name.toLowerCase().includes(schoolFilterSearch.toLowerCase())).map(s => (
                                                <div key={s.id} onClick={() => { setSchoolFilter(s.name); setIsSchoolFilterOpen(false); }} className={`px-3 py-2.5 text-xs hover:bg-blue-50 cursor-pointer ${schoolFilter === s.name ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}>{s.name}</div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Turma</label>
                        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="p-2 border border-slate-300 rounded-lg text-xs bg-white cursor-pointer">
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
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1">Transp.</label>
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
                                    <SortHeader label="Identificação" field="cpf" />
                                    <SortHeader label="Escola" field="school" />
                                    <SortHeader label="Local" field="residenceZone" />
                                    <SortHeader label="AEE" field="specialNeeds" icon={HeartPulse} />
                                    <SortHeader label="Status" field="status" />
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Unidade</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Endereço</th>
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
                                            <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shadow-sm">
                                                {item.photo ? (
                                                    <img src={item.photo} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-slate-300" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.cpf || item.enrollmentId}</td>
                                        <td className="px-6 py-4 truncate max-w-[150px]">{item.school || 'Pendente'}</td>
                                        <td className="px-6 py-4">{item.residenceZone || 'Urbana'}</td>
                                        <td className="px-6 py-4 text-center">{item.specialNeeds ? <HeartPulse className="h-4 w-4 text-pink-500 mx-auto" /> : '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'Matriculado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => navigate(`/student/monitoring?id=${item.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600 transition" title="Ver"><FileText className="h-4 w-4" /></button>
                                                <button onClick={() => removeStudent(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition" title="Excluir"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-500">{item.address}</td>
                                        <td className="px-6 py-4 text-center font-bold">{item.availableSlots}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => removeSchool(item.id)} className="p-2 text-slate-400 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase">
                    Exibindo {startIndex + 1}-{endIndex} de {currentTotalItems}
                </span>

                <div className="flex items-center gap-1.5">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || totalPages === 0} className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition disabled:opacity-30">
                        <ChevronsLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || totalPages === 0} className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition disabled:opacity-30">
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="hidden sm:flex items-center gap-1">
                        {pageNumbers.map((page, idx) => (
                            page === '...' ? (
                                <span key={`dots-${idx}`} className="px-2 text-slate-400 text-xs font-bold">...</span>
                            ) : (
                                <button key={`page-${page}`} onClick={() => setCurrentPage(page as number)} className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === page ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                                    {page}
                                </button>
                            )
                        ))}
                    </div>

                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition disabled:opacity-30">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition disabled:opacity-30">
                        <ChevronsRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};