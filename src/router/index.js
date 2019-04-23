import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Goodsadd from '@/components/goodsadd.vue'
import Goodslist from '@/components/goodslist.vue'
import Params from '@/components/params.vue'
import Categories from '@/components/categories.vue'
import Orders from '@/components/orders.vue'
import Reports from '@/components/reports.vue'
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
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component: Goodsadd
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goodslist
        },
        {
          name: 'params',
          path: '/params',
          component: Params
        },
        {
          name: 'categories',
          path: '/categories',
          component: Categories
        },
        {
          name: 'orders',
          path: '/orders',
          component: Orders
        },
        {
          name: 'reports',
          path: '/reports',
          component: Reports
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

