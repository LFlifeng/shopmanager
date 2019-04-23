<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-brand level1="商品管理" level2="商品分类"></my-brand>
    <!-- 添加分类按钮 -->
    <el-row>
      <el-col :span="24" class="searchArea">
        <el-button type="success" @click="showAddGoodsCate()">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 级联选择器 (表单元素) -->
        <el-form-item label="分类" :label-width="formLabelWidth">
          {{selectedOptions}}
          <el-cascader
            expand-trigger="hover"
            change-on-select
            clearable
            :options="caslist"
            v-model="selectedOptions"
            :props="defaultProp"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table height="350" :data="list" style="width: 100%">
      <!-- 表格展开为树形结构

      treeKey相当于nodekey  每个节点唯一标识  值来源list数据中key名
      parentKey 父节点的数据的标识 cat_pid
      levelKey 自己层级标识
      childKey 子节点的数据所在的key  children
      -->
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-else-if="scope.row.cat_level===1">二级</span>
          <span v-else-if="scope.row.cat_level===2">三级</span>
        </template>
      </el-table-column>

      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">有效</span>
          <span v-else-if="scope.row.cat_deleted===true">无效</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15,20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
const ElTreeGrid = require("element-tree-grid");

export default {
  // 局部注册
  components: {
    // 组件名 el-tree-grid
    ElTreeGrid
  },
  data() {
    return {
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      dialogFormVisibleAdd: false,
      form: {
        cat_pid: -1,
        cat_name: "",
        cat_level: -1
      },
      formLabelWidth: "140px",
      //  级联选择器要用的数据
      caslist: [],
      selectedOptions: [],
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 添加分类 - 发送请求
    async addCate() {
      // cat_name	分类名称	不能为空  el-input v-model="form.cat_name"
      // cat_pid	分类父 ID	不能为空  来源于级联选择器绑定的数组中的值
      // cat_level 0/1/2

      // 如果添加一级  cat_pid 0   cat_level=0
      // 如果添加二级  cat_pid = this.selectedOption[0]  cat_level=1
      // 如果添加三级  cat_pid = this.selectedOption[1] cat_level=2
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0;
        this.form.cat_level = 0;
      }
      if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0];
        this.form.cat_level = 1;
      }
      if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1];
        this.form.cat_level = 2;
      }

      const res = await this.$http.post(`categories`, this.form);
      // console.log(res);
      // 清空
      this.form = {};
      // 刷新
      this.getGoodsCate();
      // 关闭
      this.dialogFormVisibleAdd = false;
    },
    // 添加分类- 显示对话框
    async showAddGoodsCate() {
      // 获取两级分类的数据
      const res = await this.$http.get(`categories?type=2`);
      this.caslist = res.data.data;

      this.dialogFormVisibleAdd = true;
    },
    // 获取所有分类
    async getGoodsCate() {
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      console.log(res);
      this.list = res.data.data.result;
      // console.log(this.list);

      this.total = res.data.data.total;
    },
    // 分页的相关方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodsCate();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      // this.pagenum = 2 = val
      this.pagenum = val;
      this.getGoodsCate();
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}

.searchArea .searchInput {
  width: 350px;
}
</style>


