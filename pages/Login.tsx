
import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { useToast } from '../contexts/ToastContext';
import { 
  GraduationCap, Lock, User, ArrowRight, Loader2, ShieldCheck, 
  Users, BookOpen, UserCircle, Globe 
} from 'lucide-react';
import { MUNICIPALITY_NAME } from '../constants';
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
        userData = { 
          id: '2', 
          name: 'Diretora Maria Silva', 
          role: UserRole.DIRECTOR, 
          schoolId: '29383935', 
          schoolName: 'CRECHE PARAISO DA CRIANCA',
          email: 'direcao.paraiso@itaberaba.ba.gov.br' 
        };
      } else if (cleanUser === 'professor' && password === '1234') {
        role = UserRole.TEACHER;
        userData = { 
          id: '3', 
          name: 'Prof. Ricardo Santos', 
          role: UserRole.TEACHER, 
          schoolId: '29383935', 
          schoolName: 'CRECHE PARAISO DA CRIANCA',
          className: 'GRUPO 3 C',
          email: 'ricardo.professor@itaberaba.ba.gov.br' 
        };
      } else if (cleanUser === 'aluno' && password === '1234') {
        role = UserRole.PARENT_STUDENT;
        userData = { 
          id: '4', 
          name: 'Família Leite', 
          role: UserRole.PARENT_STUDENT, 
          studentId: '207386980831',
          email: 'familia.leite@gmail.com' 
        };
      }

      if (role && userData) {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('user_role', role);
        sessionStorage.setItem('user_data', JSON.stringify(userData));
        addToast(`Olá, ${userData.name}. Acesso autorizado.`, 'success');
        
        if (role === UserRole.PARENT_STUDENT) {
            navigate(`/student/monitoring?id=${userData.studentId}`);
        } else {
            navigate('/dashboard');
        }
      } else {
        addToast('Credenciais inválidas. Tente novamente.', 'error');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-blue-600/10"></div>
        <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-indigo-500/10 blur-[150px] rounded-full"></div>
        
        <div className="relative z-10 max-w-lg space-y-12 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-[1.5rem] shadow-2xl">
                    <GraduationCap className="h-10 w-10 text-slate-900" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter">Educa<span className="text-indigo-400">Município</span></h1>
            </div>

            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                Um novo horizonte para a <span className="text-indigo-400">gestão escolar</span> pública.
            </h2>

            <div className="grid gap-6">
                <div className="flex items-start gap-4">
                    <div className="mt-1 bg-white/10 p-2 rounded-lg"><Globe className="h-5 w-5 text-indigo-300" /></div>
                    <div>
                        <p className="text-white font-bold text-lg">Ecossistema Conectado</p>
                        <p className="text-slate-400 text-sm">Integração nativa com Educacenso e sistemas MEC em tempo real.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="mt-1 bg-white/10 p-2 rounded-lg"><UserCircle className="h-5 w-5 text-indigo-300" /></div>
                    <div>
                        <p className="text-white font-bold text-lg">Portal Multifuncional</p>
                        <p className="text-slate-400 text-sm">Desde o diário do professor até o boletim da família em um só clique.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Login Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-slate-50">
        <div className="max-w-md w-full animate-in zoom-in-95 duration-500">
          <div className="mb-12 text-center lg:text-left">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Bem-vindo de volta</h3>
            <p className="text-slate-500 font-medium">Selecione seu perfil e insira suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identificação</label>
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="text"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Usuário ou CPF"
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-medium text-slate-700"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Senha de Acesso</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all font-medium text-slate-700"
                    />
                </div>
            </div>

            <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-200 disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Entrar no Sistema <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          <div className="mt-12 flex items-center justify-between text-xs font-black uppercase tracking-widest">
            <Link to="/registration" className="text-indigo-600 hover:text-indigo-800 transition">Nova Matrícula</Link>
            <Link to="/status" className="text-slate-400 hover:text-slate-600 transition">Problemas no Acesso?</Link>
          </div>

          <div className="mt-24 p-6 bg-white rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
             <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                <ShieldCheck className="h-5 w-5" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                Ambiente seguro • Secretaria Municipal de Educação <br/> de {MUNICIPALITY_NAME}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
