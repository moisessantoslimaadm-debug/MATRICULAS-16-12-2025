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
  isOffline: boolean;
  addStudent: (student: RegistryStudent) => Promise<void>;
  updateStudents: (updatedStudents: RegistryStudent[]) => Promise<void>;
  updateSchools: (updatedSchools: School[]) => Promise<void>;
  updateClasses: (updatedClasses: ClassRoom[]) => Promise<void>;
  refreshData: () => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
  removeSchool: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<RegistryStudent[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: sData, error: sErr } = await supabase.from('schools').select('*');
      const { data: stData, error: stErr } = await supabase.from('students').select('*');
      const { data: cData } = await supabase.from('classes').select('*');

      // Defensive filtering: remove nulls and ensure required geo props
      const validSchools = (sData || MOCK_SCHOOLS)
        .filter((s: any) => s && s.id && typeof s.lat === 'number' && typeof s.lng === 'number');
      
      const validStudents = (stData || MOCK_STUDENT_REGISTRY)
        .filter((s: any) => s && s.id);

      setSchools(validSchools);
      setStudents(validStudents);
      setClasses((cData || []).filter(Boolean));
      setIsOffline(false);
    } catch (error) {
      console.error("Rede offline ou erro de conexão:", error);
      setIsOffline(true);
      setSchools(MOCK_SCHOOLS.filter(s => s && s.id));
      setStudents(MOCK_STUDENT_REGISTRY.filter(s => s && s.id));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const addStudent = async (student: RegistryStudent) => {
    if (!student) return;
    setStudents(prev => [student, ...prev]);
    const { error } = await supabase.from('students').insert([student]);
    if (!error) addToast("Registro criado com sucesso!", "success");
    else console.error("Error adding student:", error);
  };

  const updateStudents = async (updatedStudents: RegistryStudent[]) => {
    const valid = (updatedStudents || []).filter(Boolean);
    setStudents(valid);
    await supabase.from('students').upsert(valid);
  };

  const updateSchools = async (updatedSchools: School[]) => {
    const valid = (updatedSchools || []).filter(Boolean);
    setSchools(valid);
    await supabase.from('schools').upsert(valid);
  };

  const updateClasses = async (updatedClasses: ClassRoom[]) => {
    const valid = (updatedClasses || []).filter(Boolean);
    setClasses(valid);
    await supabase.from('classes').upsert(valid);
  };

  const removeStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (!error) addToast("Estudante removido.", "info");
  };

  const removeSchool = async (id: string) => {
    setSchools(prev => prev.filter(s => s.id !== id));
    const { error } = await supabase.from('schools').delete().eq('id', id);
    if (!error) addToast("Unidade removida.", "info");
  };

  return (
    <DataContext.Provider value={{ 
      schools, students, classes, isLoading, isOffline,
      addStudent, updateStudents, updateSchools, updateClasses, refreshData: loadData,
      removeStudent, removeSchool
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