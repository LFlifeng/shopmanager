<template>
<el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <img src="@/assets/logo.jpg" alt="图片无法显示">
          </div>
        </el-col>
        <el-col :span="19" class="middle">
          <h2>后台管理系统</h2>
        </el-col>
        <el-col :span="1" class="loginout">
          <a href @click.prevent="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu unique-opened default-active="2" router>
          <el-submenu :index="''+item1.order" v-for="(item1,i) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2,i) in item1.children" :key="item2.id">
              <i class="el-icon-success"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return {
      menus:[]
    };
  },
  beforeCreate() {
    if(!localStorage.getItem('token')){
      this.$message.warning('请先登录！！！')
      this.$router.push({
        name: 'login'
      })
    }
  },
  created(){
    this.getMenus();
  },
  methods: {
    
    //获取导航数据
    async getMenus(){
      const res = await this.$http.get(`menus`);
//    console.log(res);
//    console.log(res.data.data[0].path);
      this.menus = res.data.data;
    },
    //退出
    handleLoginout(){
      //清除token
      localStorage.clear()
      this.$router.push({
        name: "login"
      })
      //提示退出成功
      this.$message.success('退出成功')
    }
    
  }
}
</script>

<style>
.container {
  height: 100%;
  /* background-color: yellow; */
}
.container .header {
  background-color: #ccc;
}
.container .aside {
  /* background-color: blue; */
}
.container .main {
  /* background-color: black; */
}
.middle {
  line-height: 20px;
  color: white;
  text-align: center;
}
.loginout a {
  line-height: 60px;
  text-decoration: none;
}
</style>

