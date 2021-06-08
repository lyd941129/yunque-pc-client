<template>
    <div class="bperation-box">
            <el-form :inline="true" :model="searchLists" class="demo-form-inline">
                <el-form-item label="操作时间 : ">
                    <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    @change="onScreen"
                    v-model="searchLists.create_time"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="操作对象 : ">
                    <el-select @change="onScreen" v-model="searchLists.handle_target" filterable placeholder="请选择" clearable>
                        <el-option
                        v-for="item in searchParam.targetData"
                        :key="item.id"
                        :label="item.role_name"
                        :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="管理员 : ">
                    <el-select @change="onScreen" v-model="searchLists.username" filterable placeholder="请选择" clearable>
                        <el-option
                        v-for="item in searchParam.usernameData"
                        :key="item.id"
                        :label="item.role_name"
                        :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
             <!--    <el-form-item label="关键字">
                    <el-input type="text" @keyup.enter.native="searchFn(1)" v-model="searchLists.dict_label" prefix-icon="el-icon-search" placeholder="关键字搜索" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="searchFn(1)">确认筛选</el-button>
                </el-form-item> -->
            </el-form>
            <div class="table-box table-box-btn">
                <el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
                :select-on-indeterminate='false' height="100%">
                    <el-table-column label="时间" prop="create_time" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.create_time ? getLocalTime(scope.row.create_time) : ''}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="管理员" prop="username" align="center"></el-table-column>
                    <el-table-column label="操作对象" prop="handle_target" align="center"></el-table-column>
                    <el-table-column label="详细数据" prop="handle_content" align="center"></el-table-column>
                </el-table>
            </div>
            <el-pagination @current-change="searchFn" :current-page="searchLists.page" @size-change="sizeChange"
            :page-size="searchLists.page_size" :page-sizes="pageSizes" layout="sizes, total, prev, pager, next, jumper" :total="total">
            </el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        itemData: {},
        editableTabs: {},
        editableTabsValue: {},
    },
    data(){
        return {
            // 总数
            total: 0,
            // 列表查询数据
            searchLists: {
                page: 1,
                page_size: 15,
                create_time: "", // 时间
                handle_target: "", // 操作对象
                username: "", // 管理员
            },
            // 表格数据
            tableData: [],
            // 翻页的数组
            pageSizes: [15,30,50,100],
            searchParam:{
                targetData: [{}],
                usernameData: [{}]
            }
        }
    },
    computed:{
        getLocalTime: function() {// 时间转化
            return function(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            }
        }
    },
    methods:{
        // 检索区域确认筛选
        onScreen(e){
            this.searchFn()
        },
        // 数据查询
        searchFn(size){
            let that = this,
                url = "/custom/index/record";
                console.log(size)
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
        // 每页条数改变
        sizeChange(val){
            this.searchLists.page_size = val
            this.searchFn(this.searchLists.page)
        }
    },
    mounted(){
        this.searchFn()
    }
}
</script>

<style lang="less" scoped>
.bperation-box{
    height: 100%;
    .table-box-btn{
        height: calc(100% - 114px);
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