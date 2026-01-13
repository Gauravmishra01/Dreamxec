import axios from 'axios';

// Create a configured axios instance (or reuse if you have a shared one)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Adjust base URL as needed
    headers: {
        'Content-Type': 'application/json',
    },
});

export const subscribeToNewsletter = async (email: string, source: string = 'unknown') => {
    try {
        const response = await api.post('/newsletter/subscribe', {
            email,
            source,
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Subscription failed');
        }
        throw new Error('Network error or server unavailable');
    }
};
