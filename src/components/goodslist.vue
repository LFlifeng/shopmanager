<template>
  <el-card class="box-card">
    <my-brand level1="商品管理" level2="商品列表"></my-brand>
    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input v-model="searchValue" class="searchInput" clearable placeholder="请输入内容">
          <el-button @click="handleSearch()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="addGoods()" type="success" plain>添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table v-loading height="450px" border="" stripe :data="list" style="width: 100%">
      <!-- 序号 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <template slot-scope="scope">{{scope.row.add_time | fmtDate('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="primary"
            @click="Edit(scope.row)"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            plain
            size="mini"
            type="danger"
            @click="Dele(scope.row)"
            icon="el-icon-delete"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 编辑商品弹出层 -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisibleEdit">
      <el-steps :active="1*active" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- tabs标签 -->
      <el-form class="form" :model="form" label-position="top">
        <el-tabs tab-position="left" v-model="active" @tab-click="changeTab()">
          <el-tab-pane name="1" label="基本信息">
            <el-form-item label="商品名称">
              <el-input v-model="form.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="form.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="form.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="form.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              {{selectedOptions}}
              <el-cascader
                expand-trigger="hover"
                :options="options"
                :props="defaultProp"
                @change="handleChange()"
                v-model="selectedOptions"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品参数">
            <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox border="" v-for="(item2,i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品属性">
            <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品图片">
            <el-form-item>
              <el-upload
                action="http://localhost:8888/api/private/v1/upload"
                :headers="headers"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture"
                v-model="form.goods_small_logo"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="5" label="商品内容">
            <el-form-item>
              <!-- 修改商品按钮 -->
              <el-button type="primary" @click="editProduct()">修改商品</el-button>
              <!-- 富文本 -->
              <quill-editor class="editor" v-model="form.goods_introduce"></quill-editor>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      searchValue: "",
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      // 控制对话框显示/隐藏
      dialogFormVisibleEdit: false,
      active: "1",
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_introduce: "",
        goods_cat: "",
        pics: [],
        attrs: []
      },
      //级联选择器所使用的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //动态参数数组
      arrDy: [],
      // 静态参数数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    addGoods() {
      //编程式导航
      this.$router.push({ name: "goodsadd" });
    },

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.loadData();
    },
    //点击搜索实现搜索功能
    handleSearch(){
      this.pagenum = 1;
      this.loadData();
    },
    // 商品编辑----发送请求
    async editProduct() {
      // console.log(this.form)
      const res = await this.$http.put(
        `goods/${this.form.goods_id}`,
        this.form
      );
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.loadData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 商品编辑----打开弹出框
    async Edit(product) {
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.get(`goods/${product.goods_id}`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.form = data;
      }
    },
    //图片上传的钩子函数
    handleRemove(file) {
      const index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
    },
    handleSuccess(response) {
      this.form.pics.push({
        pic: response.data.tmp_path
      });
    },
    //选中tab是触发
    async changeTab() {
      if (this.active === "2") {
        //判断tab是否是第二个
        // 判断有没有三级分类
        if (this.selectedOptions.length === 3) {
          //发送请求
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          this.arrDy = res.data.data;
          this.arrDy.forEach(item => {
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
        } else {
          this.$message.warning("请选择商品的三级分类");
        }
      }
      //判断tab是不是第三个
      if (this.active === "3") {
        if (this.selectedOptions.length === 3) {
          //静态参数数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          this.arrStatic = res.data.data;
        } else {
          this.$message.warning("请选择商品的三级分类");
        }
      }
    },
    //选中不同的label时会触发
    handleChange() {},
    //获取三级分类数据
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      this.options = res.data.data;
    },
    // 删除功能
    Dele(product) {
      this.$confirm("忍心删我？？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`goods/${product.goods_id}`);
          // console.log(res)
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success("删除成功");
            this.loadData();
          } else {
            this.$message.warning(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    
    // 渲染表格数据
    async loadData() {
      const { data: resData } = await this.$http.get(
        `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // console.log(this)
      this.total = resData.data.total;
      this.list = resData.data.goods;
      // console.log(this.list);
      // console.log(this.total)
    }
  }
};
</script>

<style>
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
</style>
