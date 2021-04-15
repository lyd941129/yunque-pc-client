<template>
    <div class="order-box">
        
		<el-row>
			<el-button type="primary" class="btn-blue" @click="sendFn">批量开票</el-button>
		</el-row>
		<div class="table-box">
            <grid-manager :option="gridOption" :callback="callback" ref="grid"></grid-manager>
		</div>
        <el-pagination @current-change="searchFn" :current-page="searchLists.page" @size-change="sizeChange"
		:page-size="searchLists.page_size" :page-sizes="pageSizes" layout="sizes, total, prev, pager, next, jumper" :total="total">
		</el-pagination>
    </div>
</template>


<script>
import GridManager from 'gridmanager-vue';
import 'gridmanager-vue/css/gm-vue.css';
export default {
    props: {

    },
    components: {
        GridManager
    },
    computed: {

    },
    data(){
        return {
            // 总数
            total: 0,
            // 列表查询数据
            searchLists: {
                dict_type: "", // 查询的类型
                page: 1,
                page_size: 15,
                dict_label: "", // 查询的值
            },
            // 翻页的数组
            pageSizes: [15,30,50,100],
            
            // 表格渲染回调函数
            // query为gmOptions中配置的query
            callback: function(query) {
                console.log('callback => ', query);
            },

            // 表格
            gridOption: {
                // 表格唯一标识
                gridManagerName: 'girdTable',
                // 禁用边框线
                disableBorder: true,
                // 高度
                height: '100%',
                // 首次是否加载
                firstLoading: true,
                // 通栏配置
                fullColumn: {
                    // 行间隔,默认为0
                    interval: 20,
                    // 模板
                    topTemplate(row){
                        return '<div class="tr-banner">'
                                + '<span>'
                                + row.create_time
                                + '</span>'
                                + '<span>'
                                + row.order_no
                                + '</span>'
                                +'</div>';
                    }
                },
                // 单行数据渲染时执行
                rowRenderHandler(row){
                    // 只有支付且未开票的可以开票
                    row.gm_checkbox_disabled = Boolean(row.pay_status !== 2 || row.invoice_log_id)
                    row.gm_row_class_name = "hf-tr"
                    return row
                },
                // 列配置
                columnData: [
                    {
                        key: 'subject',
                        align: 'center',
                        text: '订单详情',
                        align: 'center',
                        template(e,row){
                            return `<div class="order-subject"><div>${e}</div>${row.items.map((v,i)=>{
                                return `
                                    <div>
                                        ${v.packages_type === 1 ? v.serve_name : v.packages_name}
                                        ,
                                        ${v.duration_text}
                                        ,
                                        ${v.price}元
                                    </div>
                                `
                            }).join("")}</div>`
                        }
                    },{
                        key: 'user_name',
                        text: '办理人',
                        align: 'center',
                    },{
                        key: 'pay_price',
                        text: '金额（元）',
                        align: 'center',
                        template(e,row){
                            return `
                                <div class="pay-price">${e}</div>
                                <div class="gray" v-if="${row.pay_status === 2}">在线支付</div>
                            `
                        }
                    },{
                        key: 'pay_status',
                        text: '状态',
                        align: 'center',
                        template(e,row){
                            return `
                            ${e === 1 ? '<div class="yellow">未付款</div>' : e === 2 ? '<div class="green">已付款</div>' : '<div class="gray">已退款</div>'}
                            ${row.invoice_log_id ? '<div class="red">已开票</div>' : e === 2 ? '<div class="">未开票</div>' : ''}
                            `
                        }
                    },{
                        key: 'hf-operate',
                        text: '操作',
                        align: 'center',
                        template(e,row) {
                            return `
                            <ul class="operate-btn blue">
                                <li v-if="Boolean(row.invoice_log_id)">
                                    <span @click="operateFn(1,row)">查看发票</span>
                                </li>
                                <li v-else-if="row.pay_status === 2">
                                    <span @click="operateFn(2,row)">申请发票</span>
                                </li>
                                <li v-else-if="row.pay_status === 1">
                                    <span @click="operateFn(3,row)">去付款</span>
                                </li>
                                <li v-if="row.pay_status === 1 || row.pay_status === 3" class="gray">
                                    <span class="font-min" @click="operateFn(4,row)">删除订单</span>
                                </li>
                            </ul>
                            `;
                        }
                    },
                ],
                skinClassName: "grid-table",
                // 自动序号
                supportAutoOrder: false,
                // 禁用右键功能
                supportMenu: false,
                // 禁用拖拽
                supportDrag: false,
                // 使用分页
                supportAjaxPage: false,
                // 数据来源，类型: string url || data || function return[promise || string url || data]
                ajaxData(){
                    return {
                        data: []
                    }
                },
                // 请求失败后事件
                ajaxError: err => {
                    console.log(err);
                },

                // checkbox选择事件
                checkedAfter: rowList => {
                    // this.selectedCheck(rowList);
                },
            }
        }
    },
    methods: {
        // 操作里面的按钮type: 1查看、2申请、3去支付(订单详情)、4删除
        operateFn(type,data){
            console.log(type)
            console.log(data)
            let url = "";
            switch (type) {
                case 1:
                    url = "/custom/invoice/detail"
                    break;
                case 2:
                    url = "/custom/invoice/apply"
                    break;
                case 3:
                    url = "/custom/order/detail"
                    break;
                case 4:
                    url = "/custom/order/cancel"
                    break;
                default:
                    break;
            }
            let option = {
                id : order_no
            }
            return
            this.$axios.post(url,option, {
                headers: {
                    'content-type': 'application/json',
                    "token": that.loginData.token  //token换成从缓存获取
                }
            }).then(res => {
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
        // 批量开票
        sendFn(item){
            // 申请发票
          let checkData = GridManager.getCheckedData('girdTable');
          if(!checkData.length){
              this.$message.error('请至少勾选一项');
              return
          }
          console.log(checkData)
        },
        // 解除绑定
        delRelation: function(row) {
            // ... 解除绑定操作
        },

        // 检索区域确认筛选
        onScreen(e){
            this.searchFn()
        },
        // 列表查询
        searchFn(size){
            // GridManager.setAjaxData('girdTable', );
            let that = this,
                url = "/custom/order/index";
                console.log(size)
            this.searchLists.page = size || 1
            this.$axios.get(url,{
                headers: {
					'content-type': 'application/json',
					"token": that.loginData.token  //token换成从缓存获取
				},
                params: this.searchLists
            }).then((res)=>{
                if(res.data.code === 1){
                    GridManager.setAjaxData('girdTable', {data: res.data.data.list});
                    that.total = res.data.data.total
                }else{
                    that.overdueOperation(res.data.code, res.data.msg);
                }
                // console.log(that.getSet)
                this.loading = false;
            }).catch((err)=>{
                // console.log(err);
                this.loading = false;
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

<style scoped lang="less">
	.order-box{
		height: 100%;
		.table-box {
			height: calc(100% - 104px);
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


    /deep/ .grid-table{
        border-bottom: #ebeef5 1px solid;
        table[grid-manager]{
            margin-top: -20px!important;
            .table-header{
                border-bottom: 0;
            }
            .tr-banner{
                background-color: #EAF8FF;
                height: 38px;
                line-height: 38px;
                font-size: 14px;
                color: #333;
                span{
                    padding: 0 70px 0 20px
                }
            }
            .full-column-div,
            tr,
            td{
                border-color: #EAF8FF!important;
            }
            th,
            thead tr,
            [full-column-interval] td {
                border-right: none;
            }
            .operate-btn li{
                text-align: center;
                span{
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 26px;
                    &.font-min{
                        font-size: 14px;
                        line-height: 24px;
                    }
                }
            }
            thead{
                background-color: #F5F5F5;
            }
            .hf-tr{
                height: 103px;
                font-size: 16px;
            }
            .order-subject{
                line-height: 28px;
                white-space: initial;
                text-align: left;
            }
            .pay-price{
                color: #FAAD14;
                font-weight: bold;
            }
            .red{
                color: #F5222D;
            }
            .blue{
                color: #1890FF
            }
            .gray{
                color: #A6A6A6;
            }
            .green{
                color: #00bb78;
            }
            .yellow{
                color: #FF9813;
            }
        }

    }
</style>