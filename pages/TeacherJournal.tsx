import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  UserCheck, UserX, Save, Search, Users, ArrowLeft, 
  BookOpen, Star, AlertTriangle, ChevronRight, Loader2,
  Calendar, ClipboardCheck, TrendingUp, MessageSquare,
  Filter, LayoutGrid, CheckCircle2, User, Sparkles
} from 'lucide-react';
import { useNavigate } from '../router';
import { RegistryStudent, PerformanceRow } from '../types';

export const TeacherJournal: React.FC = () => {
  const { students, updateStudents, isLoading } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'attendance' | 'grades' | 'notes'>('attendance');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [tempGrades, setTempGrades] = useState<Record<string, Partial<PerformanceRow>>>({});

  const userData = useMemo(() => JSON.parse(sessionStorage.getItem('user_data') || '{}'), []);
  
  const myStudents = useMemo(() => {
    if (userData.role === 'Secretaria de Educação') return (students || []).filter(Boolean);
    return (students || []).filter(s => s && (s.schoolId === userData.schoolId || s.school?.includes(userData.schoolId)));
  }, [students, userData]);

  const filtered = myStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleToggle = (studentId: string, present: boolean) => {
    setAttendance(prev => ({ ...prev, [studentId]: present }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedStudents = students.map(s => {
        if (!s) return s;
        let studentCopy = { ...s };
        if (attendance[s.id] !== undefined) {
          const current = s.attendance || { totalSchoolDays: 0, presentDays: 0, justifiedAbsences: 0, unjustifiedAbsences: 0 };
          studentCopy.attendance = {
            ...current,
            totalSchoolDays: current.totalSchoolDays + 1,
            presentDays: attendance[s.id] ? current.presentDays + 1 : current.presentDays,
            unjustifiedAbsences: !attendance[s.id] ? current.unjustifiedAbsences + 1 : current.unjustifiedAbsences
          };
        }
        if (tempGrades[s.id]) {
            const history = s.performanceHistory || [];
            const subjectIdx = history.findIndex(p => p.subject === 'Geral');
            const newGrade: PerformanceRow = {
                subject: 'Geral',
                unit1: tempGrades[s.id].unit1 || 0,
                unit2: tempGrades[s.id].unit2 || 0,
                unit3: tempGrades[s.id].unit3 || 0
            };
            if (subjectIdx >= 0) history[subjectIdx] = newGrade;
            else history.push(newGrade);
            studentCopy.performanceHistory = history;
        }
        return studentCopy;
      });

      await updateStudents(updatedStudents);
      addToast("Ciclo de registros sincronizado com a SME!", "success");
      setAttendance({});
      setTempGrades({});
    } catch (e) {
      addToast("Falha na sincronização local.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
        <div className="relative">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
            <Sparkles className="h-6 w-6 text-amber-400 absolute top-0 right-0 animate-pulse" />
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20">
      <div className="max-w-7xl mx-auto px-10">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-12">
          <div className="animate-in fade-in slide-in-from-left-6 duration-700">
            <div className="flex items-center gap-4 mb-8">
                <span className="bg-indigo-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-100">Workstation Docente</span>
                <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{userData.schoolName || 'Rede Municipal'}</span>
            </div>
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6">Diário de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500">Bordo Digit@l</span></h1>
            <p className="text-slate-500 font-medium text-2xl">Monitoramento e gestão pedagógica em tempo real.</p>
          </div>
          
          <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-6 duration-700">
             <div className="bg-white p-6 rounded-[3rem] border border-slate-200 shadow-sm flex items-center gap-6">
                <div className="bg-indigo-50 p-5 rounded-3xl"><Calendar className="h-8 w-8 text-indigo-500" /></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-2">Calendário Letivo</p>
                    <p className="text-lg font-black text-slate-900">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
             </div>
             <button 
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-slate-900 text-white px-14 py-7 rounded-[2.8rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-slate-300 hover:bg-slate-800 transition-all flex items-center gap-6 disabled:opacity-50 active:scale-95"
              >
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Sincronizar SME
              </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-3 space-y-10">
                <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Módulos Ativos</h3>
                    <nav className="space-y-4">
                        {[
                            { id: 'attendance', label: 'Chamada Eletrônica', icon: ClipboardCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { id: 'grades', label: 'Avaliações Trimestrais', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { id: 'notes', label: 'Atas Pedagógicas', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' }
                        ].map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center gap-6 p-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === item.id ? `${item.bg} ${item.color} shadow-2xl scale-110 border border-indigo-100` : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                <item.icon className="h-6 w-6" />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-16 p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-6">Eficiência da Turma</p>
                        <div className="flex items-end gap-5 mb-4">
                            <span className="text-6xl font-black">{filtered.length}</span>
                            <span className="text-[10px] font-bold opacity-70 uppercase mb-3 tracking-widest">Alunos</span>
                        </div>
                        <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-400 w-3/4 animate-shimmer"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Monitor de Status</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-5">
                            <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-xl shadow-emerald-100 animate-pulse"></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Presença Validada</span>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-4 h-4 rounded-full bg-red-500 shadow-xl shadow-red-100"></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Falta Registrada</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-9 space-y-10">
                <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-sm flex items-center gap-8">
                    <Search className="h-8 w-8 text-slate-300" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar registro nominal..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-2xl font-black text-slate-800 placeholder:text-slate-300"
                    />
                    <div className="flex gap-4">
                        <button className="p-5 bg-slate-50 text-slate-400 rounded-3xl hover:bg-slate-100 transition shadow-sm hover:scale-110 active:scale-95"><Filter className="h-7 w-7" /></button>
                        <button className="p-5 bg-slate-50 text-slate-400 rounded-3xl hover:bg-slate-100 transition shadow-sm hover:scale-110 active:scale-95"><LayoutGrid className="h-7 w-7" /></button>
                    </div>
                </div>

                <div className="bg-white rounded-[5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-12 duration-1000">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-14 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Cidadão Estudante</th>
                                    <th className="px-14 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Painel Operacional</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(student => (
                                    <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-14 py-12">
                                            <div className="flex items-center gap-10">
                                                <div className="relative">
                                                    <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700">
                                                        {student.photo ? (
                                                            <img src={student.photo} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <User className="h-12 w-12 text-slate-300" />
                                                        )}
                                                    </div>
                                                    {student.specialNeeds && (
                                                        <div className="absolute -top-3 -right-3 bg-pink-500 text-white p-2.5 rounded-full border-4 border-white shadow-2xl animate-pulse">
                                                            <Star className="h-5 w-5 fill-current" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-3xl tracking-tighter mb-3">{student.name}</p>
                                                    <div className="flex items-center gap-5">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cód: {student.enrollmentId || '2025-REF'}</span>
                                                        <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1 rounded-full">SME Ativo</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-14 py-12 text-center">
                                            {activeTab === 'attendance' && (
                                                <div className="flex items-center justify-center gap-10">
                                                    <button 
                                                        onClick={() => handleToggle(student.id, false)}
                                                        className={`w-24 h-24 rounded-[3rem] flex items-center justify-center transition-all border-4 ${attendance[student.id] === false ? 'bg-red-600 border-red-600 text-white shadow-2xl shadow-red-200 scale-125 rotate-6' : 'bg-white border-slate-100 text-slate-300 hover:border-red-100 hover:text-red-500 hover:scale-110'}`}
                                                    >
                                                        <UserX className="h-10 w-10" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleToggle(student.id, true)}
                                                        className={`w-24 h-24 rounded-[3rem] flex items-center justify-center transition-all border-4 ${attendance[student.id] === true ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xl shadow-emerald-200 scale-125 -rotate-6' : 'bg-white border-slate-100 text-slate-300 hover:border-emerald-100 hover:text-emerald-500 hover:scale-110'}`}
                                                    >
                                                        <UserCheck className="h-10 w-10" />
                                                    </button>
                                                </div>
                                            )}

                                            {activeTab === 'grades' && (
                                                <div className="flex justify-center gap-6">
                                                    {[1, 2, 3].map(u => (
                                                        <div key={u} className="flex flex-col items-center">
                                                            <span className="text-[9px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">Unid {u}</span>
                                                            <input 
                                                                type="text" 
                                                                placeholder="--"
                                                                value={tempGrades[student.id]?.[`unit${u}` as keyof PerformanceRow] || ''}
                                                                onChange={e => setTempGrades({ ...tempGrades, [student.id]: { ...tempGrades[student.id], [`unit${u}`]: e.target.value } })}
                                                                className="w-20 h-20 bg-slate-50 border-4 border-slate-100 rounded-[2rem] text-center font-black text-indigo-600 focus:bg-white focus:ring-12 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all text-2xl shadow-inner"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {activeTab === 'notes' && (
                                                <div className="flex justify-center">
                                                    <button 
                                                        onClick={() => navigate(`/student/monitoring?id=${student.id}`)} 
                                                        className="px-12 py-6 bg-indigo-50 text-indigo-600 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-indigo-100 flex items-center gap-5 group/btn"
                                                    >
                                                        Portfólio Individual <ChevronRight className="h-6 w-6 group-hover/btn:translate-x-3 transition-transform" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && (
                        <div className="py-40 text-center opacity-30">
                            <Users className="h-32 w-32 mx-auto mb-10 text-slate-200" />
                            <p className="font-black uppercase tracking-[0.4em] text-xs">Nenhum registro acadêmico localizado</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};