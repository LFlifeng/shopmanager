<template>
  <div class="wrap">
    <el-form class="form" label-position="top" label-width="80px" v-model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="btn" @click="handelLogin()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
    data(){
        return {
            formdata:{
                username: '',
                password: ''
            }
        }
    },
    methods: {
        //登陆请求  异步处理
        async handelLogin(){
            const res = await this.$http.post('login',this.formdata)
            const {
                data: {
                    meta: {msg,status},
                    data
                }
            } = res
            if (status === 200) {
                localStorage.setItem('token',data.token)
                this.$router.push({
                    name: 'home'
                })
            } else {
                this.$message.warning(msg)
            }
        }

        // handelLogin(){
        //     this.$http.post('login',this.formdata)
        //     .then((res) => {
        //         const {data:{meta:{msg,status}},data} =res
        //         console.log(res)
        //         if(status===200) {
        //             // alert(msg)
        //             // this.$message({
        //             //     showClose: true,
        //             //     message: msg,
        //             //     type: 'success'
        //             // })
        //             // this.$message.success(msg)
        //             this.$router.push({
        //                 name: 'home'
        //             })
        //         } else {
        //             // alert(msg)
        //             // this.$message({
        //             //     showClose: true,
        //             //     message: msg,
        //             //     type: 'warning'
        //             // })
        //             this.$message.warning(msg)
        //         }
        //     })
        // }
    }

}
</script>
  
<style>
.wrap {
    height: 100%;
    background-color: darkcyan;
    display: flex;
    justify-content: center;
    align-items: center;
}
.wrap .form {
    background-color: aliceblue;
    border-radius: 10px;
    width: 400px;
    padding: 30px;
}
.wrap .form .btn {
    width: 100%;
}
</style>
