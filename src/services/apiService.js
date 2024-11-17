import axios from 'axios';
import toast from 'react-hot-toast';

// Create an axios instance
const apiClient = axios.create({
    baseURL: 'https://api.glimmerwave.store/api/v1', // Base URL for your backend
    maxBodyLength: Infinity, // Optional: for large requests, if needed
});

// Add a request interceptor to include the token only when required
apiClient.interceptors.request.use(
    (config) => {
        // Check if the request requires authentication
        if (config.requiresAuth) {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            // If token exists, add it to the headers
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            } else {
                // Optionally handle the case where the token is missing
                toast.error('No authentication token found. Please log in.');
                // Redirect to login page or handle it accordingly
                window.location.href = '/auth';
            }
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Handle all server requests
const apiService = {
    request: (config) => {
        return apiClient(config)
            .then((response) => response.data)
            .catch((error) => {
                console.error('API request error:', error);
                if (error.response?.status === 401) {
                    toast.error('Session expired. Please login again.');
                    localStorage.removeItem('token');
                    window.location.href = '/auth';
                } else {
                    if (typeof window === 'undefined') {
                        return Promise.reject(error);
                    } else {
                        toast.error(error.response?.data?.message || 'An error occurred');
                    }
                }
            });
    },
};

export default apiService;