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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize states
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<RegistryStudent[]>([]);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

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
          // Ignore table missing errors in console.error, allow catch block to handle fallback
          if (schoolsError.code !== 'PGRST205' && schoolsError.code !== '42P01') {
              console.error("Supabase Error (Schools):", JSON.stringify(schoolsError, null, 2));
          }
          throw schoolsError;
      }

      // 2. Carregar Alunos
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) {
          if (studentsError.code !== 'PGRST205' && studentsError.code !== '42P01') {
              console.error("Supabase Error (Students):", JSON.stringify(studentsError, null, 2));
          }
          throw studentsError;
      }

      let finalSchools = schoolsData as School[];
      let finalStudents = studentsData as RegistryStudent[];

      // SEEDING INICIAL: Se o banco estiver vazio, popula com os dados de Mock (apenas na primeira vez)
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
             // Se erro for de tabela inexistente, será capturado no catch geral se lançarmos,
             // mas aqui é seeding. Apenas logamos warning.
             console.warn("Não foi possível popular o banco (Tabelas ausentes?).");
          }
      }

      setSchools(finalSchools || []);
      setStudents(finalStudents || []);

      const savedBackup = localStorage.getItem('educa_last_backup');
      setLastBackupDate(savedBackup);
      
    } catch (error: any) {
      const isMissingTable = error?.code === 'PGRST205' || error?.code === '42P01';

      if (!isMissingTable) {
          // Log real critical errors
          const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
          console.error("Erro crítico ao carregar dados do Supabase:", errorMsg);
      } else {
          // Log setup warning
          console.warn("Supabase: Tabelas não encontradas. Ativando modo offline com dados locais.");
      }
      
      // --- FALLBACK STRATEGY ---
      // Se falhar (ex: tabelas não existem, sem internet), usa dados locais para o app não quebrar
      setSchools(MOCK_SCHOOLS);
      setStudents(MOCK_STUDENT_REGISTRY);

      let userMessage = "Erro de conexão com o banco.";
      
      if (isMissingTable) {
          userMessage = "Banco de dados não configurado (Tabelas ausentes).";
          // console.info("DICA: Execute o SQL de criação das tabelas no painel do Supabase (SQL Editor).");
      } else if (error?.message) {
          userMessage = `Erro no banco: ${error.message}`;
      }

      addToast(`${userMessage} Usando dados locais.`, 'warning');
      
    } finally {
      setIsLoading(false);
    }
  };

  const addSchool = async (school: School) => {
    try {
        if (!supabase) return;
        
        // Otimistic UI Update
        setSchools(prev => [...prev, school]);

        const { error } = await supabase.from('schools').insert(school);
        
        if (error) {
            console.error("Erro ao inserir escola:", error);
            // Revert on error
            setSchools(prev => prev.filter(s => s.id !== school.id));
            throw error;
        }
    } catch (e: any) {
        // Se erro for tabela inexistente, não mostre erro critico, apenas aviso
        if (e?.code === 'PGRST205' || e?.code === '42P01') {
            addToast("Modo Offline: Dados salvos apenas na memória.", "info");
        } else {
            addToast(`Erro ao salvar escola: ${e.message || 'Verifique o console'}`, "error");
        }
    }
  };

  const addStudent = async (student: RegistryStudent) => {
    try {
        if (!supabase) return;

        // Otimistic UI Update
        setStudents(prev => [...prev, student]);

        const { error } = await supabase.from('students').insert(student);
        
        if (error) {
             console.error("Erro ao inserir aluno:", error);
             // Revert on error
             setStudents(prev => prev.filter(s => s.id !== student.id));
             throw error;
        }
    } catch (e: any) {
        if (e?.code === 'PGRST205' || e?.code === '42P01') {
            addToast("Modo Offline: Dados salvos apenas na memória.", "info");
        } else {
            addToast(`Erro ao salvar aluno: ${e.message || 'Verifique o console'}`, "error");
        }
    }
  };

  const updateSchools = async (newSchools: School[]) => {
    try {
        if (!supabase) return;

        // Para simplificar a sincronização, enviamos upsert para cada item modificado
        // Em um app real, idealmente saberíamos qual mudou, mas aqui o app passa o array todo.
        // Vamos atualizar o estado local primeiro.
        setSchools(newSchools);

        const { error } = await supabase
            .from('schools')
            .upsert(newSchools);

        if (error) throw error;
        
    } catch (e: any) {
         if (e?.code === 'PGRST205' || e?.code === '42P01') return; // Ignore offline
         console.error(e);
         addToast("Erro ao atualizar escolas.", "error");
         loadData(); // Revert to server state
    }
  };

  const updateStudents = async (newStudents: RegistryStudent[]) => {
    try {
        if (!supabase) return;

        // Otimistic UI
        setStudents(prev => {
            const studentMap = new Map(prev.map(s => [s.id, s]));
            newStudents.forEach(s => studentMap.set(s.id, s));
            return Array.from(studentMap.values());
        });

        const { error } = await supabase
            .from('students')
            .upsert(newStudents);

        if (error) throw error;

    } catch (e: any) {
        if (e?.code === 'PGRST205' || e?.code === '42P01') return; // Ignore offline
        console.error(e);
        addToast("Erro ao atualizar alunos.", "error");
        loadData(); // Revert to server state
    }
  };

  const removeStudent = async (id: string) => {
    try {
        if (!supabase) return;

        setStudents(prev => prev.filter(s => s.id !== id));

        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        addToast("Aluno removido.", "success");
    } catch (e: any) {
        if (e?.code === 'PGRST205' || e?.code === '42P01') return;
        addToast("Erro ao remover aluno da nuvem.", "error");
        loadData();
    }
  };

  const removeSchool = async (id: string) => {
    try {
        if (!supabase) return;

        setSchools(prev => prev.filter(s => s.id !== id));

        const { error } = await supabase
            .from('schools')
            .delete()
            .eq('id', id);

        if (error) throw error;

        addToast("Escola removida.", "success");
    } catch (e: any) {
        if (e?.code === 'PGRST205' || e?.code === '42P01') return;
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

        // 1. Delete all rows
        await supabase.from('students').delete().neq('id', '0'); // Hack to delete all
        await supabase.from('schools').delete().neq('id', '0');

        // 2. Insert Mocks
        await supabase.from('schools').insert(MOCK_SCHOOLS);
        await supabase.from('students').insert(MOCK_STUDENT_REGISTRY);
        
        setSchools(MOCK_SCHOOLS);
        setStudents(MOCK_STUDENT_REGISTRY);
        
        addToast("Sistema restaurado para os padrões de fábrica.", "info");
    } catch (e) {
        addToast("Erro ao resetar sistema (possivelmente offline).", "error");
        // Fallback for UI even if backend fails
        setSchools(MOCK_SCHOOLS);
        setStudents(MOCK_STUDENT_REGISTRY);
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
      isLoading
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