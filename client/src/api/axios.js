import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://swiggy-mern-6w1t.onrender.com/api", // change if needed
    withCredentials: true, // important for HTTP-only cookies
});

export default axiosInstance;
