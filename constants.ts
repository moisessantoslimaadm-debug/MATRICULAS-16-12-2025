import { School, SchoolType, RegistryStudent, RegistrationFormState } from './types';

export const MUNICIPALITY_NAME = "Itaberaba";

export const MOCK_SCHOOLS: School[] = [
  {
    id: '29383935',
    inep: '29383935',
    name: 'CRECHE PARAISO DA CRIANCA',
    address: 'Av. Rio Branco, 450 - Centro, Itaberaba - BA',
    types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80',
    rating: 5.0,
    availableSlots: 150,
    lat: -12.5253,
    lng: -40.2917,
    hasAEE: true 
  },
  {
    id: '29383940',
    name: 'ESCOLA MUNICIPAL JOÃO XXIII',
    address: 'Rua São José, 12 - Primavera, Itaberaba - BA',
    types: [SchoolType.FUNDAMENTAL_1, SchoolType.FUNDAMENTAL_2],
    image: 'https://images.unsplash.com/photo-1577896851231-70ef1460370e?auto=format&fit=crop&q=80',
    rating: 4.8,
    availableSlots: 450,
    lat: -12.5280,
    lng: -40.3020,
    hasAEE: true
  }
];

export const MOCK_STUDENT_REGISTRY: RegistryStudent[] = [
  { 
    id: '207386980831',
    enrollmentId: '2025.001.094',
    inepId: '1239840293',
    name: 'CAIO DAVY LEITE', 
    birthDate: '2022-01-03', 
    gender: 'M',
    colorRace: 'Parda',
    nationality: 'Brasileira',
    cpf: '127.227.545-09', 
    status: 'Matriculado', 
    school: 'CRECHE PARAISO DA CRIANCA', 
    className: 'GRUPO 3 C - INTEGRAL', 
    shift: 'Integral',
    grade: 'Grupo 3',
    address: { street: 'Rua das Flores', number: '12', neighborhood: 'Centro', city: 'Itaberaba', zipCode: '46880-000', zone: 'Urbana' },
    attendance: { totalSchoolDays: 200, presentDays: 185, justifiedAbsences: 5, unjustifiedAbsences: 10 },
    performanceHistory: [{ subject: 'LÍNGUA PORTUGUESA', g1: ['DE','DE','DB'], average: 9.5, concept: 'DE' }],
    movementHistory: [{ date: '2025-02-10', type: 'Entrada', description: 'Matrícula Inicial', origin_dest: 'Portal Online' }],
    lat: -12.5253,
    lng: -40.2917,
    specialNeeds: false
  },
  { 
    id: '207386980832',
    enrollmentId: '2025.001.095',
    name: 'MARIA EDUARDA SILVA', 
    birthDate: '2021-05-15', 
    cpf: '127.227.000-00', 
    status: 'Matriculado', 
    school: 'CRECHE PARAISO DA CRIANCA', 
    lat: -12.5265,
    lng: -40.2930,
    specialNeeds: true
  },
  { 
    id: '207386980833',
    name: 'JOAO PEDRO SANTOS', 
    birthDate: '2020-08-20', 
    cpf: '127.227.111-11', 
    status: 'Pendente', 
    lat: -12.5290,
    lng: -40.2980,
    specialNeeds: false
  },
  { 
    id: '207386980834',
    name: 'ANA BEATRIZ OLIVEIRA', 
    birthDate: '2019-12-10', 
    cpf: '127.227.222-22', 
    status: 'Matriculado', 
    school: 'ESCOLA MUNICIPAL JOÃO XXIII',
    lat: -12.5240,
    lng: -40.3050,
    specialNeeds: false
  },
  { 
    id: '207386980835',
    name: 'LUCAS GOMES FERREIRA', 
    birthDate: '2022-03-03', 
    cpf: '127.227.333-33', 
    status: 'Em Análise', 
    lat: -12.5285,
    lng: -40.2905,
    specialNeeds: false
  },
  { 
    id: '207386980836',
    name: 'BEATRIZ SOUZA', 
    birthDate: '2021-01-22', 
    cpf: '127.227.444-44', 
    status: 'Matriculado', 
    school: 'ESCOLA MUNICIPAL JOÃO XXIII',
    lat: -12.5310,
    lng: -40.3015,
    specialNeeds: true
  }
];

export const INITIAL_REGISTRATION_STATE: RegistrationFormState = {
  step: 1,
  student: { fullName: '', birthDate: '', cpf: '', needsSpecialEducation: false, needsTransport: false },
  guardian: { fullName: '', cpf: '', email: '', phone: '', relationship: 'Mãe' },
  address: { street: '', number: '', neighborhood: '', city: MUNICIPALITY_NAME, zipCode: '', residenceZone: 'Urbana' },
  selectedSchoolId: null
};