import axios from 'axios';

// Auth native session Laravel (bukan Sanctum) — lihat API.md §1.
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

const api = axios.create({ baseURL: '/api' });

export const getCsrfToken = () => api.get('/csrf-cookie');

export const login = async (credentials) => {
    await getCsrfToken();
    const res = await api.post('/login', credentials);

    return res.data.user;
};

export const logout = () => api.post('/logout');

export const getMe = () => api.get('/me').then((res) => res.data);

export const getCategories = () =>
    api.get('/categories').then((res) => res.data.data);

export const getArticles = (params = {}) =>
    api.get('/articles', { params }).then((res) => res.data);

export const getArticle = (slug) =>
    api.get(`/articles/${slug}`).then((res) => res.data.data);

export const getSocialLinks = () =>
    api.get('/social-links').then((res) => res.data.data);

export const getMatches = (params = {}) =>
    api.get('/matches', { params }).then((res) => res.data.data);

export const getPlayers = () =>
    api.get('/players').then((res) => res.data.data);

export const getTransfers = () =>
    api.get('/transfers').then((res) => res.data.data);

// --- Admin ---

export const getAdminCategories = () =>
    api.get('/admin/categories').then((res) => res.data.data);

export const createCategory = (payload) =>
    api.post('/admin/categories', payload).then((res) => res.data.data);

export const updateCategory = (id, payload) =>
    api.put(`/admin/categories/${id}`, payload).then((res) => res.data.data);

export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);

export const getAdminArticles = (params = {}) =>
    api.get('/admin/articles', { params }).then((res) => res.data);

export const getAdminArticle = (id) =>
    api.get(`/admin/articles/${id}`).then((res) => res.data.data);

export const createArticle = (formData) =>
    api
        .post('/admin/articles', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res.data.data);

export const updateArticle = (id, formData) => {
    formData.append('_method', 'PUT');

    return api
        .post(`/admin/articles/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res.data.data);
};

export const deleteArticle = (id) => api.delete(`/admin/articles/${id}`);

export const getAdminSocialLinks = () =>
    api.get('/admin/social-links').then((res) => res.data.data);

export const createSocialLink = (payload) =>
    api.post('/admin/social-links', payload).then((res) => res.data.data);

export const updateSocialLink = (id, payload) =>
    api.put(`/admin/social-links/${id}`, payload).then((res) => res.data.data);

export const deleteSocialLink = (id) => api.delete(`/admin/social-links/${id}`);

export const getAdminPlayers = () =>
    api.get('/admin/players').then((res) => res.data.data);

export const createPlayer = (formData) =>
    api
        .post('/admin/players', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res.data.data);

export const updatePlayer = (id, formData) => {
    formData.append('_method', 'PUT');

    return api
        .post(`/admin/players/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res.data.data);
};

export const deletePlayer = (id) => api.delete(`/admin/players/${id}`);

export const getAdminTransfers = () =>
    api.get('/admin/transfers').then((res) => res.data.data);

export const createTransfer = (formData) =>
    api
        .post('/admin/transfers', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res.data.data);

export const updateTransfer = (id, formData) => {
    formData.append('_method', 'PUT');

    return api
        .post(`/admin/transfers/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res.data.data);
};

export const deleteTransfer = (id) => api.delete(`/admin/transfers/${id}`);

export const getAdminRoles = () =>
    api.get('/admin/roles').then((res) => res.data.data);

export const getAdminUsers = () =>
    api.get('/admin/users').then((res) => res.data.data);

export const createUser = (payload) =>
    api.post('/admin/users', payload).then((res) => res.data.data);

export const updateUser = (id, payload) =>
    api.put(`/admin/users/${id}`, payload).then((res) => res.data.data);

export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export default api;
