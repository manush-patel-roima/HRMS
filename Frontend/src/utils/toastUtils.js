import { toast } from 'react-toastify';


export const showSuccessToast = (message, options = {}) => {
    toast.success(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options,
    });
};


export const showErrorToast = (message, options = {}) => {
    toast.error(message, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options,
    });
};


export const showWarningToast = (message, options = {}) => {
    toast.warning(message, {
        position: 'top-right',
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options,
    });
};


export const showInfoToast = (message, options = {}) => {
    toast.info(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options,
    });
};

