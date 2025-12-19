
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { 
  UserCheck, UserX, Save, Search, Users, ArrowLeft, 
  BookOpen, Star, AlertTriangle, ChevronRight, Loader2,
  Calendar, ClipboardCheck, TrendingUp, MessageSquare
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
  
  // Estados para inputs rápidos
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [tempGrades, setTempGrades] = useState<Record<string, Partial<PerformanceRow>>>({});

  const userData = useMemo(() => JSON.parse(sessionStorage.getItem('user_data') || '{}'), []);
  
  const myStudents = useMemo(() => {
    if (userData.role === 'Secretaria de Educação') return students;
    return students.filter(s => s.schoolId === userData.schoolId || s.school?.includes(userData.schoolId));
  }, [students, userData]);

  const filtered = myStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Handles state updates for the attendance status of individual students
  const handleToggle = (studentId: string, present: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: present
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedStudents = students.map(s => {
        let studentCopy = { ...s };

        // 1. Atualiza Frequência
        if (attendance[s.id] !== undefined) {
          const current = s.attendance || { totalSchoolDays: 0, presentDays: 0, justifiedAbsences: 0, unjustifiedAbsences: 0 };
          studentCopy.attendance = {
            ...current,
            totalSchoolDays: current.totalSchoolDays + 1,
            presentDays: attendance[s.id] ? current.presentDays + 1 : current.presentDays,
            unjustifiedAbsences: !attendance[s.id] ? current.unjustifiedAbsences + 1 : current.unjustifiedAbsences
          };
        }

        // 2. Atualiza Notas (Exemplo simplificado para uma disciplina padrão)
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
      addToast("Diário sincronizado com o servidor municipal!", "success");
      setAttendance({});
      setTempGrades({});
    } catch (e) {
      addToast("Erro ao salvar. Verifique sua conexão.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600 h-12 w-12" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-xs font-black uppercase tracking-widest mb-2 transition">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Painel
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <BookOpen className="h-10 w-10 text-indigo-600" /> Diário de Bordo
            </h1>
            <p className="text-slate-500 font-medium">Escola: {userData.schoolName || 'Unidade Municipal'} • Turma: {userData.className || 'A'}</p>
          </div>
          
          <div className="flex gap-3">
             <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('pt-BR')}</span>
             </div>
             <button 
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Salvar Alterações
              </button>
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button onClick={() => setActiveTab('attendance')} className={`flex-1 py-5 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition ${activeTab === 'attendance' ? 'text-indigo-600 border-b-4 border-indigo-600 bg-white' : 'text-slate-400 hover:text-slate-600'}`}>
                <ClipboardCheck className="h-5 w-5" /> Frequência
            </button>
            <button onClick={() => setActiveTab('grades')} className={`flex-1 py-5 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition ${activeTab === 'grades' ? 'text-indigo-600 border-b-4 border-indigo-600 bg-white' : 'text-slate-400 hover:text-slate-600'}`}>
                <TrendingUp className="h-5 w-5" /> Notas/Avaliação
            </button>
            <button onClick={() => setActiveTab('notes')} className={`flex-1 py-5 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition ${activeTab === 'notes' ? 'text-indigo-600 border-b-4 border-indigo-600 bg-white' : 'text-slate-400 hover:text-slate-600'}`}>
                <MessageSquare className="h-5 w-5" /> Ocorrências
            </button>
          </div>

          <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-300" />
            <input 
              type="text" 
              placeholder="Pesquisar aluno na turma..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full font-bold text-slate-700"
            />
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map(student => (
              <div key={student.id} className="p-6 flex flex-col md:flex-row items-center justify-between group hover:bg-slate-50/80 transition-all">
                <div className="flex items-center gap-5 mb-4 md:mb-0 w-full md:w-auto">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center overflow-hidden shadow-sm">
                      {student.photo ? (
                        <img src={student.photo} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="text-indigo-600 font-black text-2xl">{student.name.charAt(0)}</span>
                      )}
                    </div>
                    {student.specialNeeds && (
                        <div className="absolute -top-1 -right-1 bg-pink-500 text-white p-1 rounded-full border-2 border-white">
                            <Star className="h-3 w-3 fill-current" />
                        </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg leading-tight">{student.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">Matrícula: {student.enrollmentId || 'G-2025-001'}</p>
                  </div>
                </div>

                {activeTab === 'attendance' && (
                  <div className="flex items-center gap-3 bg-slate-100/50 p-2 rounded-2xl">
                    <button 
                      onClick={() => handleToggle(student.id, false)}
                      className={`px-5 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 transition-all ${attendance[student.id] === false ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-white text-slate-400 border border-slate-200'}`}
                    >
                      <UserX className="h-4 w-4" /> Falta
                    </button>
                    <button 
                      onClick={() => handleToggle(student.id, true)}
                      className={`px-5 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 transition-all ${attendance[student.id] === true ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'bg-white text-slate-400 border border-slate-200'}`}
                    >
                      <UserCheck className="h-4 w-4" /> Presença
                    </button>
                  </div>
                )}

                {activeTab === 'grades' && (
                  <div className="flex gap-2">
                    {[1, 2, 3].map(u => (
                        <div key={u} className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-slate-400 mb-1">UN{u}</span>
                            <input 
                                type="text" 
                                placeholder="0.0"
                                value={tempGrades[student.id]?.[`unit${u}` as keyof PerformanceRow] || ''}
                                onChange={e => setTempGrades({
                                    ...tempGrades,
                                    [student.id]: { ...tempGrades[student.id], [`unit${u}`]: e.target.value }
                                })}
                                className="w-14 h-12 bg-white border border-slate-200 rounded-xl text-center font-black text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    ))}
                  </div>
                )}

                {activeTab === 'notes' && (
                    <button onClick={() => navigate(`/student/monitoring?id=${student.id}`)} className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition text-slate-400">
                        <MessageSquare className="h-6 w-6" />
                    </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
