import Axios from 'axios'
import router from '../router';
const Http = {}
Http.install = function (Vue, options) {

  Axios.defaults.baseURL
    = "http://localhost:8888/api/private/v1/";
  //请求拦截器 http request拦截器
  Axios.interceptors.request.use(function (config) {
    // console.log(config)
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem("token");
      config.headers.Authorization = AUTH_TOKEN;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  Axios.interceptors.response.use(function (config) {
    return config;
  }, function (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          });
      }
    }
    return Promise.reject(error.response.data);
  })
  // 4. 添加实例方法
  Vue.prototype.$http = Axios
}
export default Http