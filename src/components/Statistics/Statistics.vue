<template>
    <div class="statistics-box">
        <el-row :gutter="34">
            <el-col :span="8" v-for="(item,index) in persionData" :key="index">
                 <card :mainData="item" :cardClass="classData[index]"></card>
            </el-col>
        </el-row>
        <div class="echarts-content">
            <div class="title">
                企业每日使用人员分析图（截止昨天）
            </div>
            <div id="chartItem" class="chart-item">

            </div>
        </div>
    </div>
</template>
<script>
// import { component } from "vue/types/umd";
import {numToFixed} from "../../common/mixin/numToFixed.js"
import card from "./card.vue"
import * as echarts from 'echarts';
    export default {
        props: {
            itemData: {},
            editableTabs: {},
            editableTabsValue: {},
        },
        mixins:[numToFixed],
        data(){
            return {
                // 3个卡片的数据
                persionData: [],
                // 图形的数据
                chartsData: [],
                // card的三种类型
                classData: ["blue","purple","green"]
            }
        },
        components: {
            card
        },
        methods: {
            setChartFn(){
                let that = this,
                    maxNum = 0,
                    option = {
                        color: "#13C2C2",
                        grid: [{
                            containLabel: true,
                            nameLabel: true,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            top: 30,
                        }],
                        xAxis: {
                            type: 'category',
                            data: []
                        },
                        yAxis: {
                            type: 'value',
                            axisLine: {
                                show: true
                            }
                        },
                        tooltip: {//hover提示信息设置
                            trigger: 'axis',
                            confine: true,   //悬停不超出范围
                            formatter: function (params) {//柱线图hover提示框内容
                                var _html = params[0].data.name;
                                params.length && params.map((v, i) => {
                                    _html += "<br/>" + v.marker + v.seriesName + "：" + v.data.value  + (v.data.unit ? v.data.unit : "");
                                })
                                return _html;
                            }
                        },
                        series: [{
                            name:"人员使用情况",
                            data: [],
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                normal: {
                                    lineStyle:{
                                        width:3//设置线条粗细
                                    }
                                }
                            }
                        }]
                    };
                that.chartsData.map((v)=>{
                    option.xAxis.data.push(v.name)
                    option.series[0].data.push({
                        name: v.name,
                        value: v.value,
                        unit: v.unit
                    })
                    maxNum < v.value ? maxNum = v.value : ""
                })
                option.yAxis.max = Math.ceil(maxNum * 1.2)
                var chartDom = document.getElementById('chartItem');
                var myChart = echarts.init(chartDom);
                option && myChart.setOption(option);
            }
        },
        mounted(){
            console.log(this.itemData)
            let that = this,
                url = "/custom/index/index";
            this.$axios.get(url).then((res)=>{
                if(res.data.code === 1){
                    // 当前企业人数
                    that.persionData.push({
                        title: "当前企业人数",
                        data:[
                            {
                                key:"",
                                value: res.data.data.current_num,
                                color: "blue"
                            }
                        ]
                    })
                    // 激活人数
                    that.persionData.push({
                        title: "激活人数",
                        data:[
                            {
                                key:"已激活",
                                value: res.data.data.activate_num.activate,
                                color: "blue"
                            },
                            {
                                key:"未激活",
                                value: res.data.data.activate_num.inactive,
                                color: "red"
                            }
                        ]
                    })
                    // 员工离职情况
                    that.persionData.push({
                        title: "员工离职情况",
                        data:[
                            {
                                key:"目前累计离职人数",
                                value: "",
                                color: ""
                            },
                            {
                                key:"",
                                value: res.data.data.leave_num,
                                color: "red"
                            }
                        ]
                    })
                    that.chartsData = res.data.data.active
                    that.setChartFn()
                    console.log(res.data.data)
                }else{
                    that.overdueOperation(res.data.code, res.data.msg);
                }
                // console.log(that.getSet)
            }).catch((err)=>{
                // console.log(err);
                this.$message({
                    message: err,
                    type: 'error'
                });
            })
        }
    }
</script>
<style lang="less" scoped>
    .statistics-box{
        max-width: 800px;
        margin: 0 auto;
        padding-top: 20px;
        .echarts-content{
            margin-top: 80px;
            .title{
                font-size: 16px;
                line-height: 34px;
                text-align: center;
            }
            .chart-item{
                width: 100%;
                height: 400px;
            }
        }
    }
</style>