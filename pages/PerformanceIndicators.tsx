import React, { useState, useEffect } from 'react';
import { 
  Printer, ArrowLeft, TrendingUp, Save, 
  Loader2, Award, ShieldCheck, Activity,
  BookOpen, Target, ArrowUpRight, Zap
} from 'lucide-react';
import { useSearchParams, useNavigate } from '../router';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { PerformanceRow, RegistryStudent } from '../types';

const CONCEPTS = {
  'DI': { label: 'Insatisfatório', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', val: 1 },
  'EP': { label: 'Em Processo', color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', val: 2 },
  'DB': { label: 'Bom', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', val: 3 },
  'DE': { label: 'Excelente', color: 'bg-indigo-600', text: 'text-indigo-700', bg: 'bg-indigo-50', val: 4 },
  '': { label: 'Pendente', color: 'bg-slate-200', text: 'text-slate-400', bg: 'bg-slate-50', val: 0 }
};

const ProgressionVisual = ({ data }: { data: PerformanceRow[] }) => {
    const units = ['Unidade I', 'Unidade II', 'Unidade III'];
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

    const height = 140;
    const width = 500;
    const padding = 40;
    const points = scores.map((s, i) => {
        const x = padding + (i * (width - padding * 2) / (units.length - 1));
        const y = height - padding - (s * (height - padding * 2) / 4);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-100 flex flex-col lg:flex-row items-center gap-10 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full -mr-40 -mt-40 opacity-40 group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="shrink-0 relative z-10 text-center lg:text-left">
                <div className="bg-emerald-600 w-16 h-16 rounded-3xl shadow-xl shadow-emerald-100 flex items-center justify-center mb-6 animate-float mx-auto lg:mx-0">
                    <Activity className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Rendimento</h4>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pedagógico</h4>
                <p className="text-6xl font-black text-slate-900 mt-3 tracking-tighter leading-none">
                  {(scores.reduce((a,b)=>a+b,0)/3).toFixed(1)} 
                  <span className="text-xs font-black text-emerald-500 ml-2 uppercase tracking-widest">Score</span>
                </p>
            </div>

            <div className="flex-1 h-[160px] relative z-10 w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="gradPath" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={`M ${padding} ${height - padding} L ${points} L ${width - padding} ${height - padding} Z`} fill="url(#gradPath)" />
                    <polyline points={points} fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="progression-path" style={{ strokeDasharray: 1000, strokeDashoffset: 0 }} />
                    {scores.map((s, i) => {
                        const x = padding + (i * (width - padding * 2) / (units.length - 1));
                        const y = height - padding - (s * (height - padding * 2) / 4);
                        return (
                            <g key={i} className="hover:scale-125 transition-transform origin-center cursor-pointer">
                                <circle cx={x} cy={y} r="10" fill="#10b981" />
                                <circle cx={x} cy={y} r="5" fill="white" />
                                <text x={x} y={y - 25} textAnchor="middle" fontSize="11" fontWeight="900" className="fill-slate-900 uppercase tracking-widest">{units[i]}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white min-w-[240px] shadow-2xl relative overflow-hidden group/card">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 group-hover/card:scale-150 transition-transform duration-700"></div>
                <Zap className="h-6 w-6 text-emerald-400 mb-6" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Status de Rede</p>
                <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-2xl font-black tracking-tight">Sincronizado</span>
                </div>
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
                { subject: 'GEOGRAFIA', g1: ['', '', ''] },
                { subject: 'ARTES', g1: ['', '', ''] },
                { subject: 'EDUCAÇÃO FÍSICA', g1: ['', '', ''] }
            ]);
        }
    }
  }, [studentId, students]);

  const handleConceptCycle = (rowIdx: number, colIdx: number) => {
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
          addToast("Boletim nominal sincronizado com a base.", "success");
      } catch (e) { 
          addToast("Erro na comunicação com a rede.", "error"); 
      } finally { 
          setIsSaving(false); 
      }
  };

  if (!currentStudent) return null;

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
            <div className="animate-in fade-in slide-in-from-left-6 duration-700">
                <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 hover:text-emerald-600 transition group">
                    <div className="bg-slate-100 p-2.5 rounded-xl group-hover:bg-emerald-50 transition-colors">
                      <ArrowLeft className="h-4 w-4" />
                    </div> Voltar ao Painel
                </button>
                <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6">
                  Monitor de <br/><span className="text-emerald-600">Aprendizado.</span>
                </h1>
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-slate-900 flex items-center justify-center overflow-hidden shadow-2xl rotate-3 border-4 border-white">
                        {currentStudent.photo ? <img src={currentStudent.photo} className="w-full h-full object-cover" /> : <BookOpen className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                        <p className="text-slate-900 font-black text-2xl tracking-tight leading-none">{currentStudent.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Protocolo SME: {currentStudent.enrollmentId || currentStudent.id}</p>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-6 duration-700">
                <button onClick={() => window.print()} className="p-7 bg-white border border-slate-100 text-slate-400 rounded-[2.5rem] hover:text-emerald-600 transition-all hover:shadow-2xl shadow-slate-100 active:scale-95"><Printer className="h-6 w-6" /></button>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="flex items-center gap-5 px-14 py-7 bg-slate-900 text-white rounded-[2.8rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 active:scale-95"
                >
                    {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Sincronizar Boletim
                </button>
            </div>
        </header>

        <div className="mb-16 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
            <ProgressionVisual data={performanceData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
                <div className="card-requinte overflow-hidden">
                    <div className="bg-slate-50/50 px-12 py-10 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
                                <Target className="h-5 w-5 text-emerald-600" /> Matriz BNCC Nominal
                            </h3>
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 glow-emerald">
                            Ano Letivo 2025
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-12 py-10 text-[11px] font-black text-slate-500 uppercase tracking-widest w-1/3">Área de Conhecimento</th>
                                    {['UNID I', 'UNID II', 'UNID III'].map(u => (
                                        <th key={u} className="px-6 py-10 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">{u}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {performanceData.map((row, rIdx) => (
                                    <tr key={row.subject} className="group transition-all hover:bg-emerald-50/20">
                                        <td className="px-12 py-12">
                                            <p className="font-black text-slate-800 text-lg tracking-tight uppercase">{row.subject}</p>
                                        </td>
                                        {[0, 1, 2].map(cIdx => {
                                            const val = (row.g1?.[cIdx] || '') as keyof typeof CONCEPTS;
                                            const style = CONCEPTS[val];
                                            return (
                                                <td key={cIdx} className="px-6 py-12">
                                                    <button 
                                                        onClick={() => handleConceptCycle(rIdx, cIdx)}
                                                        className={`w-full py-6 rounded-[2rem] border-2 flex flex-col items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${val ? `${style.bg} ${style.text} border-transparent shadow-xl` : 'bg-slate-50/30 border-dashed border-slate-200 text-slate-300'}`}
                                                    >
                                                        <span className="text-2xl font-black tracking-tighter">{val || '--'}</span>
                                                        <span className="text-[9px] font-black uppercase tracking-tighter opacity-70 mt-1">{style.label}</span>
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-100">
                    <h3 className="font-black text-slate-900 mb-12 flex items-center gap-5 text-3xl tracking-tighter">
                        <Award className="h-10 w-10 text-emerald-600" /> Legenda
                    </h3>
                    <div className="space-y-8">
                        {Object.entries(CONCEPTS).filter(([k]) => k !== '').map(([key, info]) => (
                            <div key={key} className="flex items-center gap-8 group">
                                <div className={`${info.bg} ${info.text} w-20 h-20 rounded-[1.8rem] flex items-center justify-center font-black text-2xl shadow-sm border border-transparent group-hover:border-slate-200 transition-all`}>{key}</div>
                                <div>
                                    <p className="font-black text-slate-800 text-xl tracking-tight leading-none">{info.label}</p>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3">Nível {info.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-emerald-600 p-12 rounded-[4.5rem] text-white shadow-2xl shadow-emerald-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                    <ShieldCheck className="h-14 w-14 mb-10 opacity-50" />
                    <h3 className="text-4xl font-black tracking-tighter mb-6 leading-tight">Vigência SME</h3>
                    <p className="text-emerald-50 text-base font-medium leading-relaxed mb-12">Documento nominal com validade para fins de histórico escolar digital.</p>
                    <div className="flex items-center justify-between pt-8 border-t border-emerald-500/50">
                        <span className="text-[11px] font-black uppercase tracking-widest">SME ITABERABA</span>
                        <ArrowUpRight className="h-8 w-8" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};