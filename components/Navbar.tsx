import React, { useEffect, useState } from 'react';
import { Link, useLocation } from '../router';
import { GraduationCap, Menu, X, Database, LayoutDashboard, CloudCheck, CloudOff, BarChart3, Lock, LayoutGrid, TrendingUp, RefreshCw } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isOffline, refreshData } = useData();

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem('admin_auth') === 'true');
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-slate-600 hover:text-blue-600';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg"><GraduationCap className="h-6 w-6 text-white" /></div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">Educa<span className="text-blue-600">Município</span></span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/schools" className={isActive('/schools')}>Escolas</Link>
            <Link to="/registration" className={isActive('/registration')}>Matrícula</Link>
            <Link to="/status" className={isActive('/status')}>Protocolo</Link>
            {isAuthenticated && (
                <>
                    <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                    <Link to="/reports" className={`${isActive('/reports')} flex items-center gap-1.5`}>
                       <BarChart3 className="h-4 w-4" /> Relatórios
                    </Link>
                    <Link to="/performance" className={`${isActive('/performance')} flex items-center gap-1.5`}>
                       <TrendingUp className="h-4 w-4" /> Indicadores
                    </Link>
                    <Link to="/admin/data" className={`${isActive('/admin/data')} bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1.5`}>
                      <Database className="h-4 w-4" /> Gestão
                    </Link>
                </>
            )}
          </div>

          <div className="flex items-center gap-4">
             {isOffline ? (
                 <button onClick={() => refreshData()} className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 text-orange-600 text-[10px] font-bold uppercase"><CloudOff className="h-3 w-3" /> Offline</button>
             ) : (
                 <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 text-green-600 text-[10px] font-bold uppercase"><CloudCheck className="h-3 w-3" /> Online</div>
             )}
             <div className="md:hidden"><button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-400">{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button></div>
          </div>
        </div>
      </div>
    </nav>
  );
};