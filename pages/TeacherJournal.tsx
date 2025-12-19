
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  UserCheck, UserX, Save, Search, Users, ArrowLeft, 
  BookOpen, Star, AlertTriangle, ChevronRight, Loader2,
  Calendar, ClipboardCheck, TrendingUp, MessageSquare,
  Filter, LayoutGrid, CheckCircle2, User
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
    if (userData.role === 'Secretaria de Educação') return students;
    return students.filter(s => s.schoolId === userData.schoolId || s.school?.includes(userData.schoolId));
  }, [students, userData]);

  const filtered = myStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleToggle = (studentId: string, present: boolean) => {
    setAttendance(prev => ({ ...prev, [studentId]: present }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedStudents = students.map(s => {
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
      addToast("Diário sincronizado!", "success");
      setAttendance({});
      setTempGrades({});
    } catch (e) {
      addToast("Erro na sincronização.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex items-center gap-3 mb-4">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Espaço do Educador</span>
                <span className="text-slate-300 text-sm">•</span>
                <span className="text-slate-400 text-xs font-bold">{userData.schoolName || 'Rede Municipal'}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">Diário de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Bordo Digit@l</span></h1>
            <p className="text-slate-500 font-medium text-lg">Gestão simplificada de frequência e desempenho em tempo real.</p>
          </div>
          
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
             <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="bg-slate-50 p-3 rounded-2xl"><Calendar className="h-5 w-5 text-indigo-500" /></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Data Letiva</p>
                    <p className="text-sm font-black text-slate-900">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
             </div>
             <button 
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-4 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Sincronizar Diário
              </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Módulos de Trabalho</h3>
                    <nav className="space-y-2">
                        {[
                            { id: 'attendance', label: 'Chamada Eletrônica', icon: ClipboardCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { id: 'grades', label: 'Lançamento de Notas', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { id: 'notes', label: 'Registros Pedagógicos', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' }
                        ].map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === item.id ? `${item.bg} ${item.color} shadow-md scale-105` : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-10 p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500 opacity-20 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Métricas da Turma</p>
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-4xl font-black">{filtered.length}</span>
                            <span className="text-[10px] font-bold opacity-70 uppercase mb-2">Alunos</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-400 w-3/4"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Legenda / Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold text-slate-600">Presença Confirmada</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-xs font-bold text-slate-600">Falta Registrada</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-9 space-y-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center gap-4">
                    <Search className="h-6 w-6 text-slate-300" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar aluno por nome ou número..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-lg font-black text-slate-800 placeholder:text-slate-300"
                    />
                    <div className="flex gap-2">
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition"><Filter className="h-5 w-5" /></button>
                        <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition"><LayoutGrid className="h-5 w-5" /></button>
                    </div>
                </div>

                <div className="bg-white rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudante</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status / Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(student => (
                                    <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="relative">
                                                    <div className="w-16 h-16 rounded-3xl bg-slate-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                        {student.photo ? (
                                                            <img src={student.photo} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <User className="h-8 w-8 text-slate-300" />
                                                        )}
                                                    </div>
                                                    {student.specialNeeds && (
                                                        <div className="absolute -top-1 -right-1 bg-pink-500 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                                                            <Star className="h-3 w-3 fill-current" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-xl tracking-tight mb-1">{student.name}</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matrícula: {student.enrollmentId || '2025-REF'}</span>
                                                        <div className="h-1 w-1 rounded-full bg-slate-200"></div>
                                                        <span className="text-[10px] font-bold text-indigo-500 uppercase">Regular</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            {activeTab === 'attendance' && (
                                                <div className="flex items-center justify-center gap-4">
                                                    <button 
                                                        onClick={() => handleToggle(student.id, false)}
                                                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all border-2 ${attendance[student.id] === false ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-100 scale-110' : 'bg-white border-slate-100 text-slate-300 hover:border-red-100 hover:text-red-500'}`}
                                                    >
                                                        <UserX className="h-7 w-7" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleToggle(student.id, true)}
                                                        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all border-2 ${attendance[student.id] === true ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-100 scale-110' : 'bg-white border-slate-100 text-slate-300 hover:border-emerald-100 hover:text-emerald-500'}`}
                                                    >
                                                        <UserCheck className="h-7 w-7" />
                                                    </button>
                                                </div>
                                            )}

                                            {activeTab === 'grades' && (
                                                <div className="flex justify-center gap-4">
                                                    {[1, 2, 3].map(u => (
                                                        <div key={u} className="flex flex-col items-center">
                                                            <span className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest">Unid {u}</span>
                                                            <input 
                                                                type="text" 
                                                                placeholder="-"
                                                                value={tempGrades[student.id]?.[`unit${u}` as keyof PerformanceRow] || ''}
                                                                onChange={e => setTempGrades({ ...tempGrades, [student.id]: { ...tempGrades[student.id], [`unit${u}`]: e.target.value } })}
                                                                className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-center font-black text-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-lg"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {activeTab === 'notes' && (
                                                <div className="flex justify-center">
                                                    <button 
                                                        onClick={() => navigate(`/student/monitoring?id=${student.id}`)} 
                                                        className="px-8 py-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center gap-3"
                                                    >
                                                        Abrir Prontuário <ChevronRight className="h-4 w-4" />
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
                        <div className="py-24 text-center opacity-30">
                            <Users className="h-20 w-20 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-widest text-xs">Nenhum aluno encontrado nesta busca</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
