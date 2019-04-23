<template>
    <el-card class="box-card">
        <!-- //面包屑  全局组件 -->
        <my-brand level1="权限管理" level2="权限列表"></my-brand>
        <!-- 表格 -->
        <el-table class="table" height="480px" :data="roles" style="width: 100%">
            <el-table-column type="index" label="#" width="80"></el-table-column>
            <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
            <el-table-column prop="path" label="路径" width="200"></el-table-column>
            <el-table-column label="层级" width="200">
                <template slot-scope="scope">
                <span v-if="scope.row.level==='0'">一级</span>
                <span v-if="scope.row.level==='1'">二级</span>
                <span v-if="scope.row.level==='2'">三级</span>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            roles:[]
        }
    },
    created(){
        this.getRights();
    },
    methods: {
        async getRights(){
            
            //在请求发送之前  .then方法之前设置头部
            const res = await this.$http.get(`rights/list`);
            // console.log(res);
            this.roles = res.data.data;
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}
.table {
    margin-top: 20px;
}
</style>
