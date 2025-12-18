import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, RegistryStudent, UserRole } from '../types';
import { MOCK_SCHOOLS, MOCK_STUDENT_REGISTRY } from '../constants';
import { supabase } from '../services/supabaseClient';
import { useToast } from './ToastContext';

interface DataContextType {
  schools: School[];
  students: RegistryStudent[];
  addSchool: (school: School) => Promise<void>;
  addStudent: (student: RegistryStudent) => Promise<void>;
  updateStudent: (student: RegistryStudent) => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  isOffline: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<RegistryStudent[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Busca escolas
      const { data: schoolsData, error: sError } = await supabase.from('schools').select('*');
      if (sError) throw sError;

      // Busca alunos
      const { data: studentsData, error: stError } = await supabase.from('students').select('*');
      if (stError) throw stError;

      setSchools(schoolsData || MOCK_SCHOOLS);
      setStudents(studentsData || MOCK_STUDENT_REGISTRY);
      setIsOffline(false);
    } catch (error) {
      console.error("Erro ao carregar do Supabase:", error);
      setSchools(MOCK_SCHOOLS);
      setStudents(MOCK_STUDENT_REGISTRY);
      setIsOffline(true);
      addToast("Modo Offline: Usando dados locais.", "warning");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addStudent = async (student: RegistryStudent) => {
    setStudents(prev => [student, ...prev]);
    try {
      const { error } = await supabase.from('students').insert(student);
      if (error) throw error;
      addToast("Matrícula enviada para a nuvem!", "success");
    } catch (e) {
      addToast("Salvo localmente. Sincronização pendente.", "info");
    }
  };

  const updateStudent = async (student: RegistryStudent) => {
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    try {
      const { error } = await supabase.from('students').update(student).eq('id', student.id);
      if (error) throw error;
      addToast("Dados do aluno atualizados.", "success");
    } catch (e) {
      console.error(e);
    }
  };

  const removeStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    try {
      await supabase.from('students').delete().eq('id', id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DataContext.Provider value={{ 
      schools, 
      students, 
      addSchool: async () => {}, 
      addStudent, 
      updateStudent,
      removeStudent,
      refreshData: loadData,
      isLoading,
      isOffline 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};