
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, RegistryStudent, ClassRoom } from '../types';
import { MOCK_SCHOOLS, MOCK_STUDENT_REGISTRY } from '../constants';
import { supabase } from '../services/supabaseClient';
import { useToast } from './ToastContext';

interface DataContextType {
  schools: School[];
  students: RegistryStudent[];
  classes: ClassRoom[];
  isLoading: boolean;
  addStudent: (student: RegistryStudent) => Promise<void>;
  updateStudents: (updatedStudents: RegistryStudent[]) => Promise<void>;
  updateClasses: (updatedClasses: ClassRoom[]) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<RegistryStudent[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: sData } = await supabase.from('schools').select('*');
      const { data: stData } = await supabase.from('students').select('*');
      const { data: cData } = await supabase.from('classes').select('*');

      setSchools(sData || MOCK_SCHOOLS);
      setStudents(stData || MOCK_STUDENT_REGISTRY);
      setClasses(cData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setSchools(MOCK_SCHOOLS);
      setStudents(MOCK_STUDENT_REGISTRY);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const addStudent = async (student: RegistryStudent) => {
    setStudents(prev => [student, ...prev]);
    const { error } = await supabase.from('students').insert([student]);
    if (!error) addToast("Registro criado com sucesso!", "success");
  };

  const updateStudents = async (updatedStudents: RegistryStudent[]) => {
    setStudents(updatedStudents);
    await supabase.from('students').upsert(updatedStudents);
  };

  const updateClasses = async (updatedClasses: ClassRoom[]) => {
    setClasses(updatedClasses);
    await supabase.from('classes').upsert(updatedClasses);
  };

  return (
    <DataContext.Provider value={{ 
      schools, students, classes, isLoading, 
      addStudent, updateStudents, updateClasses, refreshData: loadData 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
