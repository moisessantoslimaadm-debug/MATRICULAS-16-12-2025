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
  
  // Initialize states
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<RegistryStudent[]>([]);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);

  // Load initial data
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

      console.log("Conectando ao Supabase...");
      
      // 1. Carregar Escolas
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('schools')
        .select('*');

      if (schoolsError) {
          if (isTableMissingError(schoolsError)) {
             console.warn("Supabase: Tabelas não encontradas. Carregando dados de exemplo.");
             throw new Error("TABLE_MISSING");
          }
          console.error("Supabase Error (Schools):", JSON.stringify(schoolsError, null, 2));
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
          console.error("Supabase Error (Students):", JSON.stringify(studentsError, null, 2));
          throw studentsError;
      }

      let finalSchools = schoolsData as School[];
      let finalStudents = studentsData as RegistryStudent[];

      // SEEDING INICIAL
      if ((!finalSchools || finalSchools.length === 0) && (!finalStudents || finalStudents.length === 0)) {
          console.log("Banco vazio detectado. Populando com dados iniciais...");
          
          const { error: seedSchoolsError } = await supabase
            .from('schools')
            .insert(MOCK_SCHOOLS);
            
          const { error: seedStudentsError } = await supabase
            .from('students')
            .insert(MOCK_STUDENT_REGISTRY);

          if (!seedSchoolsError && !seedStudentsError) {
             finalSchools = MOCK_SCHOOLS;
             finalStudents = MOCK_STUDENT_REGISTRY;
             addToast("Banco de dados inicializado com sucesso!", "success");
          } else {
             if (!isTableMissingError(seedSchoolsError) && !isTableMissingError(seedStudentsError)) {
                 console.warn("Não foi possível popular o banco:", seedSchoolsError || seedStudentsError);
             }
          }
      }

      setSchools(finalSchools || []);
      setStudents(finalStudents || []);
      setIsOffline(false); // Conexão bem sucedida

      const savedBackup = localStorage.getItem('educa_last_backup');
      setLastBackupDate(savedBackup);
      
    } catch (error: any) {
      // --- FALLBACK STRATEGY ---
      setSchools(MOCK_SCHOOLS);
      setStudents(MOCK_STUDENT_REGISTRY);
      setIsOffline(true); // Marca como offline

      const isMissing = error.message === "TABLE_MISSING" || isTableMissingError(error);

      if (isMissing) {
          addToast("Banco não configurado. Usando dados locais.", 'info');
      } else {
          const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
          console.error("Erro crítico ao carregar dados do Supabase:", errorMsg);
          addToast("Erro de conexão. Usando dados locais.", 'warning');
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const addSchool = async (school: School) => {
    try {
        if (!supabase) return;
        setSchools(prev => [...prev, school]);
        
        if (isOffline) {
            addToast("Salvo localmente (Offline).", "info");
            return;
        }

        const { error } = await supabase.from('schools').insert(school);
        if (error) {
            setSchools(prev => prev.filter(s => s.id !== school.id));
            if (isTableMissingError(error)) {
                setIsOffline(true);
                addToast("Modo Offline ativado.", "warning");
            } else {
                throw error;
            }
        }
    } catch (e: any) {
        addToast(`Erro ao salvar escola: ${e.message}`, "error");
    }
  };

  const addStudent = async (student: RegistryStudent) => {
    try {
        if (!supabase) return;
        setStudents(prev => [...prev, student]);

        if (isOffline) {
            addToast("Salvo localmente (Offline).", "info");
            return;
        }

        const { error } = await supabase.from('students').insert(student);
        if (error) {
             setStudents(prev => prev.filter(s => s.id !== student.id));
             if (isTableMissingError(error)) {
                 setIsOffline(true);
                 addToast("Modo Offline ativado.", "warning");
                 setStudents(prev => [...prev, student]); // Re-add locally
             } else {
                 throw error;
             }
        }
    } catch (e: any) {
        addToast(`Erro ao salvar aluno: ${e.message}`, "error");
    }
  };

  const updateSchools = async (newSchools: School[]) => {
    try {
        setSchools(newSchools);
        if (isOffline) return;
        if (!supabase) return;

        const { error } = await supabase.from('schools').upsert(newSchools);
        if (error) throw error;
    } catch (e: any) {
         if (isTableMissingError(e)) { setIsOffline(true); return; }
         console.error(e);
         addToast("Erro ao atualizar escolas.", "error");
         loadData();
    }
  };

  const updateStudents = async (newStudents: RegistryStudent[]) => {
    try {
        setStudents(prev => {
            const studentMap = new Map(prev.map(s => [s.id, s]));
            newStudents.forEach(s => studentMap.set(s.id, s));
            return Array.from(studentMap.values());
        });

        if (isOffline) return;
        if (!supabase) return;

        const { error } = await supabase.from('students').upsert(newStudents);
        if (error) throw error;
    } catch (e: any) {
        if (isTableMissingError(e)) { setIsOffline(true); return; }
        console.error(e);
        addToast("Erro ao atualizar alunos.", "error");
        loadData();
    }
  };

  const removeStudent = async (id: string) => {
    try {
        setStudents(prev => prev.filter(s => s.id !== id));
        if (isOffline) return;
        if (!supabase) return;

        const { error } = await supabase.from('students').delete().eq('id', id);
        if (error) throw error;
        addToast("Aluno removido.", "success");
    } catch (e: any) {
        if (isTableMissingError(e)) { setIsOffline(true); return; }
        addToast("Erro ao remover aluno da nuvem.", "error");
        loadData();
    }
  };

  const removeSchool = async (id: string) => {
    try {
        setSchools(prev => prev.filter(s => s.id !== id));
        if (isOffline) return;
        if (!supabase) return;

        const { error } = await supabase.from('schools').delete().eq('id', id);
        if (error) throw error;
        addToast("Escola removida.", "success");
    } catch (e: any) {
        if (isTableMissingError(e)) { setIsOffline(true); return; }
        addToast("Erro ao remover escola da nuvem.", "error");
        loadData();
    }
  };

  const resetData = async () => {
    if(!window.confirm("ATENÇÃO: Isso apagará TODOS os dados no Supabase e restaurará os dados de exemplo. Deseja continuar?")) {
        return;
    }
    try {
        if (!supabase) return;
        setIsLoading(true);
        if (!isOffline) {
            await supabase.from('students').delete().neq('id', '0'); 
            await supabase.from('schools').delete().neq('id', '0');
            await supabase.from('schools').insert(MOCK_SCHOOLS);
            await supabase.from('students').insert(MOCK_STUDENT_REGISTRY);
        }
        setSchools(MOCK_SCHOOLS);
        setStudents(MOCK_STUDENT_REGISTRY);
        addToast("Sistema restaurado para os padrões de fábrica.", "info");
    } catch (e: any) {
        if (isTableMissingError(e)) {
             setSchools(MOCK_SCHOOLS);
             setStudents(MOCK_STUDENT_REGISTRY);
             setIsOffline(true);
             addToast("Dados locais restaurados (Banco desconectado).", "info");
        } else {
             addToast("Erro ao resetar sistema.", "error");
        }
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