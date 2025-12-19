import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { useToast } from '../contexts/ToastContext';
import { 
  GraduationCap, Lock, User, ArrowRight, Loader2, ShieldCheck, 
  Globe, Sparkles, Fingerprint
} from 'lucide-react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      let role: UserRole | null = null;
      let userData = null;
      const cleanUser = username.toLowerCase().trim();

      if (cleanUser === 'sme' && password === '1234') {
        role = UserRole.ADMIN_SME;
        userData = { id: '1', name: 'Secretaria Executiva', role: UserRole.ADMIN_SME, email: 'sme@itaberaba.ba.gov.br' };
      } else if (cleanUser === 'diretor' && password === '1234') {
        role = UserRole.DIRECTOR;
        userData = { id: '2', name: 'Diretoria Maria Silva', role: UserRole.DIRECTOR, schoolId: '29383935', schoolName: 'CRECHE PARAISO DA CRIANCA' };
      } else if (cleanUser === 'professor' && password === '1234') {
        role = UserRole.TEACHER;
        userData = { id: '3', name: 'Prof. Ricardo Santos', role: UserRole.TEACHER, schoolId: '29383935' };
      } else if (cleanUser === 'aluno' && password === '1234') {
        role = UserRole.PARENT_STUDENT;
        userData = { id: '4', name: 'Família Leite', role: UserRole.PARENT_STUDENT, studentId: '207386980831' };
      }

      if (role && userData) {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('user_role', role);
        sessionStorage.setItem('user_data', JSON.stringify(userData));
        addToast(`Olá, ${userData.name}. Acesso autorizado.`, 'success');
        navigate(role === UserRole.PARENT_STUDENT ? `/student/monitoring?id=${userData.studentId}` : '/dashboard');
      } else {
        addToast('Credenciais não reconhecidas pela rede.', 'error');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Visual Side - Brand Identity */}
      <div className="hidden lg:flex lg:w-3/5 bg-slate-900 relative items-center justify-center p-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-blue-600/10"></div>
        <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-emerald-500/10 blur-[180px] rounded-full animate-pulse"></div>
        
        <div className="relative z-10 max-w-2xl space-y-12 fade-in-premium">
            <div className="flex items-center gap-6">
                <div className="bg-white p-5 rounded-[2rem] shadow-2xl rotate-3">
                    <GraduationCap className="h-12 w-12 text-slate-900" />
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter">Educa<span className="text-emerald-400">Município</span></h1>
            </div>

            <div className="space-y-6">
                <h2 className="text-8xl font-black text-white leading-[0.85] tracking-tighter">
                    Gestão <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Pública</span> <br/>de Elite.
                </h2>
                <p className="text-slate-400 text-2xl font-medium max-w-xl leading-relaxed">
                    Acesse o núcleo operacional da rede municipal para gerenciar indicadores pedagógicos e fluxos acadêmicos.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-10 pt-10">
                <div className="flex flex-col gap-5 p-8 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 group hover:bg-white/10 transition-all">
                    <div className="bg-emerald-600 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform"><Globe className="h-6 w-6 text-white" /></div>
                    <p className="text-white font-black text-xl tracking-tight">Rede Unificada</p>
                </div>
                <div className="flex flex-col gap-5 p-8 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 group hover:bg-white/10 transition-all">
                    <div className="bg-blue-600 p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform"><ShieldCheck className="h-6 w-6 text-white" /></div>
                    <p className="text-white font-black text-xl tracking-tight">Segurança SME</p>
                </div>
            </div>
        </div>
      </div>

      {/* Login Side */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-12 lg:p-24 bg-[#FCFDFE]">
        <div className="max-w-md w-full fade-in-premium" style={{animationDelay: '0.2s'}}>
          <div className="mb-16 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 rounded-full mb-8 border border-emerald-100">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Acesso Digital 2025</span>
            </div>
            <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none">Autenticação.</h3>
            <p className="text-slate-500 font-medium text-xl">Identifique-se para acessar seu painel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Protocolo de Usuário</label>
                <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="text" required value={username} onChange={e => setUsername(e.target.value)}
                        placeholder="Usuário SME"
                        className="w-full pl-16 pr-6 py-6 bg-white border border-slate-200 rounded-[2.2rem] outline-none focus:ring-8 focus:ring-emerald-50 focus:border-emerald-600 transition-all font-black text-slate-700 text-lg shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Chave de Segurança</label>
                <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                        type="password" required value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-16 pr-6 py-6 bg-white border border-slate-200 rounded-[2.2rem] outline-none focus:ring-8 focus:ring-emerald-50 focus:border-emerald-600 transition-all font-black text-slate-700 text-lg shadow-sm"
                    />
                </div>
            </div>

            <button 
                type="submit" disabled={isLoading}
                className="w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-6 shadow-2xl active:scale-95 disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Validar Credenciais <ArrowRight className="h-6 w-6" /></>}
            </button>
          </form>

          <div className="mt-16 flex items-center justify-between text-[10px] font-black uppercase tracking-widest px-4">
            <Link to="/registration" className="text-emerald-600 hover:text-emerald-800 transition underline underline-offset-8">Solicitar Vaga</Link>
            <Link to="/status" className="text-slate-400 hover:text-slate-600 transition">Esqueceu a senha?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};