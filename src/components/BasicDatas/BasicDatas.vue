<!-- 基础数据设置 -->
<template>
    <div class="enterprise-box dis-flex" v-loading="loading">
        <el-row class="tac">
			<el-col :span="12">
				<el-menu :default-active="adhibition" class="el-menu-vertical-demo" @select="handlAdhibition">
					<el-menu-item v-for="(item, index) in adhibitionArr" :index="item.id" :key="index">
						<span slot="title">{{item.dict_name}}</span>
					</el-menu-item>
				</el-menu>
			</el-col>
		</el-row>
        <div class="enterprise-right">
            
            <el-form :inline="true" :model="searchLists" class="demo-form-inline">
                <el-form-item label="关键字">
                    <!-- 回车时触发 -->
                    <el-input type="text" @keyup.enter.native="searchFn(1)" v-model="searchLists.dict_label" prefix-icon="el-icon-search" placeholder="关键字搜索" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="searchFn(1)">确认筛选</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-button type="primary" class="btn-blue" @click="addFn">新增</el-button>
                <el-button type="primary" class="btn-blue" @click="editFn">编辑</el-button>
                <el-button type="danger" class="btn-red" @click='delFn'>批量删除</el-button>
            </el-row>
            <div class="table-box table-box-btn">
                <el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
                :select-on-indeterminate='false' height="100%" @row-click="on_select">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="排序" prop="dict_sort" align="center"></el-table-column>
                    <el-table-column label="数据名称" prop="dict_label" align="center"></el-table-column>
                    <el-table-column label="是否用户自定义" prop="is_user_defined" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.is_user_defined ? '是' : '否'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.create_time ? getLocalTime(scope.row.create_time) : ''}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="更新时间" prop="update_time" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.update_time ? getLocalTime(scope.row.update_time) : ''}}</div>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="最近修改人" prop="handler_user" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.handler_user.username}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination @current-change="searchFn" :current-page="searchLists.page" @size-change="sizeChange"
            :page-size="searchLists.page_size" :page-sizes="pageSizes" layout="sizes, total, prev, pager, next, jumper" :total="total">
            </el-pagination>
            <!-- 弹框 -->
            <el-dialog :title="dalogTitle" :visible.sync="centerDialogVisible" center width='530px'>
                <el-form :model="editData" :rules="rules" ref="form" label-width="135px">
                    <el-form-item label="数据名称" prop="dict_label">
                        <el-input v-model="editData.dict_label" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="dict_sort">
                        <el-input v-model="editData.dict_sort" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="installed">
                        <el-radio-group v-model="editData.installed">
                            <el-radio :label="1">启用</el-radio>
                            <el-radio :label="0">停用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" class="btn-dialog" @click="createAn()">确 定</el-button>
                </span>
            </el-dialog>
        </div>

    </div>
</template>
<script>
export default {
    props: {
		itemData: {},
        editableTabs: {},
        editableTabsValue: {},
    },
    data() {
        return {
            loading: false,
            // 左侧导航数据
            adhibitionArr: [

            ],
            // 总数
            total: 0,
            // 列表查询数据
            searchLists: {
                dict_type: "", // 查询的类型
                page: 1,
                page_size: 15,
                dict_label: "", // 查询的值
            },
            // 表格数据
            tableData: [],
            // 新增编辑的数据
            editData: {
                id: "", // 编辑的时候有id
                dict_type: "",
                dict_label: "",
                dict_sort: 0,
                installed: 1
            },
            // 验证
            rules: {
                dict_label: [{
                    required: true,
                    message: '请输入数据名称',
                    trigger: 'blur'
                }],
                dict_sort: [{
                    required: true,
                    message: '请输入排序数值',
                    trigger: 'blur'
                }]
            },
            // 弹框显示
            centerDialogVisible: false,
            // 弹框标题
            dalogTitle: "",
            // 翻页的数组
            pageSizes: [15,30,50,100]
        }
    },
    computed: {
        adhibition(){   
            return (this.adhibitionArr[0] && this.adhibitionArr[0].id) || ""
        },
        getLocalTime: function() {// 时间转化
            return function(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            }
        }
    },
    methods: {
        // 新增和编辑的确定
        createAn(data){
            let that = this,
                url = "/custom/dict/add_value",
                option = this.editData;
            if(data){
                // 有值，赋值
                option = data
                url = "/custom/dict/del_value"
            }else if(this.editData.id){
                // 编辑
                url = "/custom/dict/edit_value";
            }
            this.loading = true;
            this.$axios.post(url,option).then(res => {
                if(res.data.code === 1){
                    this.centerDialogVisible = false
                    this.searchFn(this.searchLists.page)
                }else{
                    this.overdueOperation(res.data.code, res.data.msg);
                }
                this.loading = false;
            }).catch(err => {
                this.loading = false;
                this.$message({
                    message: err,
                    type: 'error'
                });
            })
        },
        // 新增
        addFn(){
            this.dalogTitle = "新增"
            this.editData = {
                dict_type: this.editData.dict_type,
                dict_label: "",
                dict_sort: 0,
                installed: 1
            }
            this.centerDialogVisible = true
        },
        // 编辑
        editFn(){
            this.dalogTitle = "编辑"
            let selectData = this.$refs.multipleTable.selection
            if(selectData.length !== 1){
                this.$message.error('请勾选且只能勾选一项');
                return
            }
            this.editData.id = selectData[0].id
            this.editData.dict_sort = selectData[0].dict_sort
            this.editData.dict_label = selectData[0].dict_label
            this.editData.installed = selectData[0].installed
            this.centerDialogVisible = true
            
        },
        // 删除
        delFn(){
            let selectData = this.$refs.multipleTable.selection
            if(selectData.length === 0){
                this.$message.error('请至少勾选一项');
                return
            }
            this.$confirm('确认删除吗？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                let delIds = selectData.map((v)=>{
                    return v.id
                })
                this.createAn({ids: delIds})
            }).catch(err => {
                // that.$message({
                //     showClose: true,
                //     message: err.msg,
                //     type: 'error'
                // });
                // console.log(err)
            });


        },
        // 检索区域确认筛选
        onScreen(e){
            this.searchFn()
        },
        // 列表查询
        searchFn(size){
            let that = this,
                url = "/custom/dict/value_list";
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
        // 左侧导航切换
        handlAdhibition(key){
            let itemData = this.adhibitionArr.find((e)=>{
                    return e.id === key
                })
            this.searchLists = {
                dict_type: itemData.dict_type,
                dict_label: "",
                page: 1,
                page_size: 15
            }
            this.editData.dict_type = itemData.dict_type
            this.searchFn()
        },
        // 让表格点击行可以选中
        on_select(val) {
            this.$refs.multipleTable.toggleRowSelection(val);
        },
        sizeChange(val){
            this.searchLists.page_size = val
            this.searchFn(this.searchLists.page)
        }
    },
    mounted (){
        // 挂载之后执行
        
        let that = this;
        that.loading = true;
        let url = '/custom/dict/index';
        this.$axios.get(url).then(res => {
            if(res.data.code === 1){
               console.log(res)
               that.adhibitionArr = res.data.data
               that.handlAdhibition(that.adhibitionArr[0].id)
            }else{
                that.overdueOperation(res.data.code, res.data.msg);
                setTimeout(function(){
                    if(that.editableTabs.length>1){// 如果请求失败则返回上个页签
                        let deldata = that.editableTabs.pop();
                        that.$emit('updata:editableTabs', deldata);
                        that.$emit('update:editableTabsValue', '1');
                    }
                }, 1000);
            }
            // console.log(that.getSet)
            this.loading = false;
        }).catch(err => {
            // console.log(err);
            this.loading = false;
            this.$message({
                message: err,
                type: 'error'
            });
            setTimeout(function(){
                if(that.editableTabs.length>1){// 如果请求失败则返回上个页签
                    let deldata = that.editableTabs.pop();
                    that.$emit('updata:editableTabs', deldata);
                    that.$emit('update:editableTabsValue', '1');
                }
            }, 1000);
        })
    }
}
</script>
<style lang="less" scoped>
.enterprise-box{
    .table-box-btn{
        height: calc(100% - 164px);
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
