<!-- 系统助手 -->
<template>
    <div class="enterprise-box dis-flex" v-loading="loading">
        <el-row class="tac">
			<el-col :span="12">
				<el-menu :default-active="adhibitionArr[0].value" class="el-menu-vertical-demo" @select="handlAdhibition">
					<el-menu-item v-for="(item, index) in adhibitionArr" :index="item.value" :key="index">
						<span slot="title">{{item.name}}</span>
					</el-menu-item>
				</el-menu>
			</el-col>
		</el-row>
        <div class="enterprise-right">
            <el-row class="table-box content" :class="dataType + '-content'" :gutter="20">
                <template v-if="dataType === 'video'">
                    <el-col class="item-video" v-for="(item,index) in tableData" :key="index" :span="6">
                        <!-- <my-video :sources="sources" :option="options"></my-video> -->
                        <div class="cursor-p" @click="playVideoFn(item)">
                            <el-image :src="item.cover_image" :alt="item.title" fit="cover"></el-image>
                             <div class="title">
                                {{item.title}}
                            </div>
                        </div>
                    </el-col>
                </template>
                <template v-else-if="dataType === 'pic'">
                    <div @click="detailTabFn(item)" class="item-pic" v-for="(item,index) in tableData" :key="index">
                        <el-image :src="item.cover_image" :alt="item.title" fit="cover"></el-image>
                        <div class="time">
                            <div class="time-top">09-20</div>
                            <div class="time-bottom">2020</div>
                        </div>
                        <div class="info">
                            <div class="title">
                                {{item.title}}
                            </div>
                            <div class="brief-info">
                                {{item.description}}
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <el-collapse v-model="collapseShowData">
                        <el-collapse-item class="item-text" v-for="(item,index) in tableData" :key="index" :name="collapseName[index]">
                            <template slot="title">
                                <div class="dis-flex title-block">
                                    <i class="icon icon-add-mark mark-count">Q{{index + 1}}</i>
                                    <div class="title">{{item.title}}</div>
                                    <span class="show-hide">{{showHide(collapseName[index])}}</span>
                                </div>
                            </template>
                            <div class="collapse-content">
                                {{item.content}}
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </template>
            </el-row>
            <el-pagination @current-change="searchFn" :current-page="searchLists.page" @size-change="sizeChange"
            :page-size="searchLists.page_size" :page-sizes="pageSizes" layout="sizes, total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <!-- 弹框 -->
        <el-dialog class="only-body" title="视频播放" :visible.sync="videoDialog" center width='800px' :close-on-click-modal="false">
            <my-video v-if="videoDialog" class="my-video" :sources="sources" :option="options"></my-video>
        </el-dialog>
    </div>
</template>
<script>
import myVideo from 'vue-video'
export default {
    props: {
		itemData: {},
        editableTabs: {},
        editableTabsValue: {},
    },
    components: {
        myVideo
    },
    data() {
        return {
            loading: false,
            // video播放弹框
            videoDialog: false,
            // video组件配置
            sources: [
                {
                    src: "http://vjs.zencdn.net/v/oceans.mp4"
                }
            ],
            // video配置
            options: {
                // autoplay
                autoplay: true,
                // default volume
                volume: 0.6,
                // poster (cover image)
                poster: ''
            },
            // 数据类型
            dataType: "video",
            // 左侧导航数据
            adhibitionArr: [
                {
                    name: "视频资料",
                    value: "1",
                    type: "video"
                },
                {
                    name: "图文资料",
                    value: "2",
                    type: "pic"
                },
                {
                    name: "常见问题",
                    value: "3",
                    type: "text"
                }
            ],
            // 总数
            total: 0,
            // 列表查询数据
            searchLists: {
                type: 1,
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
        getLocalTime: function() {// 时间转化
            return function(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            }
        },
        // 常见问题=》shou | hide
        showHide(){
            let that = this;
            return (name)=>{
                let text = "展开答案"
                if(~that.collapseShowData.indexOf(name)){
                    text = "收起答案"
                }
                return text
            }
        },
    },
    methods: {
        // 图文资料=》打开详情页签
        detailTabFn(item){
            let that = this;
            that.loading = true;
            that.$axios.get("/custom/help/detail",{
                params: {
                    id: item.id
                }
            }).then((res)=>{
                if(res.data.code === 1){
                    that.$hfBus.$emit("addnewtabs",{
                        tab: {
                            app_name: "【图文资料】" + item.title,
                            app_id: "HelpDetail" + item.id,
                            type: "HelpDetail"
                        },
                        data: res.data.data
                    })
                }else{
                    that.overdueOperation(res.data.code, res.data.msg);
                }
                that.loading = false;
            }).catch((err)=>{
                this.$message({
                    message: err,
                    type: 'error'
                });
                that.loading = false;
            })
        },
        // 列表查询
        searchFn(size){
            let that = this,
                url = "/custom/help/index";
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
                type: key,
                page: 1,
                page_size: 15
            }
            this.searchFn()
        },
        sizeChange(val){
            this.searchLists.page_size = val
            this.searchFn(this.searchLists.page)
        },
        // 播放视频
        playVideoFn(item){
            console.log(item)
            this.videoDialog = true
            return
            this.options.poster = item.cover_image
            this.sources[0].src = item.content

        }
    },
    mounted (){
        // 挂载之后执行
        this.searchFn()
    }
}
</script>
<style lang="less" scoped>
.enterprise-box{
    .content{
        height: calc(100% - 42px);
        overflow-y: auto;
        &.video-content{
            .item-video{
                .el-image{
                    height: 125px;
                    width: 100%;
                    border-radius: 5px;
                }
                .title{
                    padding: 5px 10px;
                    font-size: 16px;
                    line-height: 26px;
                    color: #333;
                }
            }
        }
        &.pic-content{
            .item-pic{
                display: flex;
                margin-bottom: 20px;
                .el-image{
                    height: 100px;
                    width: 174px;
                    border-radius: 5px;
                }
                .time{
                    display: flex;
                    flex-direction: column;
                    padding: 24px 40px;
                    .time-top{
                        font-size: 24px;
                        height: 24px;
                        line-height: 24px;
                        margin-bottom: 12px;
                    }
                    .time-bottom{
                        font-size: 16px;
                        height: 16px;
                        line-height: 16px;
                    }
                }
                .info{
                    flex: 1;
                    .title{
                        font-size: 18px;
                        height: 18px;
                        line-height: 18px;
                        margin-bottom: 7px;
                    }
                    .brief-info{
                        font-size: 16px;
                        line-height: 25px;
                        color: #808080;
                        padding-right: 38px;
                    }
                }
            }
        }
        &.text-content{
            .item-text{
                margin-bottom: 36px;
                .title-block{
                    height: 28px;
                    line-height: 28px;
                    .mark-count{
                        color: #fff;
                        font-size: 14px;
                        text-align: center;
                        cursor: initial;
                        margin: 0px 18px;
                    }
                    .title{
                        font-size: 18px;
                    }
                    .show-hide{
                        color: #a6a6a6;
                        margin-left: 90px;
                    }
                }
                /deep/ .el-collapse-item__arrow{
                    height: 28px;
                    line-height: 28px;
                    margin: 0;
                    color: #a6a6a6;
                }
                /deep/ .el-collapse-item__wrap{
                    border: none;
                    .el-collapse-item__content{
                        padding-bottom: 0;
                    }
                }
                .collapse-content{
                    padding: 0 44px 0 70px;
                    font-size: 16px;
                    color: #808080;
                    line-height: 25px;
                }
                
            }
            .el-collapse{
                border: none;
                /deep/ .el-collapse-item__header{
                    border: none;
                    height: auto;
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
    .only-body{
        /deep/ .el-dialog__header{
            display: none;
        }
        /deep/ .el-dialog__body{
            padding: 0;
        } 
        .my-video{
            width: 100%;
            height: 100%;
            // overflow: initial;
            overflow: initial!important;
            /deep/ .__cov-contrl-video-time{
                white-space: nowrap;
            }
        }
    }
}

</style>
