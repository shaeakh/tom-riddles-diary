const EnvConstants = {
  BACKEND_URL: (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000',
};

export default EnvConstants;
