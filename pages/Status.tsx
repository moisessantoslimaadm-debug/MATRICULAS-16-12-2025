import React, { useState } from 'react';
import { useSearchParams, Link } from '../router';
import { CheckCircle, Search, UserCheck, AlertCircle, Clock, ShieldCheck, Zap, Printer, ArrowRight, Package } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { RegistryStudent } from '../types';

export const Status: React.FC = () => {
  const { students } = useData();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  
  const [studentInput, setStudentInput] = useState('');
  const [searchResults, setSearchResults] = useState<RegistryStudent[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput.trim()) return;
    const term = studentInput.toLowerCase().trim();
    const found = students.filter(s => s.name.toLowerCase().includes(term) || (s.enrollmentId && s.enrollmentId.toLowerCase().includes(term)));
    setSearchResults(found);
    setHasSearched(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-8 fade-in-premium">
        <div className="bg-white rounded-[5rem] shadow-2xl border border-emerald-50 p-24 max-w-2xl w-full text-center">
          <div className="w-44 h-44 bg-emerald-50 rounded-[4rem] flex items-center justify-center mx-auto mb-16 shadow-xl shadow-emerald-50 animate-float">
            <CheckCircle className="h-24 w-24 text-emerald-600" />
          </div>
          <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-none mb-8">Registro <br/><span className="text-emerald-600">Efetivado.</span></h2>
          <p className="text-slate-500 font-medium text-2xl mb-16 leading-relaxed">Seu protocolo nominal foi transmitido para a rede municipal de ensino.</p>
          <div className="bg-slate-900 py-12 px-12 rounded-[4rem] mb-16 border border-slate-800 shadow-2xl shadow-slate-300">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">Número do Protocolo</p>
            <span className="text-6xl font-black text-emerald-400 tracking-tighter">MAT-{Math.floor(Math.random() * 900000) + 100000}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             <button onClick={() => window.print()} className="py-7 bg-white border border-slate-200 text-slate-400 rounded-[2.5rem] font-black text-[11px] uppercase tracking-ultra hover:text-slate-600 transition shadow-sm flex items-center justify-center gap-4 active:scale-95"><Printer className="h-5 w-5" /> Imprimir</button>
             <Link to="/" className="py-7 bg-emerald-600 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-ultra hover:bg-emerald-700 transition shadow-2xl shadow-emerald-100 flex items-center justify-center gap-4 active:scale-95">Voltar <Zap className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-8 fade-in-premium">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 rounded-full mb-8">
                <Package className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Rastreio Logístico SME</span>
            </div>
            <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">Protocolo <br/> de <span className="text-emerald-600">Vaga.</span></h1>
            <p className="text-slate-500 font-medium text-2xl tracking-tight leading-relaxed">Consulte a situação nominal e alocação escolar.</p>
        </header>

        <form onSubmit={handleSearch} className="mb-24 relative group">
            <div className="absolute left-10 top-1/2 -translate-y-1/2 h-10 w-10 text-slate-200 group-focus-within:text-emerald-600 transition-colors">
                <Search className="h-full w-full" />
            </div>
            <input 
                type="text" placeholder="Nome do aluno ou protocolo..." value={studentInput} onChange={e => setStudentInput(e.target.value)}
                className="w-full pl-28 pr-12 py-10 bg-white border border-slate-200 rounded-[4.5rem] shadow-2xl shadow-slate-100 focus:ring-[20px] focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-black text-slate-700 text-2xl"
            />
            <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-14 py-6 rounded-[3.5rem] font-black text-[12px] uppercase tracking-ultra hover:bg-emerald-600 transition-all active:scale-95">Consultar</button>
        </form>

        <div className="space-y-12">
            {searchResults.map(s => (
                <div key={s.id} className="bg-white rounded-[4.5rem] p-16 shadow-2xl shadow-slate-100 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12 group hover:border-emerald-500/30 transition-all duration-700">
                    <div className="flex items-center gap-12">
                        <div className="w-28 h-28 rounded-[3rem] bg-slate-50 border-[6px] border-white shadow-xl flex items-center justify-center overflow-hidden transition-transform group-hover:rotate-6">
                            {s.photo ? <img src={s.photo} className="w-full h-full object-cover" /> : <UserCheck className="h-12 w-12 text-slate-200" />}
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-5 uppercase">{s.name}</h3>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-5">
                                {s.enrollmentId} <span className="w-2 h-2 rounded-full bg-slate-200"></span> {s.school || 'Aguardando Alocação'}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-6">
                        <span className={`px-10 py-4 rounded-full text-[11px] font-black uppercase tracking-ultra border shadow-xl ${s.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-100'}`}>{s.status}</span>
                        <div className="flex items-center gap-3 opacity-40">
                            <Clock className="h-4 w-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Sincronizado {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            ))}
            
            {hasSearched && searchResults.length === 0 && (
                <div className="py-40 text-center border-[6px] border-dashed border-slate-100 rounded-[5rem] animate-pulse">
                    <AlertCircle className="h-20 w-20 text-slate-100 mx-auto mb-10" />
                    <p className="text-slate-300 font-black text-2xl uppercase tracking-[0.4em]">Protocolo não localizado na rede</p>
                </div>
            )}
        </div>

        <div className="mt-40 p-16 bg-slate-900 rounded-[5rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-40 -mt-40 transition-transform group-hover:scale-150"></div>
            <ShieldCheck className="h-20 w-20 text-emerald-400 mb-10" />
            <h3 className="text-6xl font-black tracking-tighter mb-8 leading-none">Canal de Suporte.</h3>
            <p className="text-slate-400 text-2xl font-medium mb-12 max-w-2xl leading-relaxed">Dúvidas sobre o status da matrícula nominal podem ser sanadas via Central 156 ou no Portal do Aluno.</p>
            <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-5 bg-white/5 px-10 py-5 rounded-[2.5rem] border border-white/10 group hover:bg-white/10 transition-colors cursor-pointer">
                    <Zap className="h-6 w-6 text-emerald-400" />
                    <span className="text-sm font-black uppercase tracking-widest">Suporte IA "Edu"</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};