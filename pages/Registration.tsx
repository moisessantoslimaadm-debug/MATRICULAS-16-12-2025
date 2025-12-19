import React, { useState, useMemo, useEffect, useRef } from 'react';
import { INITIAL_REGISTRATION_STATE } from '../constants';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { RegistrationFormState, RegistryStudent } from '../types';
// Fix: Added ArrowRight to the imports from lucide-react
import { Check, ChevronRight, ChevronLeft, Upload, School as SchoolIcon, Bus, FileText, ListChecks, MapPin, Navigation, AlertCircle, Loader2, Search, RefreshCw, Crosshair, AlertTriangle, Move, Trash2, Paperclip, Home, Camera, User, X, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from '../router';

declare const L: any;

const formatCPF = (value: string) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
const formatPhone = (value: string) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
const formatCEP = (value: string) => value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').substring(0, 9);

export const Registration: React.FC = () => {
  const { schools, addStudent } = useData();
  const { addToast } = useToast();
  const [formState, setFormState] = useState<RegistrationFormState>(INITIAL_REGISTRATION_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (section: 'student' | 'guardian' | 'address', field: string, value: any) => {
    let finalValue = value;
    if (field === 'cpf') finalValue = formatCPF(value);
    if (field === 'phone') finalValue = formatPhone(value);
    if (field === 'zipCode') finalValue = formatCEP(value);

    setFormState(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: finalValue }
    }));
  };

  const nextStep = () => {
    if (formState.step === 1 && (!formState.student.fullName || !formState.student.birthDate)) {
        addToast("Identificação do aluno é mandatória.", "warning"); return;
    }
    if (formState.step === 2 && (!formState.guardian.fullName || !formState.guardian.cpf)) {
        addToast("Dados do responsável incompletos.", "warning"); return;
    }
    setFormState(prev => ({ ...prev, step: prev.step + 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const selectedSchool = schools.find(s => s.id === formState.selectedSchoolId);
    
    const newStudent: RegistryStudent = {
        id: Date.now().toString(),
        name: formState.student.fullName.toUpperCase(),
        birthDate: formState.student.birthDate.split('-').reverse().join('/'), 
        cpf: formState.student.cpf || '',
        status: 'Em Análise',
        school: selectedSchool ? selectedSchool.name : 'Não alocada',
        transportRequest: formState.student.needsTransport,
        specialNeeds: formState.student.needsSpecialEducation,
        photo: formState.student.photo,
        enrollmentId: `PROT-${Math.floor(Math.random() * 100000)}`,
        lat: formState.address.lat, 
        lng: formState.address.lng
    };

    try {
        await addStudent(newStudent);
        addToast('Protocolo gerado com sucesso!', 'success');
        navigate('/status?success=true');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-20">
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6">Ficha <br/><span className="text-emerald-600">Nominal.</span></h1>
            <p className="text-slate-500 font-medium text-2xl tracking-tight">Registro oficial na rede pública de ensino.</p>
        </header>

        <div className="bg-white rounded-[4.5rem] shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-slate-100">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(formState.step / 4) * 100}%` }}></div>
          </div>

          <div className="p-16">
            <div className="flex justify-between mb-20">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className="flex flex-col items-center gap-5 group">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-700 ${formState.step >= s ? 'bg-slate-900 text-emerald-400 shadow-xl' : 'bg-slate-50 text-slate-300'}`}>
                            {formState.step > s ? <Check className="h-7 w-7" /> : s}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${formState.step >= s ? 'text-slate-900' : 'text-slate-300'}`}>
                            {['Aluno', 'Responsável', 'Endereço', 'Alocação'][s-1]}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {formState.step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-12 duration-700 space-y-10">
                        <div className="flex flex-col items-center">
                            <div className="w-40 h-40 rounded-[3rem] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden group relative cursor-pointer active:scale-95 transition-transform">
                                {formState.student.photo ? <img src={formState.student.photo} className="w-full h-full object-cover" /> : <User className="h-14 w-14 text-slate-200" />}
                                <label className="absolute inset-0 bg-emerald-600/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-8 w-8" />
                                    <input type="file" ref={photoInputRef} accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => handleInputChange('student', 'photo', reader.result);
                                            reader.readAsDataURL(file);
                                        }
                                    }} />
                                </label>
                            </div>
                            <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação Biométrica</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="md:col-span-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-ultra ml-2 mb-4 block">Nome Completo do Aluno</label>
                                <input type="text" required value={formState.student.fullName} onChange={e => handleInputChange('student', 'fullName', e.target.value)} className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.2rem] focus:ring-8 focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-black text-slate-700 text-xl" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-ultra ml-2 mb-4 block">Data de Nascimento</label>
                                <input type="date" required value={formState.student.birthDate} onChange={e => handleInputChange('student', 'birthDate', e.target.value)} className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.2rem] focus:ring-8 focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-black text-slate-700 text-xl" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-ultra ml-2 mb-4 block">CPF (Opcional)</label>
                                <input type="text" value={formState.student.cpf} onChange={e => handleInputChange('student', 'cpf', e.target.value)} className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.2rem] focus:ring-8 focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-black text-slate-700 text-xl" />
                            </div>
                        </div>
                    </div>
                )}

                {formState.step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-12 duration-700 space-y-10">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="md:col-span-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-ultra ml-2 mb-4 block">Nome Completo do Responsável</label>
                                <input type="text" required value={formState.guardian.fullName} onChange={e => handleInputChange('guardian', 'fullName', e.target.value)} className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.2rem] focus:ring-8 focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-black text-slate-700 text-xl" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-ultra ml-2 mb-4 block">CPF do Responsável</label>
                                <input type="text" required value={formState.guardian.cpf} onChange={e => handleInputChange('guardian', 'cpf', e.target.value)} className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.2rem] focus:ring-8 focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-black text-slate-700 text-xl" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-ultra ml-2 mb-4 block">WhatsApp / Contato</label>
                                <input type="text" required value={formState.guardian.phone} onChange={e => handleInputChange('guardian', 'phone', e.target.value)} className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2.2rem] focus:ring-8 focus:ring-emerald-50 focus:border-emerald-600 outline-none transition-all font-black text-slate-700 text-xl" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-16 border-t border-slate-50">
                    <button type="button" onClick={() => setFormState(p => ({...p, step: Math.max(1, p.step-1)}))} disabled={formState.step === 1} className="px-12 py-6 bg-white border border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-ultra rounded-[2.2rem] hover:text-slate-600 transition disabled:opacity-0 active:scale-95">Voltar Etapa</button>
                    {formState.step < 4 ? (
                        <button type="button" onClick={nextStep} className="px-16 py-6 bg-slate-900 text-white font-black text-[11px] uppercase tracking-ultra rounded-[2.2rem] hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 flex items-center gap-6 active:scale-95">Continuar <ArrowRight className="h-5 w-5" /></button>
                    ) : (
                        <button type="submit" disabled={isSubmitting} className="px-16 py-6 bg-emerald-600 text-white font-black text-[11px] uppercase tracking-ultra rounded-[2.2rem] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 flex items-center gap-6 active:scale-95">
                            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
                            Efetivar Registro
                        </button>
                    )}
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};