
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
    gallery: [
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80'
    ],
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

// Gerador de pontos próximos para o Heatmap (Simulação de demanda real)
const generatePoints = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        lat: -12.5253 + (Math.random() - 0.5) * 0.04,
        lng: -40.2917 + (Math.random() - 0.5) * 0.04
    }));
};

const points = generatePoints(50);

export const MOCK_STUDENT_REGISTRY: RegistryStudent[] = [
  { 
    id: '207386980831', 
    name: 'CAIO DAVY LEITE', 
    birthDate: '03/01/2022', 
    cpf: '12722754509', 
    status: 'Matriculado', 
    school: 'CRECHE PARAISO DA CRIANCA', 
    className: 'GRUPO 3 C - INTEGRAL', 
    shift: 'Integral', 
    residenceZone: 'Urbana',
    lat: points[0].lat,
    lng: points[0].lng,
    performanceHistory: [
        { subject: 'DESENVOLVIMENTO', g1: ['DE','DE','DB'], g2: ['DE','DE','DE'], g3: ['DE','DE'] }
    ]
  },
  { 
    id: '230565943594', 
    name: 'ARTHUR SANTOS BORGES', 
    birthDate: '03/04/2021', 
    cpf: '12449554505', 
    status: 'Matriculado', 
    school: 'CRECHE PARAISO DA CRIANCA', 
    className: 'GRUPO 3 A - INTEGRAL', 
    shift: 'Integral', 
    specialNeeds: true,
    medicalReport: 'TEA',
    residenceZone: 'Urbana',
    lat: points[1].lat,
    lng: points[1].lng
  },
  { 
    id: '229230253187', 
    name: 'LEVI GABRIEL PASSOS NEVES', 
    birthDate: '10/03/2023', 
    // Fix: Added missing required property 'cpf'
    cpf: '000.000.000-00',
    status: 'Pendente', 
    school: 'Não alocada', 
    transportRequest: true, 
    residenceZone: 'Rural',
    lat: points[2].lat,
    lng: points[2].lng
  },
  // Mais registros para o Heatmap
  ...Array.from({ length: 40 }).map((_, i) => ({
      id: `sim-${i}`,
      name: `ALUNO SIMULADO ${i + 1}`,
      birthDate: '01/01/2020',
      cpf: `000.000.000-${i}`,
      status: i % 3 === 0 ? 'Pendente' : 'Matriculado' as any,
      school: i % 3 === 0 ? 'Não alocada' : 'CRECHE PARAISO DA CRIANCA',
      lat: points[i + 3].lat,
      lng: points[i + 3].lng,
      residenceZone: i % 5 === 0 ? 'Rural' : 'Urbana' as any,
      specialNeeds: i % 8 === 0
  }))
];

export const INITIAL_REGISTRATION_STATE: RegistrationFormState = {
  step: 1,
  student: { fullName: '', birthDate: '', cpf: '', needsSpecialEducation: false, needsTransport: false },
  guardian: { fullName: '', cpf: '', email: '', phone: '', relationship: 'Mãe' },
  address: { street: '', number: '', neighborhood: '', city: MUNICIPALITY_NAME, zipCode: '', residenceZone: 'Urbana' },
  selectedSchoolId: null
};
