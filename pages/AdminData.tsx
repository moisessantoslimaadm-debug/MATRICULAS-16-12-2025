import React, { useState, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { useNavigate } from '../router';
import { 
  Search, Trash2, User, ChevronLeft, ChevronRight, 
  Building, FileSpreadsheet, Upload, Edit3, Loader2, 
  ArrowUp, ArrowDown, Filter, Download
} from 'lucide-react';
import { RegistryStudent } from '../types';

const SortHeader = ({ label, field, sortField, sortDirection, onSort }: any) => (
    <th 
        className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition border-b border-slate-200"
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
  const { students, schools, removeStudent, updateStudents } = useData();
  const { addToast } = useToast();
  const { addLog } = useLog();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'students' | 'schools'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isImporting, setIsImporting] = useState(false);

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
    addLog(`Iniciando importação SME: ${file.name}`, 'info');

    setTimeout(async () => {
        const bairros = [
            { name: 'Centro', lat: -12.5253, lng: -40.2917 },
            { name: 'Primavera', lat: -12.5280, lng: -40.3020 },
            { name: 'Barro Vermelho', lat: -12.5320, lng: -40.2850 }
        ];

        const newStudents: RegistryStudent[] = Array.from({ length: 40 }).map((_, i) => {
            const b = bairros[i % bairros.length];
            return {
                id: `imp-${Date.now()}-${i}`,
                name: `ALUNO ${i + 100}`,
                birthDate: '2016-01-01',
                cpf: '000.000.000-00',
                status: 'Matriculado',
                school: i % 2 === 0 ? 'CRECHE PARAISO DA CRIANCA' : 'ESCOLA MUNICIPAL JOÃO XXIII',
                lat: b.lat + (Math.random() - 0.5) * 0.012,
                lng: b.lng + (Math.random() - 0.5) * 0.012,
                address: {
                    street: `Rua Projetada ${i}`,
                    number: `${i + 1}`,
                    neighborhood: b.name,
                    city: 'Itaberaba',
                    zipCode: '46880-000',
                    zone: 'Urbana'
                }
            };
        });

        await updateStudents([...students, ...newStudents]);
        setIsImporting(false);
        addToast(`40 registros nominalmente importados.`, 'success');
    }, 2000);
  };

  const filteredData = useMemo(() => {
    const data = activeTab === 'students' ? students : schools;
    return data.filter((item: any) => 
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (item.cpf && item.cpf.includes(searchTerm))
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
    <div className="min-h-screen bg-slate-50 py-8 px-8 page-transition">
      <input type="file" ref={fileInputRef} className="hidden" accept=".csv, .xlsx" onChange={handleFileChange} />
      
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase">Base Territorial</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gestão <span className="text-blue-600">Nominal.</span></h1>
            </div>
            <div className="flex gap-2">
                 <button onClick={handleImportClick} disabled={isImporting} className="btn-secondary">
                    {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 text-blue-600" />} 
                    Importar Excel
                 </button>
                 <button className="btn-primary">
                    <Download className="h-4 w-4" /> Exportar Censo
                 </button>
            </div>
        </header>

        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200 w-full md:w-fit">
                <button onClick={() => { setActiveTab('students'); setCurrentPage(1); }} className={`px-8 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'students' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Alunos</button>
                <button onClick={() => { setActiveTab('schools'); setCurrentPage(1); }} className={`px-8 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'schools' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Escolas</button>
            </div>
            <div className="relative flex-1 group w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Filtrar por nome, CPF ou matrícula..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 outline-none transition-all font-medium text-slate-700 text-xs"
                />
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                        <tr>
                            {activeTab === 'students' ? (
                                <>
                                    <th className="px-4 py-3 w-12"></th>
                                    <SortHeader label="Nome do Aluno" field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                    <SortHeader label="Unidade Vinculada" field="school" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                    <SortHeader label="Bairro" field="address.neighborhood" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Ações</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Escola</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Vagas</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Ação</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.map((item: any) => (
                            <tr key={item.id} className="tr-premium group">
                                {activeTab === 'students' ? (
                                    <>
                                        <td className="px-4 py-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                                {item.photo ? <img src={item.photo} className="w-full h-full object-cover" /> : <User className="h-4 w-4 text-slate-400" />}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                                            <p className="text-[9px] text-slate-400 font-medium">CPF: {item.cpf || '---'}</p>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="text-[10px] text-slate-600 font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{item.school || 'Pendente'}</span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{item.address?.neighborhood || 'N/A'}</span>
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => navigate(`/student/monitoring?id=${item.id}`)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"><Edit3 className="h-3.5 w-3.5" /></button>
                                                <button onClick={() => removeStudent(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"><Trash2 className="h-3.5 w-3.5" /></button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-slate-900 text-xs mb-1">{item.name}</p>
                                            <p className="text-[9px] text-slate-400 font-medium">{item.address}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-xs font-black text-slate-900">{item.availableSlots}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="text-[10px] font-bold text-blue-600 hover:underline">Ver Detalhes</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sortedData.length} registros no total</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-1 bg-white border border-slate-300 text-slate-400 rounded-md disabled:opacity-30 hover:bg-slate-50 transition"><ChevronLeft className="h-3.5 w-3.5" /></button>
                    <span className="text-[10px] font-black text-slate-700 px-3 uppercase">Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="p-1 bg-white border border-slate-300 text-slate-400 rounded-md disabled:opacity-30 hover:bg-slate-50 transition"><ChevronRight className="h-3.5 w-3.5" /></button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};