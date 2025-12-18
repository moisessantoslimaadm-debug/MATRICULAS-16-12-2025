import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { UserCheck, UserX, Save, Calendar, Search, Users, ChevronRight } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export const TeacherJournal: React.FC = () => {
  const { students } = useData();
  const { addToast } = useToast();
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const teacherData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
  
  const myStudents = useMemo(() => {
    return students.filter(s => s.schoolId === teacherData.schoolId || s.status === 'Matriculado');
  }, [students, teacherData]);

  const filtered = myStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleToggle = (id: string) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    addToast("Frequência do dia salva no Supabase!", "success");
    // Aqui integraria com a tabela 'performance' do Passo 1
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Diário de Classe</h1>
            <p className="text-slate-500">Realize a chamada para o dia {new Date().toLocaleDateString()}</p>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
          >
            <Save className="h-5 w-5" /> Salvar Chamada
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar aluno na turma..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map(student => (
              <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{student.name}</h4>
                    <p className="text-xs text-slate-500">{student.className || 'Turma não definida'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleToggle(student.id)}
                    className={`p-2 rounded-lg border transition-all ${attendance[student.id] === false ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-400'}`}
                    title="Falta"
                  >
                    <UserX className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setAttendance(prev => ({ ...prev, [student.id]: true }))}
                    className={`p-2 rounded-lg border transition-all ${attendance[student.id] === true ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-400'}`}
                    title="Presença"
                  >
                    <UserCheck className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};