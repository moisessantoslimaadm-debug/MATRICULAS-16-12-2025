import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  UserCheck, UserX, Save, Search, Users, 
  MessageSquare, Loader2, ClipboardCheck,
  Target, User, ChevronRight, ArrowLeft
} from 'lucide-react';
import { useNavigate } from '../router';
import { RegistryStudent } from '../types';

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
        
        if (attendance[s.id] !== undefined) {
          const cur = s.attendance || { totalSchoolDays: 0, presentDays: 0, justifiedAbsences: 0, unjustifiedAbsences: 0 };
          sc.attendance = {
            ...cur,
            totalSchoolDays: cur.totalSchoolDays + 1,
            presentDays: attendance[s.id] ? cur.presentDays + 1 : cur.presentDays,
            unjustifiedAbsences: !attendance[s.id] ? cur.unjustifiedAbsences + 1 : cur.unjustifiedAbsences
          };
        }

        if (tempGrades[s.id]) {
            const history = s.performanceHistory || [{ subject: 'GERAL', g1: ['', '', ''] }];
            const updatedHistory = [...history];
            updatedHistory[0] = { ...updatedHistory[0], g1: tempGrades[s.id] };
            sc.performanceHistory = updatedHistory;
        }

        return sc;
      });

      await updateStudents(updatedStudents);
      addToast("Registros sincronizados com sucesso.", "success");
      setAttendance({});
      setTempGrades({});
    } catch (e) {
      addToast("Falha na sincronização.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-14">
          <div className="animate-in fade-in slide-in-from-left-6 duration-700">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-ultra mb-10 hover:text-emerald-600 transition group">
                <div className="bg-slate-100 p-2.5 rounded-xl group-hover:bg-emerald-50 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                </div> Painel de Rede
            </button>
            <div className="flex items-center gap-5 mb-8">
                <span className="bg-emerald-600 text-white px-7 py-2.5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-ultra shadow-xl shadow-emerald-100">Portal do Docente</span>
                <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-ultra">{userData.schoolName || 'SME ITABERABA'}</span>
            </div>
            <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">Diário de <span className="text-emerald-600">Bordo.</span></h1>
            <p className="text-slate-500 font-medium text-2xl tracking-tight">Gestão nominal de fluxo e proficiência educacional.</p>
          </div>
          
          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-slate-900 text-white px-16 py-9 rounded-[4rem] font-black text-[12px] uppercase tracking-ultra shadow-2xl shadow-slate-200 hover:bg-emerald-600 transition-all flex items-center gap-7 disabled:opacity-50 active:scale-95"
          >
            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
            Sincronizar Diário
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
            <div className="lg:col-span-3 space-y-10">
                <div className="bg-white p-14 rounded-[4.5rem] border border-slate-100 shadow-xl shadow-slate-100">
                    <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-ultra mb-14">Operação</h3>
                    <nav className="space-y-6">
                        {[
                            { id: 'attendance', label: 'Chamada', icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { id: 'grades', label: 'Avaliações', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { id: 'notes', label: 'Portfólio', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' }
                        ].map(item => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full flex items-center gap-7 p-7 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === item.id ? `${item.bg} ${item.color} shadow-lg scale-105` : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                <item.icon className="h-7 w-7" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="bg-slate-900 p-14 rounded-[4rem] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                    <Users className="h-12 w-12 text-emerald-400 mb-10" />
                    <p className="text-[12px] font-black uppercase tracking-ultra opacity-40 mb-8">Turma Ativa</p>
                    <div className="flex items-end gap-5">
                        <span className="text-8xl font-black leading-none">{filtered.length}</span>
                        <span className="text-[11px] font-bold opacity-60 uppercase mb-4 tracking-ultra">Alunos</span>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-9 space-y-12">
                <div className="bg-white p-5 rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-100 flex items-center gap-10 group focus-within:ring-8 focus-within:ring-emerald-50 transition-all">
                    <Search className="h-12 w-12 text-slate-200 ml-10 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Pesquisar por nome ou ID..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-4xl font-black text-slate-800 placeholder:text-slate-200"
                    />
                </div>

                <div className="card-requinte overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-20 py-14 text-[12px] font-black text-slate-400 uppercase tracking-ultra">Identificação Nominal</th>
                                <th className="px-20 py-14 text-[12px] font-black text-slate-400 uppercase tracking-ultra text-center">Operação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(student => (
                                <tr key={student.id} className="tr-premium group">
                                    <td className="px-20 py-16">
                                        <div className="flex items-center gap-14">
                                            <div className="w-28 h-28 rounded-[3rem] bg-slate-100 border-[6px] border-white shadow-2xl overflow-hidden flex items-center justify-center transition-transform group-hover:rotate-6">
                                                {student.photo ? <img src={student.photo} className="w-full h-full object-cover" /> : <User className="h-14 w-14 text-slate-300" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-4xl tracking-tighter leading-tight">{student.name}</p>
                                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-ultra mt-4">SME Protocol: {student.enrollmentId || student.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-20 py-16 text-center">
                                        {activeTab === 'attendance' && (
                                            <div className="flex items-center justify-center gap-12">
                                                <button 
                                                    onClick={() => handleToggle(student.id, false)}
                                                    className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all border-2 ${attendance[student.id] === false ? 'bg-red-600 border-red-600 text-white shadow-2xl scale-125' : 'bg-white border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100'}`}
                                                >
                                                    <UserX className="h-12 w-12" />
                                                </button>
                                                <button 
                                                    onClick={() => handleToggle(student.id, true)}
                                                    className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all border-2 ${attendance[student.id] === true ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xl scale-125' : 'bg-white border-slate-100 text-slate-300 hover:text-emerald-500 hover:border-emerald-100'}`}
                                                >
                                                    <UserCheck className="h-12 w-12" />
                                                </button>
                                            </div>
                                        )}

                                        {activeTab === 'grades' && (
                                            <div className="flex justify-center gap-8">
                                                {[0, 1, 2].map(idx => {
                                                    const val = (tempGrades[student.id]?.[idx] || '') as keyof typeof CONCEPTS;
                                                    const style = CONCEPTS[val];
                                                    return (
                                                        <button 
                                                            key={idx}
                                                            onClick={() => handleGradeCycle(student.id, idx)}
                                                            className={`w-24 h-24 rounded-[2.5rem] border-2 font-black text-xl transition-all duration-500 ${val ? `${style.bg} ${style.text} border-transparent shadow-2xl scale-125` : 'bg-slate-50/30 border-dashed border-slate-200 text-slate-300'}`}
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
                                                className="px-14 py-8 bg-blue-50 text-blue-600 rounded-[3rem] font-black text-[12px] uppercase tracking-ultra hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-6 mx-auto"
                                            >
                                                Prontuário SME <ChevronRight className="h-7 w-7" />
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