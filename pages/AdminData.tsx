import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useLog } from '../contexts/LogContext';
import { useNavigate } from '../router';
import { 
  Search, Trash2, User, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Building, FileSpreadsheet,
  Edit3, X, Save, Loader2, Users, ArrowUp, ArrowDown, 
  ChevronDown, ShieldCheck, Zap, Filter, LayoutGrid
} from 'lucide-react';
import { RegistryStudent, School, UserRole } from '../types';

const SortHeader = ({ label, field, sortField, sortDirection, onSort }: any) => (
    <th 
        className="px-16 py-12 text-[11px] font-black text-slate-400 uppercase tracking-ultra cursor-pointer hover:bg-slate-50 transition border-b border-slate-50"
        onClick={() => onSort(field)}
    >
        <div className="flex items-center gap-5">
            {label}
            {sortField === field && (
                <div className="bg-emerald-50 p-1.5 rounded-lg">
                    {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 text-emerald-600" /> : <ArrowDown className="h-4 w-4 text-emerald-600" />}
                </div>
            )}
        </div>
    </th>
);

export const AdminData: React.FC = () => {
  const { students, schools, removeStudent, updateStudents } = useData();
  const { addToast } = useToast();
  const { setIsViewerOpen } = useLog();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'students' | 'schools'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const userData = useMemo(() => JSON.parse(sessionStorage.getItem('user_data') || '{}'), []);
  const canEdit = useMemo(() => userData.role === UserRole.ADMIN_SME || userData.role === UserRole.DIRECTOR, [userData]);

  const handleSort = (field: string) => {
    if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortField(field);
        setSortDirection('asc');
    }
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
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 mb-24">
            <div className="fade-in-premium">
                <div className="flex items-center gap-5 mb-10">
                    <span className="bg-emerald-600 text-white px-7 py-2.5 rounded-full text-[11px] font-black uppercase tracking-ultra shadow-2xl border border-emerald-500">Gestão Governamental</span>
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-200"></div>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-ultra">SME ITABERABA</span>
                </div>
                <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none mb-10 text-display uppercase">Controle <br/> de <span className="text-emerald-600">Rede.</span></h1>
                <p className="text-slate-500 font-medium text-3xl tracking-tight max-w-3xl leading-relaxed">Administração nominal centralizada e monitoramento de fluxo escolar em tempo real.</p>
            </div>
            <div className="flex flex-wrap gap-6 fade-in-premium" style={{animationDelay: '0.2s'}}>
                 <button className="flex items-center gap-6 px-12 py-8 bg-emerald-50 text-emerald-700 rounded-[3rem] font-black text-[11px] uppercase tracking-ultra border border-emerald-100 hover:bg-emerald-100 transition shadow-luxury active:scale-95">
                    <FileSpreadsheet className="h-8 w-8" /> Exportar Censo
                 </button>
                 <button onClick={() => setIsViewerOpen(true)} className="flex items-center gap-6 px-12 py-8 bg-slate-900 text-white rounded-[3rem] font-black text-[11px] uppercase tracking-ultra hover:bg-emerald-600 transition shadow-luxury active:scale-95">
                    <Zap className="h-8 w-8 text-emerald-400" /> Sistema Debug
                 </button>
            </div>
        </header>

        <div className="bg-white p-10 rounded-[4rem] shadow-luxury border border-slate-100 mb-16 flex flex-col xl:flex-row gap-10 items-center fade-in-premium" style={{animationDelay: '0.4s'}}>
            <div className="flex p-3 bg-slate-50 rounded-[3rem] border border-slate-100 w-full xl:w-fit shadow-inner">
                <button 
                    onClick={() => { setActiveTab('students'); setCurrentPage(1); }} 
                    className={`flex-1 xl:px-20 py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-ultra transition-all ${activeTab === 'students' ? 'bg-white text-emerald-600 shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Base Nominal
                </button>
                <button 
                    onClick={() => { setActiveTab('schools'); setCurrentPage(1); }} 
                    className={`flex-1 xl:px-20 py-6 rounded-[2.5rem] text-[11px] font-black uppercase tracking-ultra transition-all ${activeTab === 'schools' ? 'bg-white text-emerald-600 shadow-2xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Infraestrutura
                </button>
            </div>
            <div className="relative flex-1 group w-full">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-200 group-focus-within:text-emerald-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Filtrar por nome, CPF ou protocolo..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-24 pr-12 py-8 bg-slate-50 border border-transparent rounded-[3.5rem] focus:bg-white focus:border-emerald-600 focus:ring-8 focus:ring-emerald-50 outline-none transition-all font-black text-slate-700 text-xl shadow-inner"
                />
            </div>
        </div>

        <div className="bg-white rounded-[5rem] shadow-luxury overflow-hidden border border-slate-100 fade-in-premium" style={{animationDelay: '0.6s'}}>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr>
                            {activeTab === 'students' ? (
                                <>
                                    <th className="px-16 py-12 w-40"></th>
                                    <SortHeader label="Identificação Nominal" field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                    <SortHeader label="Alocação" field="school" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                                    <th className="px-16 py-12 text-[11px] font-black text-slate-400 uppercase tracking-ultra text-right">Gestão</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-16 py-12 text-[11px] font-black text-slate-400 uppercase tracking-ultra">Unidade de Ensino</th>
                                    <th className="px-16 py-12 text-[11px] font-black text-slate-400 uppercase tracking-ultra text-center">Capacidade</th>
                                    <th className="px-16 py-12 text-[11px] font-black text-slate-400 uppercase tracking-ultra text-right">Análise</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {paginatedData.map((item: any) => (
                            <tr key={item.id} className="transition-all hover:bg-slate-50 group">
                                {activeTab === 'students' ? (
                                    <>
                                        <td className="px-16 py-12">
                                            <div className="w-24 h-24 rounded-[3rem] bg-white border-[10px] border-white shadow-2xl flex items-center justify-center overflow-hidden transition-transform group-hover:rotate-6">
                                                {item.photo ? <img src={item.photo} className="w-full h-full object-cover" /> : <User className="h-12 w-12 text-slate-200" />}
                                            </div>
                                        </td>
                                        <td className="px-16 py-12">
                                            <p className="font-black text-slate-900 text-3xl tracking-tighter leading-none mb-4 uppercase">{item.name}</p>
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
                                                CPF: {item.cpf || 'PENDENTE'} <span className="h-2.5 w-2.5 rounded-full bg-slate-100"></span> ID: {item.enrollmentId || 'AUTO'}
                                            </p>
                                        </td>
                                        <td className="px-16 py-12">
                                            <div className="flex items-center gap-5">
                                                <div className="bg-emerald-50 p-4 rounded-3xl text-emerald-600 border border-emerald-100 shadow-sm">
                                                    <Building className="h-6 w-6" />
                                                </div>
                                                <span className="text-lg font-black text-slate-700 uppercase tracking-tight">{item.school || 'AGUARDANDO UNIDADE'}</span>
                                            </div>
                                        </td>
                                        <td className="px-16 py-12 text-right">
                                            <div className="flex justify-end gap-5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-12 group-hover:translate-x-0">
                                                <button className="p-7 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 rounded-[2.2rem] transition-all hover:shadow-2xl active:scale-90 shadow-sm">
                                                    <Edit3 className="h-8 w-8" />
                                                </button>
                                                {userData.role === UserRole.ADMIN_SME && (
                                                    <button onClick={() => removeStudent(item.id)} className="p-7 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 rounded-[2.2rem] transition-all hover:shadow-2xl active:scale-90 shadow-sm">
                                                        <Trash2 className="h-8 w-8" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-16 py-16">
                                            <div className="flex items-center gap-12">
                                                <div className="w-24 h-24 rounded-[3.5rem] bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-inner group-hover:rotate-12 transition-transform">
                                                    <Building className="h-12 w-12" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 tracking-tighter text-4xl leading-none mb-4 uppercase">{item.name}</p>
                                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest truncate max-w-lg">{item.address}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-16 py-16 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="font-black text-slate-900 text-5xl tracking-tighter mb-5">{students.filter(s => s.school === item.name).length} <span className="text-slate-200 mx-3">/</span> {item.availableSlots}</span>
                                                <div className="w-56 h-3 bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                                                    <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" style={{ width: `${(students.filter(s => s.school === item.name).length / item.availableSlots) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-16 py-16 text-right">
                                            <button className="px-16 py-7 bg-slate-900 text-white rounded-[3rem] font-black text-[11px] uppercase tracking-ultra hover:bg-emerald-600 transition-all shadow-luxury active:scale-95">Quadro Nominal</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-slate-50/50 px-20 py-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-8">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]"></div>
                    <span className="text-[13px] font-black text-slate-400 uppercase tracking-ultra">
                        Total: {sortedData.length} Registros Sincronizados
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-7 bg-white border border-slate-100 text-slate-400 rounded-3xl hover:text-emerald-600 disabled:opacity-20 transition shadow-xl active:scale-90"><ChevronLeft className="h-10 w-10" /></button>
                    <div className="bg-slate-900 text-white px-16 py-7 rounded-[2.5rem] font-black text-4xl shadow-2xl mx-6">{currentPage}</div>
                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="p-7 bg-white border border-slate-100 text-slate-400 rounded-3xl hover:text-emerald-600 disabled:opacity-20 transition shadow-xl active:scale-90"><ChevronRight className="h-10 w-10" /></button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};