<!-- 个人管理=》日常办公=》待办、已办、消息通知、送阅、我发起的 -->
<template>
    <div class="routine-contenter">
        <el-form :inline="true" class="demo-form-inline">
            <template v-for="(item,index) in searchConfig">
                <search @getSearch="getSearchFn" :key="index" class="" :mainData="item"></search>
            </template>
        </el-form>
        <el-row class="btn-row">
            <el-button v-if="itemData.app_id === 'agency'" type="primary" class="btn-blue" @click="operateFn">办 理</el-button>
            <el-button type="primary" class="btn-blue" @click="operateFn">查 看</el-button>
            <el-button type="primary" class="btn-blue" @click="operateFn">打 印</el-button>
        </el-row>
        <div class="table-box table-box-btn">
            <template v-if="itemData.app_id === 'agency' || itemData.app_id === 'already'">
                <!-- 待办 已办 -->
                <el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
                :select-on-indeterminate='false' height="100%" @row-click="on_select">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="发起人" prop="apply_uname" align="center"></el-table-column>
                    <el-table-column label="发起时间" prop="create_time" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.create_time ? getLocalTime(scope.row.create_time) : ''}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="标题" prop="title" align="center"></el-table-column>
                    <el-table-column label="审批内容" prop="explain" align="center"></el-table-column>
                    <el-table-column label="状态" prop="status" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.status ? '待办理' : '已办理'}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template v-else-if="itemData.app_id === 'message'">
                <!-- 消息通知 -->
                <el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
                :select-on-indeterminate='false' height="100%" @row-click="on_select">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="发起人" prop="username" align="center"></el-table-column>
                    <el-table-column label="发起时间" prop="create_time" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.create_time ? getLocalTime(scope.row.create_time) : ''}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="标题" prop="handle_target" align="center"></el-table-column>
                    <el-table-column label="审批内容" prop="handle_content" align="center"></el-table-column>
                    <el-table-column label="状态" prop="is_user_defined" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.is_user_defined ? '待办理' : '已办理'}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template v-else-if="itemData.app_id === 'sendRead'">
                <!-- 送阅 -->
                <el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
                :select-on-indeterminate='false' height="100%" @row-click="on_select">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="发起人" prop="username" align="center"></el-table-column>
                    <el-table-column label="发起时间" prop="create_time" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.create_time ? getLocalTime(scope.row.create_time) : ''}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="标题" prop="handle_target" align="center"></el-table-column>
                    <el-table-column label="审批内容" prop="handle_content" align="center"></el-table-column>
                    <el-table-column label="状态" prop="is_user_defined" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.is_user_defined ? '待办理' : '已办理'}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template v-else-if="itemData.app_id === 'started'">
                <!--我发起的 -->
                <el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
                :select-on-indeterminate='false' height="100%" @row-click="on_select">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="申请时间" prop="create_time" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.create_time ? getLocalTime(scope.row.create_time) : ''}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="标题" prop="title" align="center"></el-table-column>
                    <el-table-column label="审批内容" prop="explain" align="center"></el-table-column>
                    <el-table-column label="状态" prop="status" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.status ? '待定' : '待定'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前节点" prop="current_step_title" align="center"></el-table-column>
                </el-table>
            </template>
        </div>
        <el-pagination @current-change="searchFn" :current-page="searchLists.page" @size-change="sizeChange"
        :page-size="searchLists.page_size" :page-sizes="pageSizes" layout="sizes, total, prev, pager, next, jumper" :total="total">
        </el-pagination>
        
    </div>
</template>
<script>
import Search from "./Search.vue"
export default {
    props: {
        itemData: {},
        editableTabs: {},
        editableTabsValue: {},
    },
    components: {
        Search
    },
    computed: {
        getLocalTime: function() {// 时间转化
            return function(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            }
        },
    },
    data(){
        return {
            // 检索的数据
            searchConfig: [
                {
                    type: "text", // text , time  ,select
                    name: "name", // 请求的字段值
                    label: "发起人", // label
                    value: "", // 值
                },
                {
                    type: "time", // text , time  ,select
                    name: "sendTime", // 请求的字段值
                    label: "发起时间", // label
                    value: "", // 值
                },
                {
                    type: "select", // text , time  ,select
                    name: "status", // 请求的字段值
                    label: "状态类型", // label
                    value: "", // 值
                    select: [
                        {
                            key: 1,
                            value: "待办理"
                        },
                        {
                            key: 2,
                            value: "已办理"
                        }
                    ]
                },
                {
                    type: "text", // text , time  ,select
                    name: "params", // 请求的字段值
                    label: "关键字", // label
                    value: "", // 值
                }
            ],
            // 总数
            total: 0,
            // 列表查询数据
            searchLists: {
                page: 1,
                page_size: 15,
            },
            // 列表查询地址
            searchUrl: "",
            // 表格数据
            tableData: [],
            // 翻页的数组
            pageSizes: [15,30,50,100]
        }
    },
    methods: {
        // 检索条件查询
        getSearchFn(data){
            this.searchLists[data.name] = data.value
            console.log(this.searchLists)
            this.searchFn()
        },
        // 列表查询
        searchFn(size){
            let that = this,
                url = this.searchUrl;
            this.searchLists.page = size || 1
            this.$axios.get(url,{
                params: this.searchLists
            }).then((res)=>{
                if(res.data.code === 1){
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
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
        },
        // 让表格点击行可以选中
        on_select(val) {
            this.$refs.multipleTable.toggleRowSelection(val);
        },
        sizeChange(val){
            this.searchLists.page_size = val
            this.searchFn(this.searchLists.page)
        },
        // 操作按钮
        operateFn(){

        }
    },
    mounted(){
        // 挂载之后
        console.log(this.itemData.app_id)
        let that = this;
        switch (that.itemData.app_id) {
            case "agency": // 待办
            case "already": // 已办
                that.searchConfig = [
                    {
                        type: "text", // text , time  ,select
                        name: "apply", // 请求的字段值
                        label: "发起人", // label
                        value: "", // 值
                    },
                    {
                        type: "time", // text , time  ,select
                        name: "apply_time", // 请求的字段值
                        label: "发起时间", // label
                        value: "", // 值
                    }
                ]
                that.searchUrl = "/custom/flow/todo";
                that.searchLists.apply_time = ""
                that.searchLists.apply = ""
                that.searchLists.type = 1
                if(that.itemData.app_id === "already"){
                    that.searchLists.type = 2
                }
                
                break;
            case "message":

                break;
            case "sendRead":

                break;
            case "started":
                that.searchConfig = [
                    {
                        type: "time", // text , time  ,select
                        name: "apply_time", // 请求的字段值
                        label: "发起时间", // label
                        value: "", // 值
                    }
                ]
                that.searchUrl = "/custom/flow/index";
                that.searchLists.apply_time = ""

                break;
        
            default:
                break;
        }
        this.searchFn()
    }
}
</script>
<style lang="less" scoped>
.routine-contenter{
    height: 100%;
    .table-box-btn{
        height: calc(100% - 154px);
        // height: calc(100% - 216px);
        margin-top: 20px;
    }
    .el-pagination{
        text-align: center;
        margin-top: 10px;
        .el-pagination__sizes{
            display: none;
        }
    }
}
    
</style>