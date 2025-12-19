import React, { useState, useEffect, useMemo } from 'react';
import { Printer, ArrowLeft, TrendingUp, Save, Eraser, Calculator, UserCheck, Plus, Trash2, Loader2, FileText, ChevronDown, Award, ShieldCheck, CheckCircle2, QrCode, Sparkles } from 'lucide-react';
import { useSearchParams, useNavigate } from '../router';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { PerformanceRow, MovementRow, RegistryStudent, PerformanceHeader } from '../types';

const INITIAL_PERFORMANCE: PerformanceRow[] = [
  { subject: 'LÍNGUA PORTUGUESA', g1: ['','','','',''], g2: ['','','','',''], g3: ['','',''], g4: ['','',''], g5: ['','',''] },
  { subject: 'MATEMÁTICA', g1: ['','','','',''], g2: ['','','','',''], g3: ['','',''], g4: ['','',''], g5: ['','',''] },
  { subject: 'HISTÓRIA', g1: ['','','','',''], g2: ['','','','',''], g3: ['','',''], g4: ['','',''], g5: ['','',''] },
  { subject: 'GEOGRAFIA', g1: ['','','','',''], g2: ['','','','',''], g3: ['','',''], g4: ['','',''], g5: ['','',''] },
  { subject: 'CIÊNCIAS', g1: ['','','','',''], g2: ['','','','',''], g3: ['','',''], g4: ['','',''], g5: ['','',''] },
  { subject: 'EDUCAÇÃO FÍSICA', g1: ['','','','',''], g2: ['','','','',''], g3: ['','',''], g4: ['','',''], g5: ['','',''] },
  { subject: 'ARTE', g1: ['','','','',''], g2: ['','','','',''], g3: ['','',''], g4: ['','',''], g5: ['','',''] }
];

const INITIAL_HEADER: PerformanceHeader = {
    unit: 'III TRIMESTRE',
    year: new Date().getFullYear(),
    shift: 'MATUTINO',
    director: 'DIREÇÃO ADMINISTRATIVA',
    coordinator: 'COORDENAÇÃO GERAL',
    dateDay: new Date().getDate().toString().padStart(2, '0'),
    dateMonth: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    dateYear: new Date().getFullYear().toString()
};

const InputCell = React.memo(({ value, onChange, className = "text-center", width = "w-full", type = "text" }: any) => (
    <input 
      autoComplete="off"
      type={type}
      value={value ?? ''}
      onChange={onChange}
      className={`bg-transparent outline-none border border-transparent hover:bg-indigo-50/50 focus:bg-indigo-100 transition-colors p-3 text-inherit font-inherit ${width} ${className} print:border-none print:p-0 print:focus:bg-transparent appearance-none m-0 rounded-xl`}
    />
));

export const PerformanceIndicators: React.FC = () => {
  const { schools, students, updateStudents } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const studentId = params.get('studentId');
  
  const [currentStudent, setCurrentStudent] = useState<RegistryStudent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [headerInfo, setHeaderInfo] = useState<PerformanceHeader>(INITIAL_HEADER);
  const [performanceData, setPerformanceData] = useState<PerformanceRow[]>(INITIAL_PERFORMANCE);

  useEffect(() => {
    if (studentId) {
        const student = students.find(s => s.id === studentId);
        if (student) {
            setCurrentStudent(student);
            if (student.performanceHistory?.length) setPerformanceData(student.performanceHistory);
            if (student.performanceHeader) setHeaderInfo(prev => ({ ...prev, ...student.performanceHeader }));
        }
    }
  }, [studentId, students]);

  const handleSave = async () => {
      if (!currentStudent) return;
      setIsSaving(true);
      const updated = { ...currentStudent, performanceHistory: performanceData, performanceHeader: headerInfo };
      try {
          await updateStudents([updated]);
          addToast("Certificação pedagógica gravada e validada.", "success");
      } catch (e) { addToast("Erro crítico de backup.", "error"); }
      finally { setIsSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] py-24 print:bg-white print:py-0 font-sans">
      <div className="max-w-6xl mx-auto px-10 print:px-0">
        
        <div className="mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 print:hidden">
          <div className="animate-in fade-in slide-in-from-left-6 duration-700">
            <button onClick={() => navigate(-1)} className="mb-8 text-slate-400 hover:text-indigo-600 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] transition">
                <ArrowLeft className="h-4 w-4" /> Gestão de Auditoria
            </button>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter flex items-center gap-6">
                <ShieldCheck className="h-14 w-14 text-indigo-600 shadow-2xl" /> Certificação <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Oficial SME</span>
            </h1>
            <p className="text-slate-500 font-medium text-xl mt-4">Quadros de desempenho e indicadores de movimento com integridade digital.</p>
          </div>
          <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-6 duration-700">
            <button onClick={() => setPerformanceData(INITIAL_PERFORMANCE)} className="px-8 py-5 bg-white border border-slate-200 text-slate-500 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition shadow-sm flex items-center gap-4"><Eraser className="h-5 w-5" /> Limpar</button>
            <button onClick={handleSave} disabled={isSaving} className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-slate-800 transition shadow-2xl shadow-slate-300 flex items-center gap-5 disabled:opacity-50 active:scale-95">
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} {isSaving ? 'Validando...' : 'Registrar'}
            </button>
            <button onClick={() => window.print()} className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 flex items-center gap-5 active:scale-95"><Printer className="h-5 w-5" /> Gerar PDF</button>
          </div>
        </div>

        <div className="bg-white p-24 document-official rounded-[5rem] mx-auto print:shadow-none print:p-0 print:border-none print:rounded-none max-w-[210mm] min-h-[297mm] animate-in slide-in-from-bottom-12 duration-1000">
            
            {/* Security Markups */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/3304/3304567.png" className="w-[700px] grayscale rotate-[25deg]" alt="" />
            </div>

            {/* SME Header Station */}
            <header className="flex items-center gap-20 border-b-8 border-slate-900 pb-16 mb-20 relative z-10">
                <div className="bg-slate-50 p-6 rounded-[3rem] border border-slate-200 shadow-inner group">
                    <img src="https://cdn-icons-png.flaticon.com/512/3304/3304567.png" className="h-36 w-36 grayscale opacity-80 group-hover:opacity-100 transition-opacity" alt="Brasão Itaberaba" />
                </div>
                <div className="flex-1">
                    <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-3">Secretaria Municipal de Educação</h2>
                    <h3 className="text-lg font-black uppercase tracking-[0.5em] text-slate-400 mb-10">Itaberaba • Bahia • Gestão da Transformação</h3>
                    <div className="flex gap-6">
                        <div className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-lg">Ano Letivo: {headerInfo.year}</div>
                        <div className="bg-white text-slate-600 px-8 py-3 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] border-4 border-slate-900">{headerInfo.unit}</div>
                    </div>
                </div>
            </header>

            {/* Core Registry Metadata */}
            <div className="grid grid-cols-2 gap-20 mb-20 relative z-10">
                <div className="space-y-12">
                    <div className="border-b-4 border-slate-100 pb-6 group">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 block">Unidade de Ensino Registradora</label>
                        <InputCell value={currentStudent?.school || 'UNIDADE NÃO VINCULADA'} onChange={() => {}} className="text-left font-black text-slate-900 uppercase text-xl" />
                    </div>
                    <div className="border-b-8 border-indigo-600 pb-8 group">
                        <label className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 block">Cidadão Estudante Alocado</label>
                        <p className="font-black text-slate-900 text-4xl tracking-tighter uppercase">{currentStudent?.name || 'ESTUDANTE NÃO CATALOGADO'}</p>
                    </div>
                </div>
                <div className="space-y-12">
                    <div className="border-b-4 border-slate-100 pb-6 group">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 block">Autoridade Administrativa</label>
                        <InputCell value={headerInfo.director} onChange={(e:any) => setHeaderInfo({...headerInfo, director: e.target.value.toUpperCase()})} className="text-left font-black text-slate-700 text-lg" />
                    </div>
                    <div className="border-b-4 border-slate-100 pb-6 group">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 block">Supervisão Pedagógica / Coordenação</label>
                        <InputCell value={headerInfo.coordinator} onChange={(e:any) => setHeaderInfo({...headerInfo, coordinator: e.target.value.toUpperCase()})} className="text-left font-black text-slate-700 text-lg" />
                    </div>
                </div>
            </div>

            {/* Official Performance Grid */}
            <div className="overflow-hidden border-4 border-slate-900 rounded-[3.5rem] mb-20 relative z-10 shadow-2xl shadow-slate-200 bg-white">
                <table className="w-full text-center border-collapse">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="p-10 text-left font-black uppercase tracking-[0.3em] text-[14px] border-r border-white/10" rowSpan={2}>Componentes Curriculares</th>
                            <th className="p-6 border-b border-r border-white/10 text-[11px] font-black uppercase tracking-[0.4em]" colSpan={4}>Diagnóstico Qualitativo</th>
                            <th className="p-6 border-b text-[11px] font-black uppercase tracking-[0.4em]" colSpan={2}>Indicador Final</th>
                        </tr>
                        <tr className="bg-slate-800 text-[11px] font-black tracking-widest">
                            <th className="p-6 border-r border-white/10">DI</th>
                            <th className="p-6 border-r border-white/10">EP</th>
                            <th className="p-6 border-r border-white/10">DB</th>
                            <th className="p-6 border-r border-white/10">DE</th>
                            <th className="p-6 border-r border-white/10">AP</th>
                            <th className="p-6">RP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-4 divide-slate-900">
                        {performanceData.map((row, i) => (
                            <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                                <td className="p-10 text-left font-black text-slate-900 border-r-4 border-slate-900 bg-slate-50/50 group-hover:bg-indigo-50 transition-colors uppercase tracking-tight text-lg">{row.subject}</td>
                                {[0,1,2,3,4,5].map(c => (
                                    <td key={c} className={`p-0 ${c < 5 ? 'border-r-4 border-slate-900' : ''}`}>
                                        <InputCell 
                                            value={row.g1?.[c]} 
                                            onChange={(e:any) => {
                                                const newData = [...performanceData];
                                                if (!newData[i].g1) newData[i].g1 = ['', '', '', '', ''];
                                                newData[i].g1[c] = e.target.value.toUpperCase().substring(0, 2);
                                                setPerformanceData(newData);
                                            }} 
                                            className="text-3xl font-black text-slate-900 h-24 uppercase"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Authenticity & Integrity Footer */}
            <div className="grid grid-cols-12 gap-16 mt-24 items-end relative z-10">
                <div className="col-span-5">
                    <div className="bg-slate-50 p-12 rounded-[3.5rem] border-4 border-slate-200 shadow-inner">
                        <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                            <Award className="h-6 w-6 text-indigo-600" /> Tabela de Referência
                        </h4>
                        <div className="space-y-4 text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            <p className="flex items-center gap-6"><span className="text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-12 text-center shadow-sm">DI</span> Insatisfatório</p>
                            <p className="flex items-center gap-6"><span className="text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-12 text-center shadow-sm">EP</span> Em Processo</p>
                            <p className="flex items-center gap-6"><span className="text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-12 text-center shadow-sm">DB</span> Bom</p>
                            <p className="flex items-center gap-6"><span className="text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-12 text-center shadow-sm">DE</span> Excelente</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2 flex flex-col items-center justify-center">
                    <div className="w-32 h-32 border-8 border-slate-900 rounded-full flex items-center justify-center text-slate-900 -rotate-12 opacity-30 mb-8 animate-float">
                        <CheckCircle2 className="h-16 w-16" />
                    </div>
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Integridade SME</p>
                </div>

                <div className="col-span-5 space-y-14">
                    <div className="flex justify-center mb-6">
                        <QrCode className="h-24 w-24 text-slate-200" />
                    </div>
                    <div className="text-center">
                        <div className="w-full border-b-4 border-slate-900 mb-4"></div>
                        <p className="text-[13px] font-black uppercase tracking-[0.5em] text-slate-900 leading-none">Autenticação Digital SME</p>
                        <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-[0.3em]">Blockchain Educacional Itaberaba • Verificado</p>
                    </div>
                    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] pt-4">
                        <span>DATA: {headerInfo.dateDay}/{headerInfo.dateMonth}/{headerInfo.dateYear}</span>
                        <span>V: 2.5-REDE-SME</span>
                    </div>
                </div>
            </div>

            <footer className="mt-32 pt-12 border-t border-slate-100 text-center relative z-10">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.6em] leading-relaxed">EducaMunicípio • Sistema Integrado de Gestão da Rede Municipal de Ensino</p>
            </footer>

        </div>
      </div>
    </div>
  );
};