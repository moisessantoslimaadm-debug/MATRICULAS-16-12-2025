import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from '../router';
import { GraduationCap, Menu, X, CloudCheck, CloudOff, LogOut, LayoutDashboard, Map, Database, User } from 'lucide-react';
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
      ? 'text-emerald-600 font-black bg-emerald-50/80 px-6 py-3 rounded-2xl shadow-sm border border-emerald-100/50' 
      : 'text-slate-500 hover:text-emerald-600 font-bold px-6 py-3 hover:bg-white rounded-2xl transition-all duration-300';

  return (
    <nav className="glass-premium sticky top-0 z-[100] px-8 py-3 mx-4 my-4 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/50 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-5 group">
            <div className="bg-slate-900 p-3.5 rounded-[1.4rem] group-hover:rotate-[10deg] transition-all duration-500 shadow-xl shadow-slate-200/20 active:scale-90">
              <GraduationCap className="h-7 w-7 text-emerald-400" />
            </div>
            <span className="font-black text-2xl text-slate-900 tracking-tighter uppercase hidden lg:block">
              Educa<span className="text-emerald-600">Município</span>
            </span>
          </Link>

          <div className="hidden xl:flex items-center gap-3">
            {(role === UserRole.ADMIN_SME || role === UserRole.DIRECTOR) && (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                <Link to="/schools" className={isActive('/schools')}>Rede</Link>
                <Link to="/admin/map" className={isActive('/admin/map')}>Geoprocess</Link>
                <Link to="/admin/data" className={isActive('/admin/data')}>Gestão</Link>
              </>
            )}
            {role === UserRole.TEACHER && (
              <>
                <Link to="/dashboard" className={isActive('/dashboard')}>Portal</Link>
                <Link to="/journal" className={isActive('/journal')}>Diário</Link>
                <Link to="/performance" className={isActive('/performance')}>Rendimento</Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-4">
            {isOffline ? (
              <button onClick={() => refreshData()} className="flex items-center gap-2 bg-red-50 px-5 py-2.5 rounded-full border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <CloudOff className="h-3 w-3" /> Offline
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                <CloudCheck className="h-3 w-3" /> Rede Sincronizada
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-slate-200/50 hidden md:block"></div>

          {role ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-black text-slate-900 leading-none">{userName}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{role}</span>
              </div>
              <div className="group relative">
                <div className="w-12 h-12 rounded-[1.4rem] bg-slate-900 flex items-center justify-center text-emerald-400 font-black shadow-xl shadow-slate-200 cursor-pointer group-hover:scale-110 transition-all duration-500 border border-slate-800">
                  {userName.charAt(0)}
                </div>
                <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 p-4 z-[200] transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="p-5 border-b border-slate-50 mb-3 bg-slate-50/50 rounded-[2rem]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Identidade Digital</p>
                        <p className="text-sm font-bold text-slate-700 truncate">{userName}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-between gap-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-[1.8rem] transition-colors font-black text-[11px] uppercase tracking-widest group/btn">
                        <span>Encerrar Sessão</span>
                        <LogOut className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-slate-900 text-white px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 active:scale-95">
                Acessar Portal
            </Link>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-emerald-600 transition-colors">
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden absolute top-[calc(100%+1rem)] left-0 right-0 bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 animate-in slide-in-from-top-4 duration-500">
             <div className="flex flex-col gap-4">
                 <Link onClick={()=>setIsOpen(false)} to="/dashboard" className="px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Dashboard</Link>
                 <Link onClick={()=>setIsOpen(false)} to="/schools" className="px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Rede Escolar</Link>
                 <Link onClick={()=>setIsOpen(false)} to="/registration" className="px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Nova Matrícula</Link>
                 <Link onClick={()=>setIsOpen(false)} to="/status" className="px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Consultar Protocolo</Link>
             </div>
        </div>
      )}
    </nav>
  );
};