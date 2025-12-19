
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  UserCheck, UserX, Save, Search, Users, ArrowLeft, 
  BookOpen, Star, AlertTriangle, ChevronRight, Loader2,
  Calendar, ClipboardCheck, TrendingUp, MessageSquare,
  Filter, LayoutGrid, CheckCircle2, User, Sparkles, Target
} from 'lucide-react';
import { useNavigate } from '../router';
import { RegistryStudent, PerformanceRow } from '../types';

const CONCEPTS = {
  'DI': { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  'EP': { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  'DB': { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  'DE': { color: 'bg-indigo-600', text: 'text-indigo-700', bg: 'bg-indigo-50' },
  '': { color: 'bg-slate-200', text: 'text-slate-400', bg: 'bg-slate-50' }
};

export const TeacherJournal: React.FC = () => {
  const { students, updateStudents, isLoading } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'attendance' | 'grades' | 'notes'>('attendance');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [tempGrades, setTempGrades] = useState<Record<string, string[]>>({});

  const userData = useMemo(() => JSON.parse(sessionStorage.getItem('user_data') || '{}'), []);
  const myStudents = useMemo(() => students.filter(s => s.status === 'Matriculado'), [students]);
  const filtered = myStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleToggle = (studentId: string, present: boolean) => {
    setAttendance(prev => ({ ...prev, [studentId]: present }));
  };

  const handleGradeCycle = (studentId: string, unitIdx: number) => {
      const order = ['', 'DI', 'EP', 'DB', 'DE'];
      const currentArr = tempGrades[studentId] || ['', '', ''];
      const currentVal = currentArr[unitIdx];
      const nextIdx = (order.indexOf(currentVal) + 1) % order.length;
      
      const newArr = [...currentArr];
      newArr[unitIdx] = order[nextIdx];
      setTempGrades({ ...tempGrades, [studentId]: newArr });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedStudents = students.map(s => {
        if (!s) return s;
        let sc = { ...s };
        
        // Process Attendance
        if (attendance[s.id] !== undefined) {
          const cur = s.attendance || { totalSchoolDays: 0, presentDays: 0, justifiedAbsences: 0, unjustifiedAbsences: 0 };
          sc.attendance = {
            ...cur,
            totalSchoolDays: cur.totalSchoolDays + 1,
            presentDays: attendance[s.id] ? cur.presentDays + 1 : cur.presentDays,
            unjustifiedAbsences: !attendance[s.id] ? cur.unjustifiedAbsences + 1 : cur.unjustifiedAbsences
          };
        }

        // Process Grades
        if (tempGrades[s.id]) {
            const history = s.performanceHistory || [{ subject: 'GERAL', g1: ['', '', ''] }];
            history[0].g1 = tempGrades[s.id];
            sc.performanceHistory = history;
        }

        return sc;
      });

      await updateStudents(updatedStudents);
      addToast("Lançamentos sincronizados com a SME.", "success");
      setAttendance({});
      setTempGrades({});
    } catch (e) {
      addToast("Erro na sincronização.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-12">
          <div className="animate-in fade-in slide-in-from-left-6 duration-700">
            <div className="flex items-center gap-3 mb-6">
                <span className="bg-emerald-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-100">Portal do Docente</span>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{userData.schoolName || 'Rede Digital'}</span>
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">Diário de <span className="text-emerald-600">Bordo</span></h1>
            <p className="text-slate-500 font-medium text-xl">Lançamentos oficiais de frequência e proficiência acadêmica.</p>
          </div>
          
          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-300 hover:bg-slate-800 transition-all flex items-center gap-5 disabled:opacity-50 active:scale-95"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Sincronizar Lançamentos
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar Enxuta */}
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-50">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Ferramentas Ativas</h3>
                    <nav className="space-y-3">
                        {[
                            { id: 'attendance', label: 'Chamada', icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { id: 'grades', label: 'Avaliações', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { id: 'notes', label: 'Portfólio', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' }
                        ].map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center gap-5 p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] transition-all ${activeTab === item.id ? `${item.bg} ${item.color} shadow-lg scale-105` : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">Métricas da Turma</p>
                    <div className="flex items-end gap-3 mb-2">
                        <span className="text-5xl font-black">{filtered.length}</span>
                        <span className="text-[10px] font-bold opacity-60 uppercase mb-2 tracking-widest">Estudantes</span>
                    </div>
                </div>
            </div>

            {/* Conteúdo Central */}
            <div className="lg:col-span-9 space-y-8">
                <div className="bg-white p-6 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-50 flex items-center gap-6">
                    <Search className="h-6 w-6 text-slate-300 ml-4" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar aluno na base nominal..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-slate-800 placeholder:text-slate-300"
                    />
                </div>

                <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Cidadão Estudante</th>
                                <th className="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Operacional</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(student => (
                                <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-12 py-10">
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-white shadow-lg overflow-hidden flex items-center justify-center transition-transform group-hover:rotate-3">
                                                {student.photo ? <img src={student.photo} className="w-full h-full object-cover" /> : <User className="h-8 w-8 text-slate-300" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-xl tracking-tighter leading-tight">{student.name}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {student.enrollmentId || '2025-REDE'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10 text-center">
                                        {activeTab === 'attendance' && (
                                            <div className="flex items-center justify-center gap-6">
                                                <button 
                                                    onClick={() => handleToggle(student.id, false)}
                                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 ${attendance[student.id] === false ? 'bg-red-600 border-red-600 text-white shadow-xl scale-110' : 'bg-white border-slate-100 text-slate-300 hover:text-red-500'}`}
                                                >
                                                    <UserX className="h-6 w-6" />
                                                </button>
                                                <button 
                                                    onClick={() => handleToggle(student.id, true)}
                                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-2 ${attendance[student.id] === true ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl scale-110' : 'bg-white border-slate-100 text-slate-300 hover:text-emerald-500'}`}
                                                >
                                                    <UserCheck className="h-6 w-6" />
                                                </button>
                                            </div>
                                        )}

                                        {activeTab === 'grades' && (
                                            <div className="flex justify-center gap-4">
                                                {[0, 1, 2].map(idx => {
                                                    const val = (tempGrades[student.id]?.[idx] || '') as keyof typeof CONCEPTS;
                                                    const style = CONCEPTS[val];
                                                    return (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => handleGradeCycle(student.id, idx)}
                                                            className={`w-14 h-14 rounded-2xl border-2 font-black text-xs transition-all ${val ? `${style.bg} ${style.text} border-transparent shadow-sm scale-110` : 'bg-slate-50/50 border-dashed border-slate-200 text-slate-300'}`}
                                                        >
                                                            {val || '--'}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {activeTab === 'notes' && (
                                            <button 
                                                onClick={() => navigate(`/student/monitoring?id=${student.id}`)} 
                                                className="px-8 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-3 mx-auto"
                                            >
                                                Portfólio <ChevronRight className="h-4 w-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
