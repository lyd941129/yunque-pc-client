<!-- 我要反馈 -->
<template>
    <div class="enterprise-box dis-flex" v-loading="loading">
        <el-row class="tac">
			<el-col :span="12">
				<el-menu :default-active="adhibitionArr[0] && adhibitionArr[0].value" class="el-menu-vertical-demo" @select="handlAdhibition">
					<el-menu-item v-for="(item, index) in adhibitionArr" :index="item.value" :key="index">
						<span slot="title">{{item.name}}</span>
					</el-menu-item>
				</el-menu>
			</el-col>
		</el-row>
        <div class="enterprise-right">
            <el-row class="table-box content">
                <template v-if="dataType === 'edit'">
                    <hf-title title="填写反馈"></hf-title>
                    <feedback-content v-if="feedbackRefresh" @hfsure="setFeedbackFn" class="feedback-content" :itemData="editData" :typeData="typeData"></feedback-content>
                </template>
                <template v-else>
                    <hf-title title="历史反馈"></hf-title>
                    <div class="feedback-lists">
                        <div class="feedback-item" v-for="(item,index) in tableData" :key="index">
                            <div class="question cursor-p dis-flex" @click="toDetailFn(item)">
                                <div class="mark">
                                    反馈
                                </div>
                                <div class="detail average">
                                    {{item.content}}
                                </div>
                            </div>
                            <div v-if="item.reply" class="answer dis-flex">
                                <div class="mark">
                                    解答
                                </div>
                                <div class="detail average">
                                    {{item.reply}}
                                </div>
                            </div>
                            <div class="info">
                                <div class="info-type">
                                    反馈类型：{{item.type_text}}
                                </div>
                                <div class="info-time">
                                    {{item.create_time}}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </el-row>
            <el-pagination 
                v-show="dataType === 'list'"
                @current-change="searchFn" 
                :current-page="searchLists.page" 
                @size-change="sizeChange"
                :page-size="searchLists.page_size" 
                :page-sizes="pageSizes" 
                layout="sizes, total, prev, pager, next, jumper" 
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import myVideo from 'vue-video'
import HfTitle from "@/components/OrderRenewal/HfTitle"
import FeedbackContent from "./FeedbackContent"
export default {
    props: {
		itemData: {},
        editableTabs: {},
        editableTabsValue: {},
    },
    components: {
        myVideo,
        HfTitle,
        FeedbackContent
    },
    data() {
        return {
            // 刷新
            feedbackRefresh: true,
            // 问题类型的参数
            typeData: [],
            // 反馈的数据
            editData: {
                content: "",
                type: "",
                image: [],
                phone: ""
            },
            loading: false,
            // 数据类型
            dataType: "edit",
            // 左侧导航数据
            adhibitionArr: [],
            // 总数
            total: 0,
            // 列表查询数据
            searchLists: {
                page: 1,
                page_size: 15
            },
            // 表格数据
            tableData: [],
            // 翻页的数组
            pageSizes: [15,30,50,100],
            // 折叠面板的name值
            collapseName: [],
            // 展开的折叠面板的name值
            collapseShowData: []
        }
    },
    computed: {

    },
    methods: {
        // 反馈提交
        setFeedbackFn(data){
            console.log(data)
            this.loading = true;
            this.$axios.post("/custom/feed/add",data).then(res => {
                if(res.data.code === 1){
                    this.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    this.editData = {
                        content: "",
                        type: "",
                        image: [],
                        phone: ""
                    }
                    this.feedbackRefresh = false
                    this.$nextTick(()=>{
                        this.feedbackRefresh = true
                    })


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
        // 列表查询
        searchFn(size){
            let that = this,
                url = "/custom/feed/index";
                console.log(size)
            this.searchLists.page = size || 1
            that.loading = true;
            this.$axios.get(url,{
                params: this.searchLists
            }).then((res)=>{
                if(res.data.code === 1){
                    that.collapseName = Array.from(new Array(res.data.data.list.length).keys())
                    that.collapseShowData = []
                    that.tableData = res.data.data.list
                    that.total = res.data.data.total
                }else{
                    that.overdueOperation(res.data.code, res.data.msg);
                }
                // console.log(that.getSet)
                that.loading = false;
            }).catch((err)=>{
                // console.log(err);
                this.$message({
                    message: err,
                    type: 'error'
                });
                that.loading = false;
            })
        },
        // 左侧导航切换
        handlAdhibition(key){
            
            let itemData = this.adhibitionArr.find((e)=>{
                return e.value === key
            })
            this.dataType = itemData.type
            // dataType
            this.searchLists = {
                page: 1,
                page_size: 15
            }
            this.searchFn()
        },
        sizeChange(val){
            this.searchLists.page_size = val
            this.searchFn(this.searchLists.page)
        },
        // 查看反馈
        toDetailFn(data){
            console.log(data)
            data.typeData = this.typeData
            this.$hfBus.$emit("addnewtabs",{
                tab: {
                    app_name: "【历史反馈】" + data.type_text,
                    app_id: "FeedbackDetail" + data.id,
                    type: "FeedbackDetail"
                },
                data: data
            })
        }
    },
    mounted (){
        // 获取问题类型的数据
        let that = this;
        that.loading = true;
        this.$axios.get("/custom/feed/problem").then((res)=>{
            if(res.data.code === 1){
                console.log(res.data.data)
                that.typeData = res.data.data
            }else{
                that.overdueOperation(res.data.code, res.data.msg);
            }
            // console.log(that.getSet)
            that.loading = false;
        }).catch((err)=>{
            // console.log(err);
            this.$message({
                message: err,
                type: 'error'
            });
            that.loading = false;
        })
        // 挂载之后执行
        that.adhibitionArr = [
            {
                name: "我要反馈",
                value: "1",
                type: "edit"
            },
            {
                name: "我的反馈问题",
                value: "2",
                type: "list"
            }
        ]
        that.dataType = "edit"
        // that.searchFn()
    },
}
</script>
<style lang="less" scoped>
.enterprise-box{
    .content{
        height: calc(100% - 42px);
        overflow-y: auto;
        .feedback-content{
            max-width: 650px;
        }
        .feedback-lists{
            max-height: calc(100% - 40px);
            overflow-y: auto;
            // padding-top: 20px;
            .feedback-item{
                border-bottom: 1px solid #ECEFF4;
                font-size: 16px;
                line-height: 24px;
                padding: 20px 0 10px;
                .detail{
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .mark{
                    width: 48px;
                    height: 30px;
                    border-radius: 5px;
                    color: #fff;
                    font-size: 14px;
                    line-height: 30px;
                    text-align: center;
                    margin: 4px 10px 0 0;
                }
                .question{
                    .mark{
                        background: linear-gradient(0deg,#fc9600 0%, #fb5b1e 100%);
                    }
                }
                .answer{
                    margin-top: 12px;
                    color: #8C8C8C;
                    .mark{
                        background: linear-gradient(0deg,#52d48e 0%, #30bc5d 100%);;
                    }
                }
                .info{
                    margin-top: 4px;
                    font-size: 14px;
                    line-height: 40px;
                    color: #8C8C8C;
                    display: flex;
                    justify-content: space-between;
                }
            }
        }
    }
    .el-pagination{
        text-align: center;
        margin-top: 10px;
        .el-pagination__sizes{
            display: none;
        }
    }
    .tac{
        overflow-y: auto;
    }
    .enterprise-right{
        overflow: initial!important;
    }
}

</style>
