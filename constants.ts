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

// Gerador de dados para o Mapa de Calor
const generateMockStudents = (count: number): RegistryStudent[] => {
  const bairros = [
    { name: 'Centro', lat: -12.5253, lng: -40.2917 },
    { name: 'Primavera', lat: -12.5280, lng: -40.3020 },
    { name: 'Barro Vermelho', lat: -12.5320, lng: -40.2850 },
    { name: 'Jardim das Palmeiras', lat: -12.5180, lng: -40.3100 },
    { name: 'Caititu', lat: -12.5400, lng: -40.2950 }
  ];

  return Array.from({ length: count }).map((_, i) => {
    const bairro = bairros[i % bairros.length];
    // Adiciona um pequeno desvio para não ficarem no mesmo ponto
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;

    return {
      id: `std-${i}`,
      name: `ALUNO EXEMPLO ${i + 1}`,
      birthDate: '2015-05-10',
      cpf: `000.000.000-${i % 99}`,
      status: 'Matriculado',
      school: i % 2 === 0 ? 'CRECHE PARAISO DA CRIANCA' : 'ESCOLA MUNICIPAL JOÃO XXIII',
      lat: bairro.lat + latOffset,
      lng: bairro.lng + lngOffset,
      address: {
        street: `Rua Projetada ${i}`,
        number: `${Math.floor(Math.random() * 500)}`,
        neighborhood: bairro.name,
        city: 'Itaberaba',
        zipCode: '46880-000',
        zone: 'Urbana'
      }
    };
  });
};

export const MOCK_STUDENT_REGISTRY: RegistryStudent[] = generateMockStudents(60);

export const INITIAL_REGISTRATION_STATE: RegistrationFormState = {
  step: 1,
  student: { fullName: '', birthDate: '', cpf: '', needsSpecialEducation: false, needsTransport: false },
  guardian: { fullName: '', cpf: '', email: '', phone: '', relationship: 'Mãe' },
  address: { street: '', number: '', neighborhood: '', city: MUNICIPALITY_NAME, zipCode: '', residenceZone: 'Urbana' },
  selectedSchoolId: null
};