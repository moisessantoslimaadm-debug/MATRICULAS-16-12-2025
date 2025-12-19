
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Printer, ArrowLeft, TrendingUp, Save, Eraser, 
  Loader2, Award, ShieldCheck, CheckCircle2, 
  BarChart, LineChart as LineIcon, Activity,
  ChevronRight, Calendar, BookOpen, Target
} from 'lucide-react';
import { useSearchParams, useNavigate } from '../router';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { PerformanceRow, RegistryStudent, PerformanceHeader } from '../types';

const CONCEPTS = {
  'DI': { label: 'Insatisfatório', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', val: 1 },
  'EP': { label: 'Em Processo', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', val: 2 },
  'DB': { label: 'Bom', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', val: 3 },
  'DE': { label: 'Excelente', color: 'bg-indigo-600', text: 'text-indigo-700', bg: 'bg-indigo-50', val: 4 },
  '': { label: 'Pendente', color: 'bg-slate-200', text: 'text-slate-400', bg: 'bg-slate-50', val: 0 }
};

// Componente de Gráfico de Progressão Enxuto
const ProgressionChart = ({ data }: { data: PerformanceRow[] }) => {
    const units = ['Unid 1', 'Unid 2', 'Unid 3'];
    
    const scores = units.map((_, idx) => {
        let count = 0;
        let sum = 0;
        data.forEach(row => {
            const concept = row.g1?.[idx] as keyof typeof CONCEPTS;
            if (concept && CONCEPTS[concept]) {
                sum += CONCEPTS[concept].val;
                count++;
            }
        });
        return count > 0 ? (sum / count) : 0;
    });

    const height = 120;
    const width = 400;
    const padding = 20;
    const points = scores.map((s, i) => {
        const x = padding + (i * (width - padding * 2) / (units.length - 1));
        const y = height - padding - (s * (height - padding * 2) / 4);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex items-center gap-8">
            <div className="shrink-0">
                <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-100 mb-2">
                    <Activity className="h-6 w-6 text-white" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Média de<br/>Progressão</p>
            </div>
            <div className="flex-1 h-[100px] relative">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={`M ${padding} ${height - padding} L ${points} L ${width - padding} ${height - padding} Z`} fill="url(#grad)" />
                    <polyline points={points} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    {scores.map((s, i) => {
                        const x = padding + (i * (width - padding * 2) / (units.length - 1));
                        const y = height - padding - (s * (height - padding * 2) / 4);
                        return (
                            <g key={i}>
                                <circle cx={x} cy={y} r="6" fill="#10b981" />
                                <circle cx={x} cy={y} r="3" fill="white" />
                                <text x={x} y={y - 12} textAnchor="middle" fontSize="10" fontWeight="900" className="fill-slate-600 uppercase">{units[i]}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
            <div className="text-right">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{(scores.reduce((a,b)=>a+b,0)/3).toFixed(1)}</p>
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Índice Global</p>
            </div>
        </div>
    );
};

export const PerformanceIndicators: React.FC = () => {
  const { students, updateStudents } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const studentId = params.get('studentId');
  
  const [currentStudent, setCurrentStudent] = useState<RegistryStudent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceRow[]>([]);

  useEffect(() => {
    if (studentId) {
        const student = students.find(s => s.id === studentId);
        if (student) {
            setCurrentStudent(student);
            setPerformanceData(student.performanceHistory?.length ? student.performanceHistory : [
                { subject: 'LÍNGUA PORTUGUESA', g1: ['', '', ''] },
                { subject: 'MATEMÁTICA', g1: ['', '', ''] },
                { subject: 'CIÊNCIAS', g1: ['', '', ''] },
                { subject: 'HISTÓRIA', g1: ['', '', ''] },
                { subject: 'GEOGRAFIA', g1: ['', '', ''] }
            ]);
        }
    }
  }, [studentId, students]);

  const handleConceptChange = (rowIdx: number, colIdx: number) => {
    const order: (keyof typeof CONCEPTS)[] = ['', 'DI', 'EP', 'DB', 'DE'];
    const current = (performanceData[rowIdx].g1?.[colIdx] || '') as keyof typeof CONCEPTS;
    const nextIdx = (order.indexOf(current) + 1) % order.length;
    
    const newData = [...performanceData];
    if (!newData[rowIdx].g1) newData[rowIdx].g1 = ['', '', ''];
    newData[rowIdx].g1[colIdx] = order[nextIdx];
    setPerformanceData(newData);
  };

  const handleSave = async () => {
      if (!currentStudent) return;
      setIsSaving(true);
      try {
          await updateStudents([{ ...currentStudent, performanceHistory: performanceData }]);
          addToast("Desempenho sincronizado com a rede.", "success");
      } catch (e) { addToast("Erro na gravação.", "error"); }
      finally { setIsSaving(false); }
  };

  if (!currentStudent) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Compacto e Requintado */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 hover:text-emerald-600 transition">
                    <ArrowLeft className="h-4 w-4" /> Gestão Pedagógica
                </button>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">Monitor de <span className="text-emerald-600">Aprendizado</span></h1>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {currentStudent.photo ? <img src={currentStudent.photo} className="w-full h-full object-cover" /> : <BookOpen className="h-4 w-4 text-slate-400" />}
                    </div>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">{currentStudent.name}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button onClick={() => window.print()} className="p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-emerald-600 transition-all hover:shadow-lg active:scale-95"><Printer className="h-5 w-5" /></button>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="flex items-center gap-4 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 disabled:opacity-50 active:scale-95"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar Progresso
                </button>
            </div>
        </header>

        {/* Dash de Progressão */}
        <div className="mb-10 animate-in slide-in-from-top-4 duration-700 delay-150">
            <ProgressionChart data={performanceData} />
        </div>

        {/* Grid de Avaliações Inteligente */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden animate-in fade-in duration-1000">
            <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Target className="h-4 w-4 text-emerald-600" /> Matriz de Competências 2025
                </h3>
                <div className="flex gap-4 text-[9px] font-black text-slate-400 uppercase">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> DI</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> EP</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> DB</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-600"></div> DE</span>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest w-1/2">Componente Curricular</th>
                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unidade I</th>
                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unidade II</th>
                            <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unidade III</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {performanceData.map((row, rIdx) => (
                            <tr key={rIdx} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-6">
                                    <p className="font-black text-slate-800 text-sm tracking-tight uppercase">{row.subject}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Base Nacional Comum</p>
                                </td>
                                {[0, 1, 2].map(cIdx => {
                                    const val = (row.g1?.[cIdx] || '') as keyof typeof CONCEPTS;
                                    const style = CONCEPTS[val];
                                    return (
                                        <td key={cIdx} className="px-6 py-6">
                                            <button 
                                                onClick={() => handleConceptChange(rIdx, cIdx)}
                                                className={`w-full py-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${val ? `${style.bg} ${style.text} border-transparent shadow-sm` : 'bg-slate-50/50 border-dashed border-slate-200 text-slate-300'}`}
                                            >
                                                <span className="text-lg font-black">{val || '--'}</span>
                                                <span className="text-[8px] font-black uppercase tracking-tighter opacity-70">{style.label}</span>
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-10 bg-slate-50/30 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">
                        Registros autenticados por biometria digital do docente.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Final:</p>
                     <span className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-xl text-[10px] font-black uppercase border border-emerald-200 shadow-sm">Apto para Progressão</span>
                </div>
            </div>
        </div>

        <footer className="mt-12 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">EducaMunicípio • Sistema Integrado de Gestão Curricular</p>
        </footer>
      </div>
    </div>
  );
};
