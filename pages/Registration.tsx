
import React, { useState, useRef } from 'react';
import { INITIAL_REGISTRATION_STATE } from '../constants';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { RegistrationFormState, RegistryStudent } from '../types';
import { 
  Check, ArrowLeft, Loader2, User, 
  Camera, Zap, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useNavigate } from '../router';

const formatCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);

export const Registration: React.FC = () => {
  const { addStudent } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<RegistrationFormState>(INITIAL_REGISTRATION_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (section: 'student' | 'guardian' | 'address', field: string, value: any) => {
    let finalValue = value;
    if (field === 'cpf') finalValue = formatCPF(value);
    setFormState(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: finalValue }
    }));
  };

  const nextStep = () => {
    if (formState.step === 1 && (!formState.student.fullName || !formState.student.birthDate)) {
        addToast("Dados do aluno são obrigatórios.", "warning"); return;
    }
    setFormState(prev => ({ ...prev, step: prev.step + 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Added lat and lng to comply with RegistryStudent interface
    const newStudent: RegistryStudent = {
        id: Date.now().toString(),
        name: formState.student.fullName.toUpperCase(),
        birthDate: formState.student.birthDate,
        cpf: formState.student.cpf || '',
        status: 'Em Análise',
        school: 'Aguardando Alocação',
        enrollmentId: `PROT-${Math.floor(Math.random() * 900000) + 100000}`,
        photo: formState.student.photo,
        lat: -12.5253,
        lng: -40.2917
    };

    try {
        await addStudent(newStudent);
        addToast('Registro nominal transmitido com sucesso.', 'success');
        navigate('/status?success=true');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-24 px-6 fade-in-premium page-transition">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 rounded-full border border-emerald-100 mb-4">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Rede Municipal de Ensino</span>
            </div>
            <h1 className="text-8xl font-black text-slate-900 tracking-tighter leading-none mb-6">Ficha <br/><span className="text-emerald-600">Nominal.</span></h1>
            <p className="text-slate-500 font-medium text-2xl tracking-tight">Censo eletrônico para reserva de vaga escolar.</p>
        </header>

        <div className="bg-white rounded-[4.5rem] shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-slate-100">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(formState.step / 4) * 100}%` }}></div>
          </div>

          <div className="p-16 lg:p-20">
            <div className="flex justify-between mb-24 relative">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className="flex flex-col items-center gap-6 relative z-10">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black text-2xl transition-all duration-700 ${formState.step >= s ? 'bg-slate-900 text-emerald-400 shadow-2xl shadow-slate-200' : 'bg-slate-50 text-slate-300'}`}>
                            {formState.step > s ? <Check className="h-8 w-8" /> : s}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${formState.step >= s ? 'text-slate-900' : 'text-slate-300'}`}>
                            {['Dados', 'Responsável', 'Endereço', 'Alocação'][s-1]}
                        </span>
                    </div>
                ))}
                <div className="absolute top-8 left-0 right-0 h-px bg-slate-100 -z-10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {formState.step === 1 && (
                    <div className="space-y-12 fade-in-premium">
                        <div className="flex flex-col items-center">
                            <div className="w-44 h-44 rounded-[3.5rem] bg-slate-50 border-[6px] border-white shadow-2xl flex items-center justify-center overflow-hidden group relative cursor-pointer active:scale-95 transition-transform">
                                {formState.student.photo ? <img src={formState.student.photo} className="w-full h-full object-cover" /> : <User className="h-16 w-16 text-slate-200" />}
                                <label className="absolute inset-0 bg-emerald-600/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-10 w-10" />
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
                            <p className="mt-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Captura Biométrica Nominal</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="md:col-span-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-ultra mb-4 ml-4 block">Nome Completo do Aluno</label>
                                <input type="text" required value={formState.student.fullName} onChange={e => handleInputChange('student', 'fullName', e.target.value)} className="input-premium" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-ultra mb-4 ml-4 block">Data de Nascimento</label>
                                <input type="date" required value={formState.student.birthDate} onChange={e => handleInputChange('student', 'birthDate', e.target.value)} className="input-premium" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-ultra mb-4 ml-4 block">CPF (Opcional)</label>
                                <input type="text" value={formState.student.cpf} onChange={e => handleInputChange('student', 'cpf', e.target.value)} className="input-premium" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Simplified subsequent steps for design preview */}
                {formState.step > 1 && formState.step < 4 && (
                    <div className="py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-4xl font-black text-slate-800 mb-6 uppercase tracking-tight">Etapa {formState.step} em Construção</h2>
                        <p className="text-slate-400 font-medium">Esta interface faz parte do fluxo nominal completo.</p>
                    </div>
                )}

                <div className="flex justify-between pt-16 border-t border-slate-50">
                    <button type="button" onClick={() => setFormState(p => ({...p, step: Math.max(1, p.step-1)}))} disabled={formState.step === 1} className="px-12 py-7 bg-white border border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-ultra rounded-[2.5rem] hover:text-slate-600 transition disabled:opacity-0 active:scale-95">Voltar</button>
                    {formState.step < 4 ? (
                        <button type="button" onClick={nextStep} className="px-16 py-7 bg-slate-900 text-white font-black text-[11px] uppercase tracking-ultra rounded-[2.5rem] hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 flex items-center gap-8 active:scale-95">Continuar <ArrowRight className="h-5 w-5" /></button>
                    ) : (
                        <button type="submit" disabled={isSubmitting} className="px-16 py-7 bg-emerald-600 text-white font-black text-[11px] uppercase tracking-ultra rounded-[2.5rem] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 flex items-center gap-8 active:scale-95">
                            {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6" />}
                            Transmitir Registro
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
