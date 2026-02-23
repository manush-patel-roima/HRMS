import { toast } from 'react-toastify';
import AuthService from '../services/auth/authService';

const ERROR_MESSAGES = {
  400: 'Invalid request. Please check your input.',
  401: 'Your session has expired. Please login again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This resource already exists or there is a conflict.',
  422: 'Business rule violation. Please check your data.',
  500: 'An unexpected server error occurred. Please try again later.',
  NETWORK: 'Network error. Please check your connection.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
};


const extractErrorMessage = (error) => {

  if (error.response?.data) {
    const { message, error: errorType } = error.response.data;
    if (message) return message;
    if (errorType) return errorType;
  }


  if (error.response?.statusText) {
    return error.response.statusText;
  }


  if (!error.response) {
    return ERROR_MESSAGES.NETWORK;
  }


  return ERROR_MESSAGES[error.response.status] || ERROR_MESSAGES.UNKNOWN;
};

const handle401 = () => {
  AuthService.logout();
  window.location.href = '/login';
  toast.error(ERROR_MESSAGES[401], {
    toastId: 'unauthorized',
  });
};


const handle403 = (message) => {
  toast.error(message || ERROR_MESSAGES[403], {
    toastId: 'forbidden',
  });
};

const handle404 = (message) => {
  toast.error(message || ERROR_MESSAGES[404], {
    toastId: 'not-found',
  });
};


const handle409 = (message) => {
  toast.error(message || ERROR_MESSAGES[409], {
    toastId: 'conflict',
  });
};


const handle400 = (message) => {
  toast.error(message || ERROR_MESSAGES[400], {
    toastId: 'bad-request',
  });
};


const handle422 = (message) => {
  toast.error(message || ERROR_MESSAGES[422], {
    toastId: 'business-rule-violation',
  });
};


const handle500 = (message) => {
  toast.error(message || ERROR_MESSAGES[500], {
    toastId: 'server-error',
  });
};


export const handleApiError = (error) => {
  const status = error.response?.status;
  const errorMessage = extractErrorMessage(error);

  console.error('API Error:', { status, message: errorMessage, error });

  switch (status) {
    case 400:
      handle400(errorMessage);
      break;
    case 401:
      handle401();
      break;
    case 403:
      handle403(errorMessage);
      break;
    case 404:
      handle404(errorMessage);
      break;
    case 409:
      handle409(errorMessage);
      break;
    case 422:
      handle422(errorMessage);
      break;
    case 500:
      handle500(errorMessage);
      break;
    default:
      if (!error.response) {
        toast.error(ERROR_MESSAGES.NETWORK, {
          toastId: 'network-error',
        });
      } else {
        toast.error(errorMessage || ERROR_MESSAGES.UNKNOWN, {
          toastId: 'generic-error',
        });
      }
  }

  return Promise.reject(error);
};

export const extractErrorMessage_safe = (error) => {
    if (!error) return 'An unexpected error occurred';

    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    if (error.message) {
        return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
};

export const isValidationError = (error) => {
    return error?.response?.status === 400 || error?.response?.data?.error === 'VALIDATION_ERROR';
};

export const isForbiddenError = (error) => {
    return error?.response?.status === 403;
};

export const isNotFoundError = (error) => {
    return error?.response?.status === 404;
};

export const isServerError = (error) => {
    return error?.response?.status >= 500;
};

