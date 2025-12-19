import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { useToast } from '../contexts/ToastContext';
import { 
  GraduationCap, Lock, User, ArrowRight, Loader2, ShieldCheck, 
  Globe, Sparkles, LogIn
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
        userData = { id: '1', name: 'Gestão SME Itaberaba', role: UserRole.ADMIN_SME, email: 'sme@itaberaba.ba.gov.br' };
      } else if (cleanUser === 'diretor' && password === '1234') {
        role = UserRole.DIRECTOR;
        userData = { id: '2', name: 'Diretoria Escolar', role: UserRole.DIRECTOR, schoolId: '29383935' };
      }

      if (role && userData) {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('user_role', role);
        sessionStorage.setItem('user_data', JSON.stringify(userData));
        addToast(`Acesso autorizado. Bem-vindo ao portal SME.`, 'success');
        navigate('/dashboard');
      } else {
        addToast('Credenciais inválidas. Tente novamente.', 'error');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 page-transition items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col md:flex-row">
        {/* Lado Informativo */}
        <div className="md:w-1/2 bg-[#0F172A] p-12 text-white relative flex flex-col justify-between overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                    <div className="bg-blue-600 p-2.5 rounded-lg shadow-lg">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <span className="font-black text-xl tracking-tight uppercase">SME <span className="text-blue-500">Digital</span></span>
                </div>
                <h2 className="text-4xl font-black mb-6 leading-tight tracking-tight uppercase">Gestão Municipal <br/><span className="text-blue-500">de Excelência.</span></h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-10">Acesse o núcleo operacional para gerenciar o censo escolar, demanda demográfica e indicadores pedagógicos.</p>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" /> Acesso Seguro SSL/TLS
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                        <Globe className="h-4 w-4 text-blue-500" /> Sincronização INEP
                    </div>
                </div>
            </div>
            
            <div className="relative z-10 pt-10 border-t border-slate-800 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                Prefeitura Municipal de Itaberaba • BA
            </div>
            <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        {/* Lado Login */}
        <div className="md:w-1/2 p-12 bg-white flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-2">Autenticação.</h3>
            <p className="text-slate-500 text-xs font-medium">Informe suas credenciais de rede para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Usuário de Rede</label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="text" required value={username} onChange={e => setUsername(e.target.value)}
                        placeholder="Ex: gestao_sme"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 ml-1">Senha Privativa</label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="password" required value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700 text-sm"
                    />
                </div>
            </div>

            <button 
                type="submit" disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Acessar Sistema <LogIn className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="mt-12 flex items-center justify-between text-[9px] font-bold uppercase text-slate-400 tracking-widest">
            <Link to="/registration" className="hover:text-blue-600">Esqueci meu acesso</Link>
            <Link to="/status" className="hover:text-blue-600">Página Pública</Link>
          </div>
        </div>
      </div>
    </div>
  );
};