import Axios from 'axios'
const Http = {}
Http.install = function (Vue, options) {

  Axios.defaults.baseURL
  = "http://localhost:8888/api/private/v1/";
  //请求拦截器
  Axios.interceptors.request.use(function(config){
    if(config.url !== 'login'){
      const AUTH_TOKEN = localStorage.getItem("token");
      config.headers.Authorization = AUTH_TOKEN;
    }
    return config;
  },function(error){
    return Promise.reject(error);
  });

    // 4. 添加实例方法
  Vue.prototype.$http = Axios
}
export default Http