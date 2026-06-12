import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastCtx = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const show = useCallback((msg, isError = false, loading = false) => {
    clearTimeout(timer.current);
    setToast({ msg, isError, loading });
    loading ? setToast({ msg, isError, loading }) : timer.current = setTimeout(() => setToast(null), 3200)
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div aria-live="polite" className="fixed bottom-6 inset-x-4 z-[200] flex justify-center pointer-events-none">
        <div className={`transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}>
          {toast && (
            <div className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-[14px] font-semibold text-white shadow-2xl ${
              toast.isError ? 'bg-red-600' : 'bg-ink'
            }`}>
              <span>{toast.isError ? '⚠' : !toast.loading ? '✓' : 'O'}</span>
              <span>{toast.msg}</span>
            </div>
          )}
        </div>
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
