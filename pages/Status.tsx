import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from '../router';
import { CheckCircle, FileText, Search, UserCheck, AlertCircle, Bus, School, Hash, Filter, ArrowUpDown, ArrowUp, ArrowDown, Printer, TrendingUp, Zap, Clock, ShieldCheck } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { RegistryStudent } from '../types';

export const Status: React.FC = () => {
  const { students } = useData();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const navigate = useNavigate();
  
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
      <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-8">
        <div className="bg-white rounded-[5rem] shadow-2xl border border-emerald-50 p-24 max-w-2xl w-full text-center animate-in zoom-in-95 duration-1000">
          <div className="w-40 h-40 bg-emerald-50 rounded-[3.5rem] flex items-center justify-center mx-auto mb-16 shadow-xl shadow-emerald-50 animate-float">
            <CheckCircle className="h-20 w-20 text-emerald-600" />
          </div>
          <h2 className="text-7xl font-black text-slate-900 tracking-tighter leading-none mb-8">Protocolo <br/><span className="text-emerald-600">Enviado.</span></h2>
          <p className="text-slate-500 font-medium text-2xl mb-16">Seu registro nominal foi transmitido para os servidores da SME Itaberaba.</p>
          <div className="bg-slate-900 py-10 px-12 rounded-[3.5rem] mb-20 border border-slate-800 shadow-2xl shadow-slate-200">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">Código de Rastreio</p>
            <span className="text-5xl font-black text-emerald-400 tracking-tighter">MAT-{Math.floor(Math.random() * 100000)}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             <button onClick={() => window.print()} className="py-7 bg-white border border-slate-200 text-slate-400 rounded-[2.5rem] font-black text-[11px] uppercase tracking-ultra hover:text-slate-600 transition shadow-sm active:scale-95 flex items-center justify-center gap-4"><Printer className="h-5 w-5" /> Imprimir Ficha</button>
             <Link to="/" className="py-7 bg-emerald-600 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-ultra hover:bg-emerald-700 transition shadow-2xl shadow-emerald-100 active:scale-95 flex items-center justify-center gap-4">Voltar Início <Zap className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-24 animate-in fade-in duration-1000">
            <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">Rastreio <br/> de <span className="text-emerald-600">Vaga.</span></h1>
            <p className="text-slate-500 font-medium text-2xl tracking-tight">Consulte a situação nominal da sua solicitação.</p>
        </header>

        <form onSubmit={handleSearch} className="mb-24 relative group animate-in slide-in-from-bottom-8 duration-1000">
            <div className="absolute left-10 top-1/2 -translate-y-1/2 h-10 w-10 text-slate-200 group-focus-within:text-emerald-600 transition-colors">
                <Search className="h-full w-full" />
            </div>
            <input 
                type="text" 
                placeholder="Insira o nome do aluno ou código do protocolo..." 
                value={studentInput}
                onChange={e => setStudentInput(e.target.value)}
                className="w-full pl-28 pr-12 py-10 bg-white border border-slate-200 rounded-[4rem] shadow-2xl shadow-slate-100 focus:ring-[16px] focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-black text-slate-700 text-2xl"
            />
            <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-12 py-5 rounded-[3rem] font-black text-[11px] uppercase tracking-ultra hover:bg-emerald-600 transition-all active:scale-95">Buscar</button>
        </form>

        <div className="space-y-12">
            {searchResults.map(s => (
                <div key={s.id} className="bg-white rounded-[4rem] p-16 shadow-2xl shadow-slate-100 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12 group hover:border-emerald-500/30 transition-all duration-700">
                    <div className="flex items-center gap-10">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-50 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                            {s.photo ? <img src={s.photo} className="w-full h-full object-cover rounded-[2.5rem]" /> : <UserCheck className="h-10 w-10 text-emerald-600" />}
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">{s.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
                                Protocolo: {s.enrollmentId} <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> Unidade: {s.school || 'Aguardando'}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-5">
                        <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-ultra border shadow-xl ${s.status === 'Matriculado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{s.status}</span>
                        <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-slate-300" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Atualizado: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            ))}
            
            {hasSearched && searchResults.length === 0 && (
                <div className="py-40 text-center border-4 border-dashed border-slate-100 rounded-[5rem] animate-pulse">
                    <AlertCircle className="h-16 w-16 text-slate-200 mx-auto mb-8" />
                    <p className="text-slate-300 font-black text-xl uppercase tracking-[0.5em]">Nenhum registro nominal localizado</p>
                </div>
            )}
        </div>

        <div className="mt-40 p-16 bg-slate-900 rounded-[5rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-40 -mt-40 transition-transform group-hover:scale-110"></div>
            <ShieldCheck className="h-16 w-16 text-emerald-400 mb-10" />
            <h3 className="text-5xl font-black tracking-tighter mb-8 leading-none">Precisa de Suporte?</h3>
            <p className="text-slate-400 text-xl font-medium mb-12 max-w-xl">Nossa equipe técnica da SME está disponível para resolver inconsistências cadastrais de segunda a sexta, das 08h às 17h.</p>
            <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-[2rem] border border-white/10">
                    <Zap className="h-5 w-5 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-widest">Central 156</span>
                </div>
                <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-[2rem] border border-white/10">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-widest">sme@itaberaba.gov.br</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};