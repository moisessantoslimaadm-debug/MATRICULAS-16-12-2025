import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Copy } from 'lucide-react';
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

// Fix: Extending Component directly to ensure member inheritance of props and setState
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
    // Fix: Use the setState method inherited from Component base class
    this.setState({ errorInfo });
    
    // Fix: Access logError from props inherited from Component base class
    if (this.props.logError) {
        this.props.logError(
            `Erro Crítico de Interface: ${error.message}`, 
            errorInfo.componentStack || ''
        );
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    if (window.confirm("Isso limpará os dados locais para tentar recuperar o sistema. Deseja continuar?")) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  private handleCopyDetails = () => {
      const { error, errorInfo } = this.state;
      const text = `Erro: ${error?.message}\n\nStack Trace:\n${errorInfo?.componentStack || 'Não disponível'}`;
      navigator.clipboard.writeText(text);
      alert('Detalhes do erro copiados para a área de transferência.');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-red-100 p-12 max-w-md w-full text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 glow-red">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Ops! Algo falhou.</h1>
            <p className="text-slate-500 mb-8 font-medium">
              Ocorreu uma interrupção inesperada no núcleo da aplicação.
            </p>
            
            <div className="bg-slate-50 p-6 rounded-2xl text-left mb-10 overflow-hidden border border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mensagem do Sistema</p>
                <p className="text-xs font-mono text-slate-600 break-words line-clamp-3">
                    {this.state.error?.message || "Erro de execução não catalogado"}
                </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reiniciar Módulo
              </button>
              
              <button
                onClick={this.handleCopyDetails}
                className="w-full flex items-center justify-center px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition"
              >
                <Copy className="h-4 w-4 mr-2 text-slate-400" />
                Copiar Diagnóstico
              </button>

              <button
                onClick={() => window.location.hash = '#/'}
                className="w-full flex items-center justify-center px-6 py-4 bg-transparent text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-slate-700 transition"
              >
                <Home className="h-4 w-4 mr-2" />
                Portal Início
              </button>
              
               <button
                onClick={this.handleReset}
                className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 underline mt-8 block mx-auto opacity-50 hover:opacity-100 transition"
              >
                Limpeza Total de Emergência
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Fix: Return children using the inherited props member from Component base class
    return this.props.children;
  }
}

export const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
    let logError: ((message: string, details: string) => void) | undefined;
    try {
        const { addLog } = useLog();
        logError = (msg: string, details: string) => addLog(msg, 'error', details);
    } catch (e) {
        console.warn("LogProvider indisponível");
    }

    return <ErrorBoundaryInner logError={logError}>{children}</ErrorBoundaryInner>;
};