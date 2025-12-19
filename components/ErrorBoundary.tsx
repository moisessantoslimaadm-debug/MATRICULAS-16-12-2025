import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Copy, ShieldAlert, FileSearch } from 'lucide-react';
import { useLog } from '../contexts/LogContext';

interface InnerProps {
  children?: ReactNode;
  logError?: (message: string, details: string) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryInner extends Component<InnerProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
    
    if (this.props.logError) {
        this.props.logError(
            `Falha Crítica de Interface: ${error.message}`, 
            errorInfo.componentStack || ''
        );
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleCopyDetails = () => {
      const { error, errorInfo } = this.state;
      const text = `Erro: ${error?.message}\n\nStack Trace:\n${errorInfo?.componentStack || 'Não disponível'}`;
      navigator.clipboard.writeText(text);
      alert('Relatório de erro copiado.');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-[4rem] shadow-2xl border border-red-100 p-16 max-w-2xl w-full text-center animate-in zoom-in-95 duration-700">
            <div className="w-32 h-32 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-xl shadow-red-50">
              <ShieldAlert className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">Interrupção de Sistema.</h1>
            <p className="text-slate-500 mb-12 text-xl font-medium leading-relaxed">
              Ocorreu uma falha inesperada no processamento de rede. Por favor, reinicie o módulo.
            </p>
            
            <div className="bg-slate-50 p-10 rounded-[2.5rem] text-left mb-14 overflow-hidden border border-slate-200 font-mono">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileSearch className="h-4 w-4" /> Protocolo de Diagnóstico
                </p>
                <p className="text-sm text-slate-600 break-words line-clamp-3">
                    {this.state.error?.message || "Erro desconhecido pela SME Itaberaba"}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center px-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest hover:bg-emerald-600 transition shadow-2xl shadow-slate-200"
              >
                <RefreshCw className="h-5 w-5 mr-3" />
                Reiniciar Módulo
              </button>
              
              <button
                onClick={this.handleCopyDetails}
                className="flex items-center justify-center px-10 py-6 bg-white border border-slate-200 text-slate-700 rounded-[2rem] font-black text-[12px] uppercase tracking-widest hover:bg-slate-50 transition"
              >
                <Copy className="h-5 w-5 mr-3 text-slate-400" />
                Copiar Log
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
    let logError: ((message: string, details: string) => void) | undefined;
    try {
        const { addLog } = useLog();
        logError = (msg: string, details: string) => addLog(msg, 'error', details);
    } catch (e) {}

    return <ErrorBoundaryInner logError={logError}>{children}</ErrorBoundaryInner>;
};