
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from '../router';
import { GraduationCap, Menu, X, Database, CloudCheck, CloudOff, BarChart3, TrendingUp, User, LogOut, BookOpen, LayoutDashboard } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isOffline, refreshData } = useData();
  
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedRole = sessionStorage.getItem('user_role') as UserRole;
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    setRole(savedRole);
    setUserName(userData.name || '');
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-600';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg"><GraduationCap className="h-6 w-6 text-white" /></div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">Educa<span className="text-blue-600">Município</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {/* Links para SME e Diretor */}
            {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) && (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                <Link to="/schools" className={isActive('/schools')}>Escolas</Link>
                <Link to="/admin/data" className={isActive('/admin/data')}>Gestão</Link>
                <Link to="/reports" className={`${isActive('/reports')} flex items-center gap-1.5`}><BarChart3 className="h-4 w-4" /> Relatórios</Link>
              </>
            )}

            {/* Links exclusivos do Professor */}
            {role === UserRole.TEACHER && (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>Meu Diário</Link>
                <Link to="/performance" className={`${isActive('/performance')} flex items-center gap-1.5`}><TrendingUp className="h-4 w-4" /> Notas</Link>
              </>
            )}

            {/* Link compartilhado para indicadores */}
            {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) && (
              <Link to="/performance" className={`${isActive('/performance')} flex items-center gap-1.5`}><TrendingUp className="h-4 w-4" /> Indicadores</Link>
            )}
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                    {userName.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-700">{userName}</span>
                <button onClick={handleLogout} className="p-1 hover:text-red-500 transition" title="Sair"><LogOut className="h-4 w-4" /></button>
             </div>

             {isOffline ? (
                 <button onClick={() => refreshData()} className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 text-orange-600 text-[10px] font-bold uppercase"><CloudOff className="h-3 w-3" /> Offline</button>
             ) : (
                 <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 text-green-600 text-[10px] font-bold uppercase"><CloudCheck className="h-3 w-3" /> Sincronizado</div>
             )}
             <div className="md:hidden"><button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-400">{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button></div>
          </div>
        </div>
      </div>
    </nav>
  );
};
