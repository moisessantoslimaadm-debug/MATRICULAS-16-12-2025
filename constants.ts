
import { School, SchoolType, RegistryStudent, RegistrationFormState } from './types';

export const MUNICIPALITY_NAME = "Itaberaba";

// Dados reais extraídos do arquivo Censo Escolar 2025
export const MOCK_SCHOOLS: School[] = [
  {
    id: '29383935',
    inep: '29383935',
    name: 'CRECHE PARAISO DA CRIANCA',
    address: 'Urbana - Itaberaba - BA',
    types: [SchoolType.INFANTIL],
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577896334698-13c1eed48814?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80'
    ],
    rating: 5.0,
    availableSlots: 150, // Calculado dinamicamente baseado na lotação
    lat: -12.5253,
    lng: -40.2917,
    hasAEE: true // Escola possui atendimento especializado
  }
];

export const INITIAL_REGISTRATION_STATE: RegistrationFormState = {
  step: 1,
  student: {
    fullName: '',
    birthDate: '',
    cpf: '',
    needsSpecialEducation: false,
    specialEducationDetails: '',
    needsTransport: false
  },
  guardian: {
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    relationship: 'Mãe'
  },
  address: {
    street: '',
    number: '',
    neighborhood: '',
    city: MUNICIPALITY_NAME,
    zipCode: '',
    residenceZone: 'Urbana'
  },
  selectedSchoolId: null
};

// Lista de alunos enriquecida com campos de zona para o demo
export const MOCK_STUDENT_REGISTRY: RegistryStudent[] = [
  { 
    id: '207386980831', 
    name: 'CAIO DAVY LEITE', 
    birthDate: '03/01/2022', 
    cpf: '12722754509', 
    status: 'Matriculado', 
    school: 'CRECHE PARAISO DA CRIANCA', 
    className: 'GRUPO 3 C - INTEGRAL', 
    classId: '32183163', 
    enrollmentId: '742233981', 
    shift: 'Integral', 
    transportRequest: false,
    residenceZone: 'Urbana',
    teacherNotes: [
        { id: '1', date: new Date(Date.now() - 100000000).toISOString(), type: 'Elogio', content: 'Aluno demonstra excelente participação nas atividades lúdicas.', author: 'Prof. Ana' },
        { id: '2', date: new Date(Date.now() - 50000000).toISOString(), type: 'Alerta', content: 'Chegou atrasado 3 dias consecutivos.', author: 'Coordenação' }
    ],
    attendance: { totalSchoolDays: 200, presentDays: 190, justifiedAbsences: 5, unjustifiedAbsences: 5 },
    performanceHistory: [
        { subject: 'Linguagem', g1: ['8.0'], g2: ['8.5'], g3: ['9.0'], g4: ['8.5'], g5: ['9.0'] },
        { subject: 'Matemática', g1: ['7.0'], g2: ['7.5'], g3: ['8.0'], g4: ['8.0'], g5: ['8.5'] },
        { subject: 'Natureza', g1: ['9.0'], g2: ['9.0'], g3: ['9.5'], g4: ['9.0'], g5: ['9.5'] }
    ]
  },
  { 
    id: '213896024190', 
    name: 'HENRY DE OLIVEIRA GUIMARAES', 
    birthDate: '02/09/2021', 
    cpf: '59635629885', 
    status: 'Matriculado', 
    school: 'CRECHE PARAISO DA CRIANCA', 
    className: 'GRUPO 3 C - INTEGRAL', 
    classId: '32183163', 
    enrollmentId: '742284264', 
    shift: 'Integral', 
    transportRequest: true,
    residenceZone: 'Rural',
    teacherNotes: [
        { id: '3', date: new Date(Date.now() - 200000000).toISOString(), type: 'Ocorrência', content: 'Agressão física a colega durante o intervalo.', author: 'Direção' },
        { id: '4', date: new Date(Date.now() - 100000000).toISOString(), type: 'Alerta', content: 'Família convocada para reunião e não compareceu.', author: 'Coordenação' },
        { id: '5', date: new Date(Date.now() - 5000000).toISOString(), type: 'Ocorrência', content: 'Trouxe brinquedo não permitido e recusou-se a guardar.', author: 'Prof. Carla' }
    ],
    attendance: { totalSchoolDays: 200, presentDays: 160, justifiedAbsences: 10, unjustifiedAbsences: 30 }
  },
  { id: '218590841500', name: 'MARIELE CARDOSO DA SILVA', birthDate: '19/04/2022', cpf: '12876265567', status: 'Matriculado', school: 'CRECHE PARAISO DA CRIANCA', className: 'GRUPO 2 A - INTEGRAL', classId: '32177066', enrollmentId: '745770844', shift: 'Integral', transportRequest: false, residenceZone: 'Urbana' },
  { id: '219590312100', name: 'ARTHUR FELIPPE COSTA AMORIM', birthDate: '03/07/2021', cpf: '12500277569', status: 'Matriculado', school: 'CRECHE PARAISO DA CRIANCA', className: 'GRUPO 3 C - INTEGRAL', classId: '32183163', enrollmentId: '742229218', shift: 'Integral', transportRequest: false, residenceZone: 'Urbana' },
  { id: '229230253187', name: 'LEVI GABRIEL PASSOS NEVES', birthDate: '10/03/2023', cpf: '60863995810', status: 'Matriculado', school: 'CRECHE PARAISO DA CRIANCA', className: 'GRUPO 2 A - INTEGRAL', classId: '32177066', enrollmentId: '745244899', shift: 'Integral', transportRequest: true, residenceZone: 'Rural' },
  { id: '230044745492', name: 'MARIA VALLENTINA SANTOS', birthDate: '21/02/2022', cpf: '12806428580', status: 'Matriculado', school: 'CRECHE PARAISO DA CRIANCA', className: 'GRUPO 3 C - INTEGRAL', classId: '32183163', enrollmentId: '742301770', shift: 'Integral', transportRequest: false, residenceZone: 'Urbana' },
  { id: '241959830706', name: 'YSIS HELLOA DE OLIVEIRA DOS SANTOS', birthDate: '22/07/2022', cpf: '13049987545', status: 'Matriculado', school: 'CRECHE PARAISO DA CRIANCA', className: 'GRUPO 2 B - INTEGRAL', classId: '32182141', enrollmentId: '745944585', shift: 'Integral', transportRequest: false, residenceZone: 'Urbana' }
];