import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    
    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 5000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

const ToastIcon = ({ type }: { type: ToastType }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };
  return icons[type];
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`
              min-w-[320px] max-w-md rounded-lg shadow-2xl p-4 flex items-start gap-3
              backdrop-blur-sm border-l-4
              ${toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-900' : ''}
              ${toast.type === 'error' ? 'bg-red-50 border-red-500 text-red-900' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-900' : ''}
              ${toast.type === 'info' ? 'bg-blue-50 border-blue-500 text-blue-900' : ''}
            `}
          >
            <div
              className={`
                ${toast.type === 'success' ? 'text-green-600' : ''}
                ${toast.type === 'error' ? 'text-red-600' : ''}
                ${toast.type === 'warning' ? 'text-yellow-600' : ''}
                ${toast.type === 'info' ? 'text-blue-600' : ''}
              `}
            >
              <ToastIcon type={toast.type} />
            </div>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
