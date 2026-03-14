import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
          <div className="bg-white max-w-2xl w-full rounded-[48px] p-12 shadow-2xl text-center space-y-8">
            <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 mx-auto">
              <AlertCircle className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">System Crash</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">The command center encountered a fatal runtime exception.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-left overflow-hidden">
                <p className="text-red-600 font-mono text-xs break-all">
                    {this.state.error?.message}
                </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-3 mx-auto shadow-xl"
            >
              <RefreshCcw className="w-4 h-4" /> Restart Intelligence
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
