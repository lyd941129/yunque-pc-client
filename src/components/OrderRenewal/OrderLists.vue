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
        <!-- 弹框 -->
        <el-dialog class="max-dialog" :title="dalogTitle" :visible.sync="centerDialogVisible" center width='530px'>
            <el-form :model="editData" :validate-on-rule-change="false" :rules="rules" ref="form" label-width="135px">
                <el-form-item label="开票类型" prop="out_type">
                    <el-radio-group v-model="editData.out_type">
                        <el-radio :label="1">纸质发票</el-radio>
                        <el-radio :label="2">电子发票</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="公司抬头" prop="title_name">
                    <el-input v-model="editData.title_name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="公司税号" prop="tax_number">
                    <el-input v-model="editData.tax_number" autocomplete="off" clearable></el-input>
                </el-form-item>
                <div v-show="editData.out_type === 2">
                    <el-form-item label="邮箱" prop="user_email">
                        <el-input v-model="editData.user_email" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="user_mobile">
                        <el-input v-model="editData.user_mobile" autocomplete="off" clearable></el-input>
                    </el-form-item>
                </div>
                <div v-show="editData.out_type === 1">
                    <el-form-item label="收件人" prop="user_name">
                        <el-input v-model="editData.user_name" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="收件人电话" prop="user_phone">
                        <el-input v-model="editData.user_phone" autocomplete="off" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="邮寄地址" prop="user_region">

                        <el-cascader
                            placeholder="地址选择"
                            :options="distData"
                            filterable
                            v-model="editData.user_region"
                            class="dist-style"
                        >
                            
                        </el-cascader>


                    </el-form-item>
                    <el-form-item label="邮寄详细地址" prop="user_address">
                        <el-input v-model="editData.user_address" autocomplete="off" clearable></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="开户银行" prop="bank_name">
                    <el-input v-model="editData.bank_name" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="开户账号" prop="bank_account">
                    <el-input v-model="editData.bank_account" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="单位地址" prop="address">
                    <el-input v-model="editData.address" autocomplete="off" clearable></el-input>
                </el-form-item>
                <el-form-item label="单位电话" prop="phone">
                    <el-input v-model="editData.phone" autocomplete="off" clearable></el-input>
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" class="btn-dialog" @click="createAn('form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script>
import GridManager from 'gridmanager-vue';
import 'gridmanager-vue/css/gm-vue.css';
import distData from './../../../static/js/city/dist'
export default {
    props: {
        itemData:{}
    },
    components: {
        GridManager
    },
    computed: {
        // 验证
        rules(){
            return {
                title_name: [{
                    required: true,
                    message: '请正确输入【公司抬头】',
                    trigger: 'blur'
                }],
                tax_number: [{
                    required: true,
                    message: '请正确输入【公司税号】',
                    trigger: 'blur'
                }],
                user_email: [{
                    required: this.editData.out_type === 2,
                    message: '请正确输入【电子邮箱】',
                    trigger: 'blur'
                }],
                user_mobile: [{
                    required: this.editData.out_type === 2,
                    message: '请正确输入【手机号码】',
                    trigger: 'blur'
                }],
                user_name: [{
                    required: this.editData.out_type === 1,
                    message: '请正确输入【收件人】',
                    trigger: 'blur'
                }],
                user_phone: [{
                    required: this.editData.out_type === 1,
                    message: '请正确输入【收件人电话】',
                    trigger: 'blur'
                }],
                user_region: [{
                    required: this.editData.out_type === 1,
                    message: '请正确选择【邮寄地址】',
                    trigger: 'blur'
                }],
                user_address: [{
                    required: this.editData.out_type === 1,
                    message: '请正确输入【详细地址】',
                    trigger: 'blur'
                }]
            }
        }
    },
    data(){
        return {
            distData: [],
            // 开票的数据
            editData: {
                out_type : 2, //  int	开票类型：1纸质发票，2电子发票
                title_name : "", //	string	公司抬头
                tax_number : "", // string	公司税号
                order_ids : [], // array	开具发票的订单id
                bank_name : "", // string	开户银行 选填
                bank_account : "", // string	开户账号 选填
                address : "", // string	单位地址 选填
                phone : "", // 单位电话 选填
                user_email : "", // string	电子发票 邮箱
                user_mobile : "", // string	电子发票 手机号
                user_name : "", // string	纸质发票 收件人
                user_phone : "", // string	纸质发票 收件人电话
                user_region : [], // array	纸质发票邮寄地址 地区码
                user_address : "", // string	纸质发票 详细地址
            },
            // 弹框显示
            centerDialogVisible: false,
            // 弹框标题
            dalogTitle: "",
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
                                + '<span>订单号 : '
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
        // 开票数据初始化
        billInitFn(){
            this.editData = {
                out_type : 2, //  int	开票类型：1纸质发票，2电子发票
                title_name : "", //	string	公司抬头
                tax_number : "", // string	公司税号
                order_ids : [], // array	开具发票的订单id
                bank_name : "", // string	开户银行 选填
                bank_account : "", // string	开户账号 选填
                address : "", // string	单位地址 选填
                phone : "", // 单位电话 选填
                user_email : "", // string	电子发票 邮箱
                user_mobile : "", // string	电子发票 手机号
                user_name : "", // string	纸质发票 收件人
                user_phone : "", // string	纸质发票 收件人电话
                user_region : [], // array	纸质发票邮寄地址 地区码
                user_address : "", // string	纸质发票 详细地址
            }
        },
        
        // 开票确定
        createAn(formName){
            let that = this;
            that.$refs[formName].validate((valid)=>{
                if(valid){
                    this.operatePostFn(2,{
                        url: "/custom/invoice/apply",
                        option: this.editData
                    })
                }else{
                    return false
                }
            })
        },
        /* 操作里面的按钮
        type: 1查看、2申请、3去支付(订单详情)、4删除
        data: 当前行数据
        sendData: 发送的数据(外部按钮操作调用这个方法时会传该参数)
        */
        operateFn(type,data,sendData){

            let url = "",
                option = {};
            switch (type) {
                case 1:
                    url = "/custom/invoice/detail"
                    this.$axios.get(url,{
                        params: {
                            id: data.invoice_log_id
                        }
                    }).then((res)=>{
                        if(res.data.code === 1){
                            
                            this.$hfBus.$emit("addnewtabs",{
                                tab: {
                                    app_name: "发票详情",
                                    app_id: "BillDetail",
                                    type: "BillDetail"
                                },
                                data: res.data.data
                            })
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
















                    break;
                case 2:
                    this.billInitFn()
                    this.dalogTitle = "申请发票"
                    this.editData.order_ids = sendData ? sendData : [data.id]
                    this.centerDialogVisible = true
                    break;
                case 3:
                    // url = "/custom/order/detail"
                    this.$hfBus.$emit("addnewtabs",{
                        tab: {
                            app_name: "订单付款",
                            app_id: "OrderPay",
                            type: "OrderPay"
                        },
                        data: data
                    })
                    break;
                case 4:
                    // 删除
                    url = "/custom/order/del"
                    option.order_id = data.id
                    this.$confirm('确认删除订单吗？','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.operatePostFn(type,{
                            url: url,
                            option: option
                        })

                    }).catch(err => {
                        
                    });
                    break;
                default:
                    break;
            }
            
        },
        operatePostFn(type,Data){
            this.$axios.post(Data.url,Data.option).then(res => {
                if(res.data.code === 1){
                    // 刷新
                    switch (type) {
                        case 1:
                            // 查看
                            break;
                        case 2:
                            // 申请
                            this.centerDialogVisible = false
                            this.searchFn()
                            break;
                        case 3:
                            // 去支付
                            break;
                        case 4:
                            // 删除
                            this.searchFn()
                            break;
                        default:
                            break;
                    }
                    
                }else{
                    this.overdueOperation(res.data.code, res.data.msg);
                }
            }).catch(err => {
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
          let arr = []
          checkData.map((v)=>{
              arr.push(v.id)
          })
            this.operateFn(2,null,arr)
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
                params: this.searchLists
            }).then((res)=>{
                if(res.data.code === 1){
                    GridManager.setAjaxData('girdTable', {data: res.data.data.list});
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
        this.distData = distData.distData
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
        .dist-style{
            display: block;
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