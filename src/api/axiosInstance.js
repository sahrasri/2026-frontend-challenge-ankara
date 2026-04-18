import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.jotform.com',
  params: {
    apiKey: import.meta.env.VITE_JOTFORM_API_KEY,
  },
});

export default axiosInstance;
