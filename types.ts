
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
  PUBLIC = 'Público'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  schoolId?: string; // Para Diretores e Professores
  email: string;
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

export interface RegistryStudent {
  id: string;
  enrollmentId?: string;
  name: string;
  birthDate: string;
  cpf: string;
  status: 'Matriculado' | 'Pendente' | 'Em Análise';
  school?: string;
  schoolId?: string;
  shift?: string;
  transportRequest?: boolean;
  transportType?: string;
  grade?: string;
  className?: string;
  classId?: string;
  specialNeeds?: boolean;
  medicalReport?: string;
  photo?: string;
  lat?: number;
  lng?: number;
  residenceZone?: 'Urbana' | 'Rural';
  guardianName?: string;
  guardianContact?: string;
  guardianCpf?: string;
  performanceHistory?: PerformanceRow[];
  movementHistory?: MovementRow[];
  performanceHeader?: PerformanceHeader;
  teacherNotes?: TeacherNote[];
  attendance?: AttendanceData;
}

export interface TeacherNote {
    id: string;
    date: string;
    type: 'Elogio' | 'Alerta' | 'Ocorrência' | 'Pedagógico';
    content: string;
    author: string;
}

export interface AttendanceData {
    totalSchoolDays: number;
    presentDays: number;
    justifiedAbsences: number;
    unjustifiedAbsences: number;
}

export interface PerformanceRow {
  subject: string;
  g1: string[];
  g2: string[];
  g3: string[];
  g4: string[];
  g5: string[];
}

export interface MovementRow {
  grade: string;
  initial: number;
  abandon: number | string;
  transfer: number;
  admitted: number;
  current: number;
}

export interface PerformanceHeader {
  unit: string;
  year: number;
  shift: string;
  director: string;
  coordinator: string;
  dateDay: string;
  dateMonth: string;
  dateYear: string;
}

export interface RegistrationFormState {
  step: number;
  student: {
    fullName: string;
    birthDate: string;
    cpf: string;
    needsSpecialEducation: boolean;
    specialEducationDetails?: string;
    medicalReport?: string;
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
    complement?: string;
    neighborhood: string;
    city: string;
    zipCode: string;
    lat?: number;
    lng?: number;
    residenceZone?: 'Urbana' | 'Rural';
  };
  selectedSchoolId: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}
