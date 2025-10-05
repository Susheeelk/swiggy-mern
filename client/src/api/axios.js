import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api", // change if needed
    withCredentials: true, // important for HTTP-only cookies
});

export default axiosInstance;
