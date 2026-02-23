import React from 'react';
export const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
    return (
        <ToastContext.Provider value={{}}>
            {children}
        </ToastContext.Provider>
    );
};


