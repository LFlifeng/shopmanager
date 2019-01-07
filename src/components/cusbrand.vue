<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: "my-brand",
    //当期望数据值来源于外部时，此时需要把数据声明在选项props中
    // props选项中的值是字符串数组
    // props中的数据是声明数据，其中的数据跟data中的数据用法一样，可以使用插值表达式
    props: ['level1','level2']
}
</script>

<style>

</style>
