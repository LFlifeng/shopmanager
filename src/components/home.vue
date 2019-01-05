<template>
<el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <img src="@/assets/logo.png" alt="图片无法显示">
          </div>
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1" class="loginout">
          <a href @click.prevent="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu unique-opened default-active="2" router>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-success"></i>
              用户列表
            </el-menu-item>
          </el-submenu>

          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="1-4">
              <i class="el-icon-success"></i>
              权限列表
            </el-menu-item>
          </el-submenu>

          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              商品分类
            </el-menu-item>
          </el-submenu>

          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              订单列表
            </el-menu-item>
          </el-submenu>

          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-3">
              <i class="el-icon-success"></i>
              数据报表
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
methods: {
  handleLoginout(){
    //清除token
    localStorage.clear()
    this.$router.push({
      name: "login"
    })
    //提示退出成功
    this.$message.success('退出成功')
  },
  beforeCreate() {
    if(!localStorage.getItem('token')){
      this.$message.warning('请先登录！！！')
      this.$router.push({
        name: 'login'
      })
    }
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
  background-color: #b3c0d1;
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

