let toastCallbacks = [];

export const registerToastCallback = (callback) => {
    toastCallbacks.push(callback);
};

export const showErrorToast = (message, type = 'error') => {
    toastCallbacks.forEach(cb => cb({ message, type }));
};

export const showSuccessToast = (message) => {
    toastCallbacks.forEach(cb => cb({ message, type: 'success' }));
};

export const showWarningToast = (message) => {
    toastCallbacks.forEach(cb => cb({ message, type: 'warning' }));
};

export const showInfoToast = (message) => {
    toastCallbacks.forEach(cb => cb({ message, type: 'info' }));
};

