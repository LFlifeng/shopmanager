import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import { Message } from 'element-ui';
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
      // redirect: {
      //   name: 'login'
      //   // path: '/login'
      // }
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    }
  ]
});
//路由守卫  拦截路由配置
router.beforeEach((to,from,next) => {
  // console.log(to,from);
  // console.log("路由拦截触发");
  //如果要去的是登陆  -> 该登陆就登陆 -> next()
  if(to.name ==='login'){
    next();
  }else{
    // 如果要去的不是登陆 -> 是否有token -> next() 如果没有 -> login
    if (!localStorage.getItem('token')){
      // // 去登录
      //提示
      Message.warning("请先登录");
      router.push({
        name:"login"
      });
    }else{
      next();
    }
  }
  // next();

});
export default router;

