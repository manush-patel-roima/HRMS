import React from 'react';
import { useToast } from '../context/ToastContext';

const Toast = () => {
    const { toasts, hideToast } = useToast();

    const getToastStyles = (type) => {
        const baseStyles = 'fixed px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 z-50';
        const typeStyles = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        return `${baseStyles} ${typeStyles[type] || typeStyles.info}`;
    };

    return (
        <div className="fixed top-4 right-4 space-y-2 z-50">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className={getToastStyles(toast.type)}
                    style={{
                        animation: 'slideIn 0.3s ease-in-out',
                        transform: `translateX(0)`
                    }}
                >
                    <div className="flex items-center justify-between gap-4">
                        <span>{toast.message}</span>
                        <button
                            onClick={() => hideToast(toast.id)}
                            className="text-lg font-bold hover:opacity-80 transition-opacity"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Toast;

