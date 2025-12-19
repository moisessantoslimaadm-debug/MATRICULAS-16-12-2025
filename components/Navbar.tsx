
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from '../router';
import { GraduationCap, Menu, X, Database, CloudCheck, CloudOff, BarChart3, TrendingUp, User, LogOut, BookOpen, LayoutDashboard, Map, Bell } from 'lucide-react';
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

  const isActive = (path: string) => 
    location.pathname === path 
      ? 'text-indigo-600 font-black bg-indigo-50 px-4 py-2 rounded-xl' 
      : 'text-slate-500 hover:text-indigo-600 font-bold px-4 py-2 hover:bg-slate-50 rounded-xl transition-all';

  return (
    <nav className="glass-premium sticky top-0 z-[100] border-b border-slate-100 px-6 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-slate-900 p-2.5 rounded-[1.2rem] group-hover:rotate-6 transition-transform shadow-lg shadow-slate-200">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tighter uppercase">
              Educa<span className="text-indigo-600">Município</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) && (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>Painel</Link>
                <Link to="/schools" className={isActive('/schools')}>Escolas</Link>
                <Link to="/admin/map" className={isActive('/admin/map')}>Mapa</Link>
                <Link to="/admin/data" className={isActive('/admin/data')}>Gestão</Link>
                <Link to="/reports" className={isActive('/reports')}>Relatórios</Link>
              </>
            )}

            {role === UserRole.TEACHER && (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>Início</Link>
                <Link to="/journal" className={isActive('/journal')}>Meu Diário</Link>
                <Link to="/performance" className={isActive('/performance')}>Avaliações</Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            {isOffline ? (
              <button onClick={() => refreshData()} className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 text-orange-600 text-[10px] font-black uppercase tracking-widest">
                <CloudOff className="h-3 w-3" /> Offline
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                <CloudCheck className="h-3 w-3" /> Sincronizado
              </div>
            )}
            
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>

          <div className="h-10 w-px bg-slate-100 hidden md:block"></div>

          {role ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-black text-slate-900 leading-none">{userName}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{role}</span>
              </div>
              <div className="group relative">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100 cursor-pointer group-hover:scale-105 transition-transform">
                  {userName.charAt(0)}
                </div>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-[200]">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold text-xs uppercase tracking-widest">
                        <LogOut className="h-4 w-4" /> Sair do Sistema
                    </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                Acessar Portal
            </Link>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-400 hover:text-indigo-600">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
            <div className="flex flex-col gap-2">
                <Link onClick={() => setIsOpen(false)} to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                <Link onClick={() => setIsOpen(false)} to="/schools" className={isActive('/schools')}>Escolas</Link>
                <Link onClick={() => setIsOpen(false)} to="/admin/map" className={isActive('/admin/map')}>Mapa de Calor</Link>
                <Link onClick={() => setIsOpen(false)} to="/reports" className={isActive('/reports')}>Relatórios</Link>
                <div className="h-px bg-slate-50 my-2"></div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 font-black text-xs uppercase tracking-widest">
                    <LogOut className="h-4 w-4" /> Sair
                </button>
            </div>
        </div>
      )}
    </nav>
  );
};
