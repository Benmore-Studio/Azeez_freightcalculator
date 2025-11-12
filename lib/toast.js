import toast from 'react-hot-toast';

// Professional toast notifications with consistent styling
// Matches our blue-600 primary color scheme

const toastConfig = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#fff',
    color: '#374151',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  success: {
    iconTheme: {
      primary: '#2563eb', // blue-600
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#dc2626', // red-600
      secondary: '#fff',
    },
  },
};

export const showToast = {
  success: (message) => {
    toast.success(message, {
      ...toastConfig,
      ...toastConfig.success,
    });
  },

  error: (message) => {
    toast.error(message, {
      ...toastConfig,
      ...toastConfig.error,
    });
  },

  info: (message) => {
    toast(message, {
      ...toastConfig,
      icon: 'ℹ️',
    });
  },

  loading: (message) => {
    return toast.loading(message, toastConfig);
  },

  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      toastConfig
    );
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
};

// Export both named and default
export default showToast;
