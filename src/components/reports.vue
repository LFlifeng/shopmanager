<template>
    <el-card class="box-card">
        <my-brand level1="数据统计" level2="数据报表"></my-brand>
        <div id="main" style="width: 600px;height:400px;">

        </div>
    </el-card>
</template>

<script>
import echarts from 'Echarts'


export default {
    mounted(){
        this.initEcharts();
    },
    methods: {
        async initEcharts(){
            const myChart = echarts.init(document.getElementById('main'));
            const res = await this.$http.get('reports/type/1');
            const option1 = res.data.data;
            //指定图表的配置项和数据
            const option2 = {
                title: {
                    text: ''
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : ['周一','周二','周三','周四','周五','周六']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ]
            };
            const option = {...option1, ...option2};
            myChart.setOption(option);
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}
</style>
