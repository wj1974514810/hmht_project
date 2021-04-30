import axios from 'axios'

axios.defaults.baseURL = 'http://157.122.54.189:9083'

axios.interceptors.request.use(function (config) {
    console.log('拦截器');
    // 在发送请求之前做些什么
    let token = localStorage.getItem('hmtt_ht_token')
    if (token) {
        config.headers.Authorization = token
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

export default axios