<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <my-brand level1="权限管理" level2="角色列表"></my-brand>
        <!-- 添加按钮 -->
        <el-row class="btn">
            <el-col>
                <el-button type="primary">添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 表格  角色列表-->
        <el-table :data="rights" style="width: 100%">
            <el-table-column type="expand" width="260">
                <!--展开后的内容 角色列表 -->
                <template slot-scope="scope">
                    <el-row v-for="(item1,index) in scope.row.children" :key="item1.id">
                        <el-col :span="4">
                            <el-tag @close="deleRights(scope.row,item1)" closable type="success">{{item1.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row v-for="(item2,index) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag @close="deleRights(scope.row,item2)" closable type="info">{{item2.authName}}</el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag @close="deleRights(scope.row,item3)" closable type="warning" v-for="(item3,index) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row v-if="scope.row.children.length === 0">
                        <el-col>
                            <span>该角色未分配任何权限</span>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="80"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="100"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                    <el-button size="mini" @click="showDiaRights(scope.row)" plain type="success" icon="el-icon-check" circle></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分配权限  弹出框 -->
        <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%">
            <!-- 树形结构
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            -->
            <el-tree
                ref="tree"
                default-expand-all
                :data="treeData"
                show-checkbox
                node-key="id"
                :props="defaultProps"
                :default-checked-keys="checkedArr"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRights()">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data(){
        return {
            dialogVisible: false,
            rights: [],
            treeData: [],
            // 树形结构配置选项
            defaultProps: {
                label: "authName",
                children: "children"
            },
            expandedArr: [],
            checkedArr: [],
            currRoleId: -1
        };
    },
    created(){
        this.getRoles();
    },
    methods: {
        //分配权限   发送请求
        async setRights(){
            // 1.获取节点中全选的节点的id
            const arr1 = this.$refs.tree.getCheckedKeys();
            // 2.获取节点中半选的节点的id
            const arr2 = this.$refs.tree.getHalfCheckedKeys();
            const arr = [...arr1,...arr2];
            // 3.发送请求
            const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {rids: arr.join(",")});
            // 4.关闭弹出框
            this.dialogVisible = false;
            // 5.更新表格
            this.getRoles();
        },
        //修改权限   打开对话框
        async showDiaRights(role){
            this.dialogVisible = true;//打开对话框
            this.currRoleId = role.id;
            //获取树形结构的权限数据
            const res = await this.$http.get(`rights/tree`);
            //刷新
            this.treeData = res.data.data;
            //获取该角色的所拥有的权限
            const tempArr = [];
            role.children.forEach(item1=> {
                tempArr.push(item1.id);
                item1.children.forEach(item2=> {
                    tempArr.push(item2.id);
                    item2.children.forEach(item3=> {
                        tempArr.push(item3.id);
                    });
                });
            });
            this.checkedArr = tempArr;

        },
        //取消权限
        async deleRights(role,rights) {
            // console.log(rights);
            // roles/:roleId/rights/:rightId
            const res = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`);
            role.children = res.data.data;
        },
        //获取权限列表
        async getRoles(){
            //在请求发送之前  .then方法之前设置头部
            const res = await this.$http.get(`roles`);
            // console.log(res);
            this.rights = res.data.data;
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}
.btn {
    margin-top: 10px;
}
.el-tag {
    margin-bottom: 6px;
}
.el-tag--warning {
    margin-left: 4px;
}
</style>
