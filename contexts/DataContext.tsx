import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { School, RegistryStudent } from '../types';
import { MOCK_SCHOOLS, MOCK_STUDENT_REGISTRY } from '../constants';
import { supabase } from '../services/supabaseClient';
import { useToast } from './ToastContext';

interface DataContextType {
  schools: School[];
  students: RegistryStudent[];
  lastBackupDate: string | null;
  addSchool: (school: School) => Promise<void>;
  addStudent: (student: RegistryStudent) => Promise<void>;
  updateSchools: (newSchools: School[]) => Promise<void>;
  updateStudents: (newStudents: RegistryStudent[]) => Promise<void>;
  removeStudent: (id: string) => Promise<void>;
  removeSchool: (id: string) => Promise<void>;
  resetData: () => Promise<void>;
  registerBackup: () => void;
  isLoading: boolean;
  isOffline: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<RegistryStudent[]>([]);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const isTableMissingError = (error: any) => {
    if (!error) return false;
    return (
      error.code === 'PGRST205' || 
      error.code === '42P01' || 
      (error.message && error.message.includes('Could not find the table'))
    );
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (!supabase) throw new Error("Supabase client not initialized");

      // 1. Carregar Escolas
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('*');

      if (schoolsError) {
          if (isTableMissingError(schoolsError)) {
             throw new Error("TABLE_MISSING");
          }
          throw schoolsError;
      }

      // 2. Carregar Alunos
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) {
          if (isTableMissingError(studentsError)) {
             throw new Error("TABLE_MISSING");
          }
          throw studentsError;
      }

      let finalSchools = schoolsData as School[];
      let finalStudents = studentsData as RegistryStudent[];

      // SEEDING INICIAL se o banco estiver vazio
      if ((!finalSchools || finalSchools.length === 0) && (!finalStudents || finalStudents.length === 0)) {
          const { error: seedSchoolsError } = await supabase.from('schools').insert(MOCK_SCHOOLS);
          const { error: seedStudentsError } = await supabase.from('students').insert(MOCK_STUDENT_REGISTRY);

          if (!seedSchoolsError && !seedStudentsError) {
             finalSchools = MOCK_SCHOOLS;
             finalStudents = MOCK_STUDENT_REGISTRY;
             addToast("Banco de dados sincronizado.", "success");
          }
      }

      setSchools(finalSchools || []);
      setStudents(finalStudents || []);
      setIsOffline(false);

    } catch (error: any) {
      setSchools(MOCK_SCHOOLS);
      setStudents(MOCK_STUDENT_REGISTRY);
      setIsOffline(true);

      if (error.message !== "TABLE_MISSING") {
          console.error("Supabase connection error:", error);
      }
    } finally {
      setIsLoading(false);
      const savedBackup = localStorage.getItem('educa_last_backup');
      setLastBackupDate(savedBackup);
    }
  };

  const addSchool = async (school: School) => {
    // Adiciona localmente primeiro (UX instantânea)
    setSchools(prev => [...prev, school]);
    
    try {
        if (!supabase) throw new Error("Supabase não configurado");

        const { error } = await supabase.from('schools').insert(school);
        
        if (error) {
            if (isTableMissingError(error)) {
                setIsOffline(true);
                addToast("Salvo localmente (Tabela 'schools' não encontrada).", "info");
            } else {
                throw error;
            }
        } else {
            setIsOffline(false);
            addToast("Escola salva na nuvem.", "success");
        }
    } catch (e: any) {
        console.error("Erro ao salvar escola no Supabase:", e);
        addToast("Salvo apenas localmente (Erro de conexão).", "warning");
    }
  };

  const addStudent = async (student: RegistryStudent) => {
    // Adiciona localmente primeiro
    setStudents(prev => [...prev, student]);

    try {
        if (!supabase) throw new Error("Supabase não configurado");

        const { error } = await supabase.from('students').insert(student);
        
        if (error) {
             if (isTableMissingError(error)) {
                 setIsOffline(true);
                 addToast("Matrícula registrada localmente (Sincronização pendente).", "info");
             } else {
                 throw error;
             }
        } else {
             setIsOffline(false);
             addToast("Matrícula salva com sucesso na nuvem!", "success");
        }
    } catch (e: any) {
        console.error("Erro ao salvar aluno no Supabase:", e);
        addToast("Matrícula registrada no dispositivo (Modo Offline).", "warning");
    }
  };

  const updateSchools = async (newSchools: School[]) => {
    setSchools(newSchools);
    try {
        if (!supabase) return;
        const { error } = await supabase.from('schools').upsert(newSchools);
        if (error) throw error;
    } catch (e: any) {
         console.warn("Update schools failed, keeping local version", e);
    }
  };

  const updateStudents = async (newStudents: RegistryStudent[]) => {
    setStudents(prev => {
        const studentMap = new Map(prev.map(s => [s.id, s]));
        newStudents.forEach(s => studentMap.set(s.id, s));
        return Array.from(studentMap.values());
    });

    try {
        if (!supabase) return;
        const { error } = await supabase.from('students').upsert(newStudents);
        if (error) throw error;
    } catch (e: any) {
        console.warn("Update students failed, keeping local version", e);
    }
  };

  const removeStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    try {
        if (!supabase) return;
        await supabase.from('students').delete().eq('id', id);
        addToast("Aluno removido.", "success");
    } catch (e) {
        addToast("Removido localmente.", "info");
    }
  };

  const removeSchool = async (id: string) => {
    setSchools(prev => prev.filter(s => s.id !== id));
    try {
        if (!supabase) return;
        await supabase.from('schools').delete().eq('id', id);
        addToast("Escola removida.", "success");
    } catch (e) {
        addToast("Removida localmente.", "info");
    }
  };

  const resetData = async () => {
    if(!window.confirm("Restaurar dados originais? Isso pode afetar a nuvem.")) return;
    setIsLoading(true);
    try {
        if (!supabase) throw new Error();
        await supabase.from('students').delete().neq('id', '0'); 
        await supabase.from('schools').delete().neq('id', '0');
        await supabase.from('schools').insert(MOCK_SCHOOLS);
        await supabase.from('students').insert(MOCK_STUDENT_REGISTRY);
        await loadData();
    } catch (e) {
        setSchools(MOCK_SCHOOLS);
        setStudents(MOCK_STUDENT_REGISTRY);
        addToast("Dados locais restaurados.", "info");
    } finally {
        setIsLoading(false);
    }
  };

  const registerBackup = () => {
      const now = new Date().toISOString();
      setLastBackupDate(now);
      localStorage.setItem('educa_last_backup', now);
  };

  return (
    <DataContext.Provider value={{ 
      schools, 
      students, 
      lastBackupDate,
      addSchool, 
      addStudent, 
      updateSchools, 
      updateStudents, 
      removeStudent, 
      removeSchool, 
      resetData, 
      registerBackup, 
      isLoading,
      isOffline,
      refreshData: loadData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};