import React, { useState, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { useNavigate } from '../router';
import { 
  Search, Trash2, User, ChevronLeft, ChevronRight, 
  Building, FileSpreadsheet, Upload, Edit3, Loader2, 
  ArrowUp, ArrowDown, Zap, Filter
} from 'lucide-react';
import { UserRole } from '../types';

const SortHeader = ({ label, field, sortField, sortDirection, onSort }: any) => (
    <th 
        className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition border-b border-slate-200"
        onClick={() => onSort(field)}
    >
        <div className="flex items-center gap-2">
            {label}
            {sortField === field && (
                <span className="text-blue-600">
                    {sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                </span>
            )}
        </div>
    </th>
);

export const AdminData: React.FC = () => {
  const { students, schools, removeStudent } = useData();
  const { addToast } = useToast();
  const { addLog, setIsViewerOpen } = useLog();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'students' | 'schools'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isImporting, setIsImporting] = useState(false);

  const userData = useMemo(() => JSON.parse(sessionStorage.getItem('user_data') || '{}'), []);
  
  const handleSort = (field: string) => {
    if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortField(field);
        setSortDirection('asc');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    addLog(`Iniciando importação do arquivo: ${file.name}`, 'info');

    setTimeout(() => {
        setIsImporting(false);
        addToast(`Base nominal atualizada com sucesso.`, 'success');
        addLog(`Importação via Excel finalizada.`, 'info');
        if (event.target) event.target.value = '';
    }, 2000);
  };

  const filteredData = useMemo(() => {
    const data = activeTab === 'students' ? students : schools;
    return data.filter((item: any) => 
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.cpf && item.cpf.includes(searchTerm)) ||
        (item.enrollmentId && item.enrollmentId.includes(searchTerm))
    );
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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-8 page-transition">
      <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx, .xls" onChange={handleFileChange} />
      
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Gestão SME</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Base de Dados <span className="text-blue-600">Nominal.</span></h1>
            </div>
            <div className="flex flex-wrap gap-3">
                 <button 
                    onClick={handleImportClick}
                    disabled={isImporting}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-300 hover:bg-slate-50 transition shadow-sm active:scale-95 disabled:opacity-50"
                 >
                    {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-blue-600" />} 
                    Importar Excel
                 </button>
                 <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-300 hover:bg-slate-50 transition shadow-sm">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Exportar Censo
                 </button>
            </div>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-full md:w-fit">
                <button 
                    onClick={() => { setActiveTab('students'); setCurrentPage(1); }} 
                    className={`flex-1 md:px-10 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === 'students' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Alunos
                </button>
                <button 
                    onClick={() => { setActiveTab('schools'); setCurrentPage(1); }} 
                    className={`flex-1 md:px-10 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${activeTab === 'schools' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Escolas
                </button>
            </div>
            <div className="relative flex-1 group w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Filtrar por nome, CPF ou protocolo..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-700 text-sm"
                />
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr>
                            {activeTab === 'students' ? (
                                <>
                                    <th className="px-6 py-4 w-20"></th>
                                    <SortHeader label="Nome Completo" field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                    <SortHeader label="Escola Alocada" field="school" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unidade de Ensino</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Vagas Totais</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Ação</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.map((item: any) => (
                            <tr key={item.id} className="tr-premium">
                                {activeTab === 'students' ? (
                                    <>
                                        <td className="px-6 py-3 text-center">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                                {item.photo ? <img src={item.photo} className="w-full h-full object-cover" /> : <User className="h-5 w-5 text-slate-400" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <p className="font-bold text-slate-900 text-sm mb-1">{item.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">CPF: {item.cpf || 'Não Informado'}</p>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm text-slate-600 font-medium">{item.school || 'Pendente'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => navigate(`/student/monitoring?id=${item.id}`)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Editar Prontuário"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => removeStudent(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Remover">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 text-sm mb-1">{item.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{item.address}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-lg font-bold text-slate-900">{item.availableSlots}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="px-4 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">Ver Detalhes</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Mostrando {paginatedData.length} de {sortedData.length} registros</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 bg-white border border-slate-300 text-slate-400 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition"><ChevronLeft className="h-4 w-4" /></button>
                    <span className="text-sm font-bold text-slate-700 px-4">Página {currentPage}</span>
                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="p-2 bg-white border border-slate-300 text-slate-400 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition"><ChevronRight className="h-4 w-4" /></button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};