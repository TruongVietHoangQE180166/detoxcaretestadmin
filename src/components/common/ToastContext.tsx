import { createContext, useContext, useState, type ReactNode } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

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

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          iconBg: "bg-green-400",
          iconColor: "text-black",
          borderColor: "border-green-400",
          progressBg: "bg-green-400",
        };
      case "error":
        return {
          icon: <XCircle className="w-5 h-5" />,
          iconBg: "bg-black",
          iconColor: "text-white",
          borderColor: "border-black",
          progressBg: "bg-black",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          iconBg: "bg-gray-400",
          iconColor: "text-white",
          borderColor: "border-gray-400",
          progressBg: "bg-gray-400",
        };
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast UI */}
      <div className="fixed top-5 right-5 space-y-3 z-50 pointer-events-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`w-96 rounded-2xl shadow-2xl overflow-hidden border-2 ${styles.borderColor} bg-white animate-slideInRight pointer-events-auto transform transition-all duration-300 hover:scale-105`}
            >
              {/* Content */}
              <div className="relative flex items-start gap-4 p-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full ${styles.iconBg} ${styles.iconColor} flex items-center justify-center shadow-lg`}
                >
                  {styles.icon}
                </div>

                {/* Message */}
                <div className="flex-1 pt-1">
                  <p className="text-sm font-medium text-black leading-relaxed">
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-black transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-gray-100 overflow-hidden">
                <div
                  className={`h-full ${styles.progressBg} animate-shrink`}
                  style={{ animationDuration: "3000ms" }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out;
        }

        .animate-shrink {
          animation: shrink linear forwards;
        }
      `}</style>
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