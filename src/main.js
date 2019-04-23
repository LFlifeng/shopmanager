// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Http from '@/plugins/http'
import MyBrand from '@/components/cusBrand.vue'
import 'element-ui/lib/theme-chalk/index.css'
import "@/assets/index.css"
import moment from 'moment'
Vue.config.productionTip = false
Vue.use(Http)
Vue.use(ElementUI)
//注册全局组件
Vue.component(MyBrand.name,MyBrand);
//处理日期的全局过滤器
Vue.filter('fmtDate',(v)=>{
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
