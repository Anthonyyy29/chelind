import axios from 'axios';

// Auth native session Laravel (bukan Sanctum) — lihat API.md §1.
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default axios;
