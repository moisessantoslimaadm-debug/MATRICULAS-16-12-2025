
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
  schoolId?: string;
  email: string;
  photo?: string;
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

export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  shift: 'Matutino' | 'Vespertino' | 'Integral' | 'Noturno';
  schoolId: string;
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
  capacity: number;
}

export interface TeacherNote {
  id: string;
  date: string;
  type: 'Pedagógico' | 'Elogio' | 'Alerta' | 'Ocorrência';
  content: string;
  author: string;
}

// Added missing interface for chat assistant messages
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

// Added missing interface for enrollment movement indicators
export interface MovementRow {
  grade: string;
  initial: number;
  abandon: string | number;
  transfer: number;
  admitted: number;
  current: number;
}

// Added missing interface for official performance headers
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

// Updated PerformanceRow to support both simple unit-based grades and detailed indicator groups used in performance reports
export interface PerformanceRow {
  subject: string;
  unit1?: number | string;
  unit2?: number | string;
  unit3?: number | string;
  average?: number;
  concept?: 'DI' | 'EP' | 'DB' | 'DE';
  g1?: string[];
  g2?: string[];
  g3?: string[];
  g4?: string[];
  g5?: string[];
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
  grade?: string;
  classId?: string;
  className?: string;
  specialNeeds?: boolean;
  medicalReport?: string; // URL para PDF/Imagem
  documents?: {
    rgAlu?: string;
    rgResp?: string;
    compRes?: string;
    vacina?: string;
  };
  photo?: string;
  attendance?: AttendanceData;
  performanceHistory?: PerformanceRow[];
  teacherNotes?: TeacherNote[];
  guardianName?: string;
  guardianContact?: string;
  guardianCpf?: string;
  // Added missing fields used in constants, registration, and management pages
  transportRequest?: boolean;
  residenceZone?: 'Urbana' | 'Rural';
  transportType?: string;
  lat?: number;
  lng?: number;
  movementHistory?: MovementRow[];
  performanceHeader?: PerformanceHeader;
}

export interface AttendanceData {
  totalSchoolDays: number;
  presentDays: number;
  justifiedAbsences: number;
  unjustifiedAbsences: number;
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
    neighborhood: string;
    city: string;
    zipCode: string;
    lat?: number;
    lng?: number;
    residenceZone?: 'Urbana' | 'Rural';
  };
  selectedSchoolId: string | null;
}
