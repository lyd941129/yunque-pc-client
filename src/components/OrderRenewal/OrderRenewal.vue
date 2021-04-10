<template>
    <div class="personnelmanagement">
        

		<div class="table-box">
            <grid-manager :option="gridOption" :callback="callback" ref="grid"></grid-manager>
       <!--      <table class="hf-table">
                <thead>
                    <th>订单详情</th>
                    <th>办理人</th>
                    <th>金额</th>
                    <th>状态</th>
                    <th>操作</th>
                </thead>
                <tbody>
                    <template v-for="(item,index) in tableData">
                        <tr :key="index">
                            <td colspan="5">
                                <div>{{item.create_time}}</div>
                                <div>订单号 : {{item.order_no}}</div>
                            </td>
                        </tr>
                        <tr :key="index">
                            <td>{{item.subject}}</td>
                            <td>{{item.user_name}}</td>
                            <td>{{item.pay_price}}</td>
                            <td>{{item.pay_status}}</td>
                            <td>去办理</td>
                        </tr>
                    </template>
                </tbody>
            </table> -->
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
/*         tableData(){
            debugger
            return fetch(this.searchFn()).then((res)=>{
                console.log(res)
            })
        } */
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
            // 表格数据
            tableData: [
                {
                    "id": "228821470728445953",
                    "user_name": "张三",
                    "order_no": "20210312101449728445952",
                    "subject": "云雀-软件续费+增值服务",
                    "pay_price": "0.03",
                    "pay_type": "alipay",
                    "pay_status": 2,
                    "transaction_id": "2021031222001443321401788040",
                    "invoice_log_id": "",
                    "remark": "",
                    "create_time": "2021-03-12 10:14:49",
                    "items": [
                        {
                            "id": "228821470745223168",
                            "order_id": "228821470728445953",
                            "serve_name": "软件续费",
                            "packages_type": 1,
                            "packages_name": "三个月",
                            "price": "0.01",
                            "duration": 3
                        },
                        {
                            "id": "228821470753611776",
                            "order_id": "228821470728445953",
                            "serve_name": "增值服务",
                            "packages_type": 2,
                            "packages_name": "短信套餐",
                            "price": "0.01",
                            "duration": 1000
                        },
                        {
                            "id": "228821470762000384",
                            "order_id": "228821470728445953",
                            "serve_name": "增值服务",
                            "packages_type": 3,
                            "packages_name": "发票识别",
                            "price": "0.01",
                            "duration": 1000
                        }
                    ]
                }
            ],
            
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
                            return `<div>${e}</div>${row.items.map((v,i)=>{
                                return `
                                    <div>
                                        ${v.packages_type === 1 ? v.serve_name : v.packages_name}
                                        --
                                        ${v.duration_text}
                                        --
                                        ${v.price}元
                                    </div>
                                `
                            }).join("")}`
                        }
                    },{
                        key: 'user_name',
                        text: '办理人',
                        align: 'center',
                    },{
                        key: 'pay_price',
                        text: '金额（元）',
                        align: 'center',

                        // template=> string dom
                        // template: `<span style="color: red">跟据相关法规，该单元格被过滤</span>`
                    },{
                        key: 'pay_status',
                        text: '状态',
                        align: 'center',
                        template(e,row){
                            return `
                                ${e === 1 ? '<div class="green">未付款</div>' : 
                                e === 2 ? row.invoice_log_id ? '<div class="red">已开票</div>' : '<div class="">未开票</div>' :
                                '<div class="gray">已退款</div>'}
                            `
                        }
                    },{
                        key: 'hf-operate',
                        text: '操作',
                        align: 'center',
                        template(e,row) {
                            return `
                            <div class="operate-btn blue">
                                <span v-if="${Boolean(row.invoice_log_id)}">查看发票</span>
                                <span v-else-if="${row.pay_status === 2}">申请发票</span>
                                <span v-else-if="${row.pay_status === 1}">去付款</span>
                                <span v-if="${row.pay_status === 1 || row.pay_status === 3}" class="red">删除订单</span>
                                
                            </div>
                               
                            `;
                        }
                    },
             /*        {
                        key: 'action',
                        text: '操作',
                        width: '100px',
                        align: 'center',

                        // template=> function: return vue template
                        // vue模版中将自动添加row字段，该字段为当前行所使用的数据
                        // vue模版将不允许再使用template函数中传入的参数
                        template:() => {
                            return '<el-button size="mini" type="danger" @click="delRelation(row)">解除绑定</el-button>';
                        }
                    } */
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
                    this.selectedCheck(rowList);
                },
            }
        }
    },
    methods: {
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
                    // that.tableData = res.data.data.list
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
	.personnelmanagement{
		height: 100%;
		.table-box {
			height: calc(100% - 104px);
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
            .operate-btn span{
                margin: 0 10px;
                cursor: pointer;
            }
            thead{
                background-color: #F5F5F5;
            }
            .hf-tr{
                height: 103px;
            }
            .red{
                color: #F5222D;
            }
            .blue{
                color: #1890FF
            }
            .gray{
                color: #DDDDDD;
            }
            .green{
                color: #00bb78;
            }
        }

    }
</style>