import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:8080/api',
    baseURL: 'https://coursemasterbackend.onrender.com/api',
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
