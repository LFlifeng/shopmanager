<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <my-brand level1="用户管理" level2="用户列表"></my-brand>
        <!-- 搜索+添加用户 -->
        <el-row>
            <el-col>
                <el-input
                    placeholder="请输入用户名"
                    class="input-with-select"
                    v-model="query"
                    clearable
                    @clear="getAllUsers()"
                >
                    <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
                </el-input>
                <el-button type="success" @click="showDiaAdd()">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 表格-用户列表 -->
        <el-table :data="tableData" style="width: 100%" height="300px">
            <el-table-column prop="id" label="#" width="80"></el-table-column>
            <el-table-column prop="username" label="姓名" width="100"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
            <el-table-column label="创建日期" width="200">
                <!-- slot-scope作用：承上启下/传递数据
                “tableData”会自动获取上层数据的值：data="tableData"-->
                <template slot-scope="scope">{{scope.row.create_time|fmtDate}}</template>
            </el-table-column>
            <el-table-column label="用户状态" width="140">
                <template slot-scope="scope">
                    <el-switch
                        @change="changeState(scope.row)"
                        v-model="scope.row.mg_state"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        plain
                        type="primary"
                        @click="showEdit(scope.row)"
                        icon="el-icon-edit"
                        circle
                    ></el-button>
                    <el-button
                        size="mini"
                        plain
                        type="danger"
                        @click="showDele(scope.row)"
                        icon="el-icon-delete"
                        circle
                    ></el-button>
                    <el-button
                        size="mini"
                        plain
                        type="success"
                        @click="showRoleDia(scope.row)"
                        icon="el-icon-check"
                        circle
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页处理 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
        <!-- 弹出框 -->
        <!-- 添加 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配 -->
        <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
            <el-form>
                <el-form-item label="用户名" :label-width="formLabelWidth">{{currUsername}}</el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                    {{currRoleId}}
                    <el-select v-model="currRoleId">
                        <!--
              1. v-model写在select
              2. 如果v-model绑定数据的值和option的value一样 -> 默认显示option(label)
              3. 如果选择了某个option,此时,v-model绑定的数据值就是被选中的option的value值

                        -->
                        <!-- 数字-1和"-1" -->
                        <el-option disabled label="请选择" :value="-1"></el-option>
                        <el-option
                            v-for="(v,i) in roles"
                            :key="i"
                            :label="v.roleName"
                            :value="v.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
                <el-button type="primary" @click="setRole()">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      //数据来源
      tableData: [{}],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 控制对话框显示/隐藏
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      // select所绑定的数据
      currRoleId: -1,
      //角色数据
      roles: [],
      currUsername: "",
      currUserId: -1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    //分配角色 - 发送 请求
    async setRole() {
      // id: 用户id->1看data 2. 看方法能不能传递user.id -> 在data中提供新数据currUserId
      // 请求体{rid:当前修改后的角色id}

      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });
      this.dialogFormVisibleRole = false;

      // console.log(res);
    },
    //分配角色功能----打开弹出框
    async showRoleDia(user) {
      // console.log(user)
      this.currUsername = user.username;
      this.currUserId = user.id;
      this.dialogFormVisibleRole = true;
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }
      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2);
      this.currRoleId = res2.data.data.rid;
    },
    //用户状态
    async changeState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      console.log(res);
    },
    //用户编辑---发送请求
    async editUser() {
      //console.log(this.form)
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    //用户编辑----打开弹出框
    async showEdit(user) {
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.get(`users/${user.id}`);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.form = data;
      }
    },
    //删除功能
    showDele(user) {
      this.$confirm("忍心删我？？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          console.log(res);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success("删除成功");
            this.pagenum = 1;
            this.getTableData();
          } else {
            this.$message.warning(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //用户添加----发送请求
    async addUser() {
      const res = await this.$http.post("users", this.form);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        //关闭对话框
        this.dialogFormVisibleAdd = false;
        //刷新表格
        this.getTableData();
      } else {
        //错误提示
        this.$message.warning(msg);
      }
    },
    //用户添加----打开弹出框
    showDiaAdd() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    //点击x获取所有用户
    getAllUsers() {
      this.getTableData();
    },
    //点击搜索实现搜索功能
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    //分页相关方法
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      // val是当前页码
      this.pagenum = val;
      this.getTableData();
    },
    //获取表格数据
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res)
      const {
        meta: { status, msg },
        data: { total, users }
      } = res.data;
      if (status === 200) {
        this.tableData = users;
        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.input-with-select {
  margin-top: 20px;
  width: 350px;
}
</style>

