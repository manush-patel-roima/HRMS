import React, { useState, useCallback } from 'react';
import { registerToastCallback } from '../utils/toastUtils';

export const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
        const id = Date.now();
        const toast = { id, message, type };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }

        return id;
    }, []);

    const hideToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Register the callback for global toast utility
    React.useEffect(() => {
        registerToastCallback(showToast);
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast, toasts }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

