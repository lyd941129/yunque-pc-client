<!-- 列表页的各种检索组件 -->
<template>
        <el-form-item :label="mainData.label + ':' ">
            <template v-if="mainData.type === 'select'">
                <el-select @change="getSearchDataFn" v-model="mainData.value" filterable placeholder="请选择" clearable>
                    <el-option
                    v-for="item in mainData.select"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                    ></el-option>
                </el-select>
            </template>
            <template v-else-if="mainData.type === 'text'">
                <el-input type="text" @blur="getSearchDataFn" v-model="mainData.value" prefix-icon="el-icon-search" placeholder="关键字搜索" clearable></el-input>
            </template>
            <template v-else-if="mainData.type === 'time'">
                <el-date-picker
                :default-time="['00:00:00', '23:59:59']"
                @change="getSearchDataFn"
                v-model="mainData.value"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </template>


        </el-form-item>
</template>
<script>
export default {
    props:{
        mainData: {
            type: Object,
            default(){
                return {
                    type: "select", // text , time  ,select
                    name: "", // 请求的字段值
                    label: "", // label
                    value: "", // 值
                    // select会有
                    select: [
                        {
                            key: "",
                            value: ""
                        }
                    ]
                }
            }
        }
    },
    methods: {
        // 检索的数据
        getSearchDataFn(){
            this.$emit("getSearch",this.mainData)
        }
    }
}
</script>
<style lang="less" scoped>

</style>