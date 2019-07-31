<template>
    <el-card class="box-card">
        <!-- //面包屑 -->
        <my-brand level1="商品管理" level2="分类参数"></my-brand>
        <!-- 提示 -->
        <el-row class="alert">
            <el-col>
                <el-alert
                    title="注意：只允许为第三级分类设置参数"
                    type="warning"
                    center
                    show-icon
                    :closable="false"
                ></el-alert>
            </el-col>
        </el-row>
        <el-form class="form" :model="form" label-position="left">
            <el-form-item label="请选择商品分类 ">
                <el-cascader
                    :show-all-levels="false"
                    clearable
                    expand-trigger="hover"
                    :options="options"
                    v-model="selectedOptions"
                    :props="defaultProp"
                    @change="changeSelectoption()"
                ></el-cascader>
            </el-form-item>
        </el-form>
        <!-- tabs -->
        <el-tabs type="border-card" v-model="active" @tab-click="changeTab()">
            <el-tab-pane name="1" label="动态参数">
                <!-- 按钮 -->
                <el-button type="primary" :disabled="selectedOptions.length===0">设置动态参数</el-button>
                <!-- 表格 -->
                <el-table height="300px" border="" stripe :data="arrDy" style="width: 100%">
                    <el-table-column type="expand" width="200">
                        <template slot-scope="scope">
                            <!-- 动态el-tag编辑 -->
                            <el-tag
                                v-for="(item,i) in scope.row.attr_vals"
                                :key="item.attr_id"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(scope.row,item)"
                            >{{item}}</el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                            ></el-input>
                            <el-button
                                v-else
                                class="button-new-tag"
                                size="small"
                                @click="showInput"
                            >+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#" width="200"></el-table-column>
                    <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
                    <el-table-column label="操作" width="350">
                        <template slot-scope="scope">
                            <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                            <el-button plain size="mini" type="danger" @click="Dele(scope.row)" icon="el-icon-delete" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2" label="静态参数">
                <el-button type="primary" :disabled="selectedOptions.length===0">设置静态参数</el-button>
                <el-table height="300px" border="" stripe :data="arrStatic" style="width: 100%">
                    <el-table-column type="index" label="#" width="200"></el-table-column>
                    <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
                    <el-table-column prop="attr_vals" label="参数值名称" width="200"></el-table-column>
                    <el-table-column label="操作" width="350">
                        <template slot-scope="scope">
                            <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                            <el-button plain size="mini" type="danger" @click="Dele(scope.row)" icon="el-icon-delete" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      options: [],
      selectedOptions: [],
      defaultProp: {
        // label/children/value
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      active: "1",
      arrDy: [],
      arrStatic: [],
      // 动态编辑tag的数据
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    //完成以下配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
    this.getGoodsCate();
  },
  mounted() {
    //el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子
  },
  methods: {
    // 删除功能
    Dele(product) {
        
      this.$confirm("忍心删我？？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`categories/${product.cat_id}/attributes/${product.attr_id}`);
          console.log(res.data)
        //   console.log(product.cat_id)
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success("删除成功");
            this.getStaticparams();
          } else {
            this.$message.warning(msg);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
        console.log(product)
        // categories/:id/attributes/:attrid
    },
    async handleClose(attr, item) {
      attr.attr_vals.splice(attr.attr_vals.indexOf(item), i);
      console.log(attr);
      const putData = {
        attr_name: attr.attr_name, //string
        attr_sel: attr.attr_sel, //string
        attr_vals: attr.attr_vals.join(",") //string
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
        putData
      );
      console.log(res);
    },
    showInput() {
      this.inputVisible = true;
      //操作DOM
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleInputConfirm(attr) {
      const inputValue = this.inputValue;
      if (inputValue) {
        attr.attr_vals.push(inputValue);
        //发送编辑请求
        const putData = {
          attr_name: attr.attr_name,
          attr_sel: attr.attr_sel,
          attr_vals: attr.attr_vals
        };
        const res = await this.$http.put(
          `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
          putData
        );
        // console.log(res);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    changeTab() {
      //判断是否是三级  判断是否是第一个tab
      if (this.selectedOptions.length === 3 && this.active === "1") {
        this.getDyparams();
      }
      //判断是否是三级  判断是否是第一个tab
      if (this.selectedOptions.length === 3 && this.active === "2") {
        this.getStaticparams();
      }
    },
    //选中级联选择器的label
    changeSelectoption() {
      //判断是否是三级  判断是否是第一个tab
      if (this.selectedOptions.length === 3 && this.active === "1") {
        this.getDyparams();
      }
      //判断是否是三级  判断是否是第一个tab
      if (this.selectedOptions.length === 3 && this.active === "2") {
        this.getStaticparams();
      }
    },
    //获取静态数据
    async getStaticparams() {
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=only`
      );
      this.arrStatic = res.data.data;
      // console.log(this.arrStatic);
    },
    //获取动态数据
    async getDyparams() {
      // console.log(this.selectedOptions);
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=many`
      );
      this.arrDy = res.data.data;
      // console.log(this.arrDy);
      this.arrDy.forEach(item => {
        item.attr_vals =
          item.attr_vals.trim().length === 0
            ? []
            : item.attr_vals.trim().split(",");
      });
    },
    //获取三级分类数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      this.options = res.data.data;
    //   console.log(this.options);
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
/* .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
} */
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-form-item {
  margin-bottom: 4px !important;
}
.form {
  height: 100% !important;
}
</style>
