import axios from 'axios';
import queryString from 'query-string'

const axiosClient = axios.create({
    baseURL: 'https://luanvanapi.azurewebsites.net/api',
    headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
    },
    paramsSerializer: params => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(async (response) => {
    if(response && response.data) return response.data;
    return response;
},(error) => {
    throw error;
});
export default axiosClient;


