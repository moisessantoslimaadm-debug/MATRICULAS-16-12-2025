
import React, { useState } from 'react';
import { useNavigate, Link } from '../router';
import { useToast } from '../contexts/ToastContext';
import { GraduationCap, Lock, User, ArrowRight, Loader2, ShieldCheck, FileText, Search, School, LayoutGrid, Users, BookOpen } from 'lucide-react';
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

      // Mock de autenticação por perfil
      if (username === 'sme' && password === '1234') {
        role = UserRole.ADMIN_SME;
        userData = { id: '1', name: 'Gestor SME', role: UserRole.ADMIN_SME, email: 'sme@municipio.gov.br' };
      } else if (username === 'diretor' && password === '1234') {
        role = UserRole.DIRECTOR;
        userData = { id: '2', name: 'Diretor Silva', role: UserRole.DIRECTOR, schoolId: '29383935', email: 'direcao@escola.gov.br' };
      } else if (username === 'professor' && password === '1234') {
        role = UserRole.TEACHER;
        userData = { id: '3', name: 'Prof. Ana', role: UserRole.TEACHER, schoolId: '29383935', email: 'ana@educacao.gov.br' };
      }

      if (role && userData) {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('user_role', role);
        sessionStorage.setItem('user_data', JSON.stringify(userData));
        
        addToast(`Bem-vindo, ${userData.name}!`, 'success');
        navigate('/dashboard'); 
      } else {
        addToast('Credenciais inválidas. Tente: sme/1234, diretor/1234 ou professor/1234', 'error');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 opacity-90"></div>
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        
        <div className="text-white space-y-6 md:pr-8 animate-in slide-in-from-left-8 duration-700 hidden md:block">
            <div>
                <h1 className="text-4xl font-bold mb-2">Portal da Educação</h1>
                <p className="text-blue-100 text-lg">Plataforma oficial de gestão escolar de {MUNICIPALITY_NAME}.</p>
            </div>
            
            <div className="grid gap-3">
                <Link to="/registration" className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-xl flex items-center gap-4 transition group backdrop-blur-sm shadow-lg">
                    <div className="bg-green-500/20 p-3 rounded-lg text-green-300 transition border border-green-500/30">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div><h3 className="font-bold text-lg">Realizar Matrícula</h3><p className="text-sm text-blue-100 opacity-80">Solicite vaga para novos alunos</p></div>
                    <ArrowRight className="h-5 w-5 ml-auto text-white/50 group-hover:translate-x-1 transition" />
                </Link>

                <Link to="/status" className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-xl flex items-center gap-4 transition group backdrop-blur-sm shadow-lg">
                    <div className="bg-blue-500/20 p-3 rounded-lg text-blue-300 transition border border-blue-500/30">
                        <Search className="h-6 w-6" />
                    </div>
                    <div><h3 className="font-bold text-lg">Consultar Protocolo</h3><p className="text-sm text-blue-100 opacity-80">Verifique o status da solicitação</p></div>
                    <ArrowRight className="h-5 w-5 ml-auto text-white/50 group-hover:translate-x-1 transition" />
                </Link>
            </div>
            
            <div className="bg-blue-800/40 p-4 rounded-2xl border border-blue-400/20 backdrop-blur-sm">
                <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-3">Dicas de Acesso para Teste</p>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-blue-100">
                    <div className="bg-white/5 p-2 rounded">SME: sme / 1234</div>
                    <div className="bg-white/5 p-2 rounded">DIRETOR: diretor / 1234</div>
                    <div className="bg-white/5 p-2 rounded">PROF: professor / 1234</div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Acesso Restrito</h2>
            <p className="text-sm text-slate-500 mt-2">Profissionais da Rede Municipal</p>
          </div>

          <div className="p-8 pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Usuário</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="Usuário ou CPF"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Entrar no Sistema <ArrowRight className="h-5 w-5" /></>}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="h-3 w-3" />
            <span>Criptografia de ponta a ponta ativa</span>
          </div>
        </div>
      </div>
    </div>
  );
};
