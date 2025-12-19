
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
    rg: '21.093.444-X',
    nis: '102.394.506.77',
    status: 'Matriculado', 
    school: 'CRECHE PARAISO DA CRIANCA', 
    className: 'GRUPO 3 C - INTEGRAL', 
    shift: 'Integral',
    grade: 'Grupo 3',
    guardianName: 'ADRIANA SANTOS LEITE',
    guardianContact: '(75) 99933-2211',
    guardianCpf: '003.444.555-66',
    address: {
        street: 'Rua das Flores',
        number: '12',
        neighborhood: 'Centro',
        city: 'Itaberaba',
        zipCode: '46880-000',
        zone: 'Urbana'
    },
    attendance: {
        totalSchoolDays: 200,
        presentDays: 185,
        justifiedAbsences: 5,
        unjustifiedAbsences: 10
    },
    performanceHistory: [
        { subject: 'LÍNGUA PORTUGUESA', g1: ['DE','DE','DB'], average: 9.5, concept: 'DE' },
        { subject: 'MATEMÁTICA', g1: ['DB','DE','DE'], average: 9.0, concept: 'DE' },
        { subject: 'CIÊNCIAS', g1: ['DE','DB','DB'], average: 8.5, concept: 'DB' },
        { subject: 'ARTES', g1: ['DE','DE','DE'], average: 10.0, concept: 'DE' }
    ],
    movementHistory: [
        { date: '2025-02-10', type: 'Entrada', description: 'Matrícula Inicial', origin_dest: 'Portal Online' },
        { date: '2025-05-15', type: 'Remanejamento', description: 'Mudança de Turma', origin_dest: 'SME Central' }
    ],
    teacherNotes: [
        { id: '1', date: '2025-03-20T14:00:00Z', type: 'Pedagógico', content: 'Aluno demonstra excelente coordenação motora e interação social.', author: 'Prof. Márcia Oliveira' }
    ],
    lat: -12.5253,
    lng: -40.2917,
    specialNeeds: false
  }
];

export const INITIAL_REGISTRATION_STATE: RegistrationFormState = {
  step: 1,
  student: { fullName: '', birthDate: '', cpf: '', needsSpecialEducation: false, needsTransport: false },
  guardian: { fullName: '', cpf: '', email: '', phone: '', relationship: 'Mãe' },
  address: { street: '', number: '', neighborhood: '', city: MUNICIPALITY_NAME, zipCode: '', residenceZone: 'Urbana' },
  selectedSchoolId: null
};
