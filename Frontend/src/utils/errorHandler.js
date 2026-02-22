import { showErrorToast, showWarningToast } from './toastUtils';
import AuthService from '../services/auth/authService';

export const handleApiError = (error) => {

    if (!error.response) {
        showErrorToast('Network error. Please check your connection and try again.');
        return {
            status: 0,
            message: 'Network error',
            type: 'NETWORK_ERROR'
        };
    }

    const { status, data } = error.response;


    if (data && data.message) {
        const errorMessage = data.message;
        const errorCode = data.error || 'UNKNOWN_ERROR';

        switch (status) {
            case 400:
                showErrorToast(errorMessage || 'Invalid input. Please check your data.');
                return { status, message: errorMessage, type: 'VALIDATION_ERROR' };

            case 401:
                // Unauthorized
                showWarningToast('Your session has expired. Please login again.');
                AuthService.logout();
                window.location.href = '/login';
                return { status, message: errorMessage, type: 'UNAUTHORIZED' };

            case 403:
                // Forbidden
                showErrorToast(errorMessage || 'You do not have permission to perform this action.');
                return { status, message: errorMessage, type: 'FORBIDDEN' };

            case 404:
                showErrorToast(errorMessage || 'The requested resource was not found.');
                return { status, message: errorMessage, type: 'NOT_FOUND' };

            case 409:
                // Conflict
                showErrorToast(errorMessage || 'This resource already exists.');
                return { status, message: errorMessage, type: 'DUPLICATE_RESOURCE' };

            case 422:
                // Business rule violation
                showErrorToast(errorMessage || 'Business rule violated. Please review your data.');
                return { status, message: errorMessage, type: 'BUSINESS_RULE_VIOLATION' };

            case 500:
                showErrorToast('Server error. Please try again later.');
                return { status, message: errorMessage, type: 'INTERNAL_SERVER_ERROR' };

            default:
                showErrorToast(errorMessage || 'An unexpected error occurred. Please try again.');
                return { status, message: errorMessage, type: errorCode };
        }
    }

    // Fallback for non-structured responses
    const fallbackMessage = status === 500
        ? 'Server error. Please try again later.'
        : `Error ${status}: ${error.message || 'An unexpected error occurred'}`;

    showErrorToast(fallbackMessage);

    return {
        status,
        message: fallbackMessage,
        type: 'UNKNOWN_ERROR'
    };
};

export const extractErrorMessage = (error) => {
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

