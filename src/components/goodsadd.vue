<template>
    <el-card class="box-card">
        <!-- //面包屑 -->
        <my-brand level1="商品管理" level2="商品列表"></my-brand>
        <!-- 提示 -->
        <el-row class="alert">
            <el-col>
                <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            </el-col>
        </el-row>
        <!-- 步骤条 -->
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
                        @change="handleChange"
                        v-model="selectedOptions"
                        ></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="2" label="商品参数">
                    <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
                        <!-- 复选框组 -->
                        <el-checkbox-group v-model="item1.attr_vals">
                            <el-checkbox border v-for="(item2,i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
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
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="5" label="商品内容">
                    <el-form-item>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" @click="addGoods()">添加商品</el-button>
                        <!-- 富文本 -->
                        <quill-editor class="editor" v-model="form.goods_introduce"></quill-editor>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import {quillEditor} from 'vue-quill-editor';
export default {
    components: {
        quillEditor
    },
    data(){
        return {
            active: '1',
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
            selectedOptions: [1,3,6],
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
        }
    },
    created() {
        this.getGoodCate();
    },
    methods: {
        //添加商品
        async addGoods(){
            // console.log(typeof this.form.goods_cat);//string
            this.form.goods_cat = this.selectedOptions.join(",");
            //动态参数数组
            const Darr = this.arrDy;
            const newDarr = Darr.map(item => {
                return {attr_id:item.attr_id,attr_value:item.attr_vals}; 
            });
            //静态参数数组
            const Sarr = this.arrStatic;
            const newSarr = Sarr.map(item => {
                return {attr_id:item.attr_id,attr_value:item.attr_vals};
            });
            //合并数组
            const arr = [...newDarr,...newSarr];
            this.form.attrs = arr;
            const res = await this.$http.post(`goods`, this.form);
            this.$router.push({
                name:"goods"
            });
        },
        //图片上传的钩子函数
        handleRemove(file){
            const index = this.form.pics.findIndex(item => {
                return item.pic === file.response.data.tmp_path;
            });
            this.form.pics.splice(index,1);
        },
        handleSuccess(response){
            this.form.pics.push({
                pic: response.data.tmp_path
            })
        },
        //选中tab是触发
        async changeTab(){
            if(this.active === '2'){//判断tab是否是第二个
                // 判断有没有三级分类
                if(this.selectedOptions.length === 3) {
                    //发送请求
                    const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                    this.arrDy = res.data.data;
                    this.arrDy.forEach(item => {
                        item.attr_vals = item.attr_vals.trim().length === 0
                        ? []
                        : item.attr_vals.trim().split(",");
                    });
                }else {
                    this.$message.warning("请选择商品的三级分类");
                }
            }
            //判断tab是不是第三个
            if(this.active === "3") {
                if(this.selectedOptions.length === 3) {
                    //静态参数数据
                    const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
                    this.arrStatic = res.data.data;
                }else {
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
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.form {
    height: 400px;
    overflow: auto;
    border: 1px dotted #ccc;
}
.editor {
    min-height: 200px;
}
</style>
