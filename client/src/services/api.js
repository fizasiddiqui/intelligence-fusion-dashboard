import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';
const API_URL = `${API_BASE}/api`;
const API = axios.create({ baseURL: API_URL });

export { API_BASE, API_URL };

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-logout on 401
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export const getMarkers = () => API.get('/markers');

export const createMarker = (data) => API.post('/markers', data);

export const deleteMarker = (id) => API.delete(`/markers/${id}`);

export const uploadData = (file) => {
    const formData = new FormData();
    formData.append('datafile', file);
    return API.post('/upload/data', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const uploadImage = (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return API.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
