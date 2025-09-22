import { createContext, useContext, useState, type ReactNode } from "react";
import { Leaf } from "lucide-react"; // icon lá từ lucide-react

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Tự động ẩn sau 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast UI */}
      <div className="fixed top-5 right-5 space-y-4 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="w-80 rounded-xl shadow-lg overflow-hidden border border-green-500 bg-white animate-fadeIn pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-green-600 text-white px-4 py-2">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-100" />
                <span className="font-semibold">Detox Care</span>
              </div>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                className="text-green-100 hover:text-white focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-3 text-gray-800 text-sm bg-white">
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
