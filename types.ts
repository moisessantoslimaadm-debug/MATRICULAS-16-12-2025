
export enum SchoolType {
  INFANTIL = 'Educação Infantil',
  FUNDAMENTAL_1 = 'Fundamental I',
  FUNDAMENTAL_2 = 'Fundamental II',
  MEDIO = 'Ensino Médio',
  EJA = 'EJA'
}

export enum UserRole {
  ADMIN_SME = 'Secretaria de Educação',
  DIRECTOR = 'Diretor Escolar',
  TEACHER = 'Professor',
  PARENT_STUDENT = 'Aluno / Responsável',
  PUBLIC = 'Público'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  schoolId?: string;
  schoolName?: string;
  email: string;
  photo?: string;
  studentId?: string;
}

export interface School {
  id: string;
  inep?: string;
  name: string;
  address: string;
  types: SchoolType[];
  image: string;
  gallery?: string[];
  rating: number;
  availableSlots: number;
  lat: number;
  lng: number;
  distance?: number;
  hasAEE?: boolean;
}

export interface TeacherNote {
  id: string;
  date: string;
  type: 'Pedagógico' | 'Elogio' | 'Alerta' | 'Ocorrência';
  content: string;
  author: string;
}

export interface MovementRow {
  date: string;
  type: 'Entrada' | 'Saída' | 'Transferência' | 'Remanejamento';
  description: string;
  origin_dest: string;
}

export interface PerformanceRow {
  subject: string;
  g1?: string[]; // Unidades I, II, III
  average?: number;
  concept?: 'DI' | 'EP' | 'DB' | 'DE';
}

export interface RegistryStudent {
  id: string;
  enrollmentId?: string;
  inepId?: string;
  name: string;
  birthDate: string;
  gender?: 'M' | 'F' | 'Outro';
  colorRace?: string;
  nationality?: string;
  cpf: string;
  rg?: string;
  nis?: string;
  status: 'Matriculado' | 'Pendente' | 'Em Análise' | 'Transferido' | 'Abandono';
  school?: string;
  schoolId?: string;
  shift?: string;
  grade?: string;
  classId?: string;
  className?: string;
  specialNeeds?: boolean;
  specialNeedsType?: string;
  photo?: string;
  attendance?: {
    totalSchoolDays: number;
    presentDays: number;
    justifiedAbsences: number;
    unjustifiedAbsences: number;
  };
  performanceHistory?: PerformanceRow[];
  movementHistory?: MovementRow[];
  teacherNotes?: TeacherNote[];
  guardianName?: string;
  guardianContact?: string;
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zipCode: string;
    zone: 'Urbana' | 'Rural';
  };
  transportRequest?: boolean;
  lat: number;
  lng: number;
}

// Added missing ChatMessage interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

// Added missing ClassRoom interface
export interface ClassRoom {
  id: string;
  name: string;
  schoolId: string;
  teacherId?: string;
  grade?: string;
  shift?: string;
}

export interface RegistrationFormState {
  step: number;
  student: {
    fullName: string;
    birthDate: string;
    cpf: string;
    needsSpecialEducation: boolean;
    needsTransport: boolean;
    photo?: string;
  };
  guardian: {
    fullName: string;
    cpf: string;
    email: string;
    phone: string;
    relationship: string;
  };
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zipCode: string;
    residenceZone?: 'Urbana' | 'Rural';
  };
  selectedSchoolId: string | null;
}
