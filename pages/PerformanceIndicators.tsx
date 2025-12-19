
import React, { useState, useEffect, useMemo } from 'react';
import { Printer, ArrowLeft, TrendingUp, Save, Eraser, Calculator, UserCheck, Plus, Trash2, Loader2, FileText, ChevronDown, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    unit: 'II TRIMESTRE',
    year: new Date().getFullYear(),
    shift: 'MATUTINO',
    director: 'DIREÇÃO GERAL',
    coordinator: 'COORDENAÇÃO PEDAGÓGICA',
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
      className={`bg-transparent outline-none border border-transparent hover:bg-indigo-50/50 focus:bg-indigo-100 transition-colors p-1 text-inherit font-inherit ${width} ${className} print:border-none print:p-0 print:focus:bg-transparent appearance-none m-0 rounded-sm`}
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
          addToast("Dados salvos com sucesso.", "success");
      } catch (e) { addToast("Erro ao salvar.", "error"); }
      finally { setIsSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] py-16 print:bg-white print:py-0">
      <div className="max-w-6xl mx-auto px-6 print:px-0">
        
        <div className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 print:hidden">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <button onClick={() => navigate(-1)} className="mb-4 text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition">
                <ArrowLeft className="h-4 w-4" /> Retornar
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                <ShieldCheck className="h-9 w-9 text-indigo-600" /> Certificação <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Pedagógica</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Gerador oficial de quadros de desempenho e movimento da rede municipal.</p>
          </div>
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
            <button onClick={() => setPerformanceData(INITIAL_PERFORMANCE)} className="px-6 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition shadow-sm flex items-center gap-2"><Eraser className="h-4 w-4" /> Resetar</button>
            <button onClick={handleSave} disabled={isSaving} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition shadow-2xl shadow-slate-200 flex items-center gap-3 disabled:opacity-50">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {isSaving ? 'Sincronizando...' : 'Gravar Dados'}
            </button>
            <button onClick={() => window.print()} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 flex items-center gap-3"><Printer className="h-4 w-4" /> Gerar Impressão</button>
          </div>
        </div>

        <div className="bg-white p-16 document-official rounded-[3rem] mx-auto print:shadow-none print:p-0 print:border-none print:rounded-none max-w-[210mm] min-h-[297mm] animate-in slide-in-from-bottom-8 duration-1000 relative">
            
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <img src="https://cdn-icons-png.flaticon.com/512/3304/3304567.png" className="w-[400px]" alt="" />
            </div>

            {/* Header Document */}
            <header className="flex items-center gap-10 border-b-4 border-slate-900 pb-10 mb-12 relative z-10">
                <img src="https://cdn-icons-png.flaticon.com/512/3304/3304567.png" className="h-28 w-28 grayscale opacity-90" alt="Brasão" />
                <div className="flex-1">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-1">Secretaria Municipal de Educação</h2>
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Governo da Transformação • Itaberaba - BA</h3>
                    <div className="flex gap-6">
                        <div className="bg-slate-900 text-white px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">Ano Letivo: {headerInfo.year}</div>
                        <div className="bg-slate-100 text-slate-600 px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-slate-200">{headerInfo.unit}</div>
                    </div>
                </div>
            </header>

            {/* Student Info Station */}
            <div className="grid grid-cols-2 gap-12 mb-12 relative z-10">
                <div className="space-y-6">
                    <div className="group border-b-2 border-slate-100 focus-within:border-indigo-600 transition-colors pb-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Unidade de Ensino</label>
                        <InputCell value={currentStudent?.school || ''} onChange={() => {}} className="text-left font-black text-slate-900 uppercase" />
                    </div>
                    <div className="group border-b-2 border-slate-100 focus-within:border-indigo-600 transition-colors pb-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Estudante Matriculado</label>
                        <p className="font-black text-indigo-600 text-2xl tracking-tighter uppercase">{currentStudent?.name}</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="group border-b-2 border-slate-100 focus-within:border-indigo-600 transition-colors pb-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Responsável pela Direção</label>
                        <InputCell value={headerInfo.director} onChange={(e:any) => setHeaderInfo({...headerInfo, director: e.target.value.toUpperCase()})} className="text-left font-bold" />
                    </div>
                    <div className="group border-b-2 border-slate-100 focus-within:border-indigo-600 transition-colors pb-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Coordenação Pedagógica</label>
                        <InputCell value={headerInfo.coordinator} onChange={(e:any) => setHeaderInfo({...headerInfo, coordinator: e.target.value.toUpperCase()})} className="text-left font-bold" />
                    </div>
                </div>
            </div>

            {/* Performance Grid - Official SME Design */}
            <div className="overflow-hidden border-2 border-slate-900 rounded-3xl mb-12 relative z-10 shadow-xl shadow-slate-100">
                <table className="w-full text-center border-collapse text-[11px]">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="p-6 text-left font-black uppercase tracking-[0.2em] border-r border-white/10" rowSpan={2}>Componentes Curriculares</th>
                            <th className="p-3 border-b border-r border-white/10 text-[9px] font-bold uppercase tracking-widest" colSpan={4}>Avaliação Qualitativa</th>
                            <th className="p-3 border-b text-[9px] font-bold uppercase tracking-widest" colSpan={2}>Indicador Final</th>
                        </tr>
                        <tr className="bg-slate-800 text-[9px] font-black">
                            <th className="p-3 border-r border-white/10">DI</th>
                            <th className="p-3 border-r border-white/10">EP</th>
                            <th className="p-3 border-r border-white/10">DB</th>
                            <th className="p-3 border-r border-white/10">DE</th>
                            <th className="p-3 border-r border-white/10">APROV.</th>
                            <th className="p-3">REPROV.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-900">
                        {performanceData.map((row, i) => (
                            <tr key={i} className="hover:bg-indigo-50/50 transition-colors group">
                                <td className="p-6 text-left font-black text-slate-900 border-r-2 border-slate-900 bg-slate-50 group-hover:bg-indigo-100 transition-colors uppercase tracking-tight">{row.subject}</td>
                                {[0,1,2,3,4,5].map(c => (
                                    <td key={c} className={`p-0 ${c < 5 ? 'border-r-2 border-slate-900' : ''}`}>
                                        <InputCell 
                                            value={row.g1?.[c]} 
                                            onChange={(e:any) => {
                                                const newData = [...performanceData];
                                                if (!newData[i].g1) newData[i].g1 = ['', '', '', '', ''];
                                                newData[i].g1[c] = e.target.value.toUpperCase().substring(0, 1);
                                                setPerformanceData(newData);
                                            }} 
                                            className="text-lg font-black text-slate-800 h-16"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Verification Footer */}
            <div className="grid grid-cols-12 gap-10 mt-16 items-end relative z-10">
                <div className="col-span-5">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-slate-200">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Award className="h-4 w-4 text-indigo-600" /> Legenda de Conceitos
                        </h4>
                        <div className="grid grid-cols-1 gap-2 text-[10px] font-bold text-slate-500">
                            <p className="flex items-center gap-2"><span className="text-slate-900 font-black w-6">DI:</span> Desempenho Insatisfatório</p>
                            <p className="flex items-center gap-2"><span className="text-slate-900 font-black w-6">EP:</span> Em Processo de Aprendizagem</p>
                            <p className="flex items-center gap-2"><span className="text-slate-900 font-black w-6">DB:</span> Desempenho Bom</p>
                            <p className="flex items-center gap-2"><span className="text-slate-900 font-black w-6">DE:</span> Desempenho Excelente</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 border-4 border-slate-900 rounded-full flex items-center justify-center text-slate-900 -rotate-12 opacity-50 mb-4">
                        <CheckCircle2 className="h-12 w-12" />
                    </div>
                </div>

                <div className="col-span-5 space-y-8">
                    <div className="text-center">
                        <div className="w-full border-b-2 border-slate-900 mb-2"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Autenticação Administrativa / SME</p>
                        <p className="text-[8px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Documento Digital validado via QR-Code</p>
                    </div>
                    <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <span>DATA: {headerInfo.dateDay}/{headerInfo.dateMonth}/{headerInfo.dateYear}</span>
                        <span>SÉRIE: 2025-V.01</span>
                    </div>
                </div>
            </div>

            <footer className="mt-20 pt-8 border-t border-slate-100 text-center relative z-10">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Plataforma EducaMunicípio • Certificado de Transparência Digital</p>
            </footer>

        </div>
      </div>
    </div>
  );
};
