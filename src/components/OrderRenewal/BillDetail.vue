<template>
  <div class="bill-box">
      <div class="bill-status">
        <el-steps :active="billStatus" :align-center="true" finish-status="success">
            <el-step title="订单下单" description=""></el-step>
            <el-step title="订单完成" description=""></el-step>
            <el-step title="发票开具" description=""></el-step>
        </el-steps>
      </div>
      <div class="bill-content">
          <hf-title title="订单详情"></hf-title>
          <div class="order-detail">
            <el-table ref="multipleTable" :border='true' :data="itemData.subData.order" tooltip-effect="dark" style="width: 100%"
            :select-on-indeterminate='false'>

                <el-table-column label="订单状态" prop="pay_status" align="center">
                    <template slot-scope="scope">
                        <div>{{detailFn("pay_status",scope.row.pay_status)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="订单编号" prop="order_no" align="center"></el-table-column>
                <el-table-column label="下单时间" prop="create_time" align="center"></el-table-column>
            </el-table>
          </div>
          <hf-title title="发票信息"></hf-title>
          <div class="bill-detail">
              <ul>
                  <li class="dis-flex" v-for="item in billData" :key="item.params">
                      <div class="label">{{item.title}}</div>
                      <div class="info average">{{detailFn(item.params,itemData.subData[item.params])}}</div>
                  </li>
                  <template v-if="itemData.subData.out_type === 1">
                    <li class="dis-flex" v-for="item in mailData" :key="item.params">
                        <div class="label">{{item.title}}</div>
                        <div class="info average">{{detailFn(item.params,itemData.subData[item.params])}}</div>
                    </li>
                  </template>
              </ul>
          </div>
          <div class="bill-img" v-if="itemData.subData.out_type === 2">
                <el-table ref="multipleTable" :border='true' :data="[itemData.subData]" tooltip-effect="dark" style="width: 100%"
                :select-on-indeterminate='false'>
                    <el-table-column label="发票代码" prop="invoice_code" align="center"></el-table-column>
                    <el-table-column label="发票号码" prop="invoice_number" align="center"></el-table-column>
                    <el-table-column label="在线查看" prop="invoice_url" align="center">
                        <template slot-scope="scope">
                            <el-link :href="scope.row.invoice_url" type="primary" target="_blank">查看发票</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="下单时间" prop="create_time" align="center"></el-table-column>
                    <el-table-column label="操作" prop="user_email" align="center">
                         <template slot-scope="scope">
                            <el-button size="mini" type="danger" plain @click="sendMailFn(scope.row)">发送邮箱</el-button>
                        </template>
                        
                    </el-table-column>
                </el-table>
          </div>
      </div>

  </div>
</template>


<script>
import {moneyFormat} from '../../common/mixin/moneyFormat'
import HfTitle from './HfTitle'
export default {
  props: {
      itemData:{}
  },
  mixins: [moneyFormat],
  components: {
      HfTitle
  },
  data() {
    return {
        orderDetail: [
            {
                title: "订单状态",
                params: "pay_status"
            },
            {
                title: "订单编号",
                params: "order_no"
            },
            {
                title: "下单时间",
                params: "create_time"
            }
        ],
        billData: [
            {
                title: "发票类型",
                params: "out_type"
            },
            {
                title: "发票状态",
                params: "status"
            },
            {
                title: "发票抬头",
                params: "title_name"
            },
            {
                title: "公司税号",
                params: "tax_number"
            }
        ],
        mailData: [
            {
                title: "收件人",
                params: "user_name"
            },
            {
                title: "收件人电话",
                params: "user_phone"
            },
            {
                title: "邮寄地址",
                params: "user_region"
            },
            {
                title: "详细地址",
                params: "user_address"
            },
            {
                title: "开票时间",
                params: "create_time"
            },
            {
                title: "快递",
                params: ""
            },
        ]
    };
  },
  computed: {
      // 当前步骤
      billStatus(){
          return this.itemData.invoice_log_id ? 3 : 2
      },
      // 订单详情和发票信息渲染
      detailFn(){
          return function(type,data){
              let text = "";
            switch (type) {
                case "pay_status":
                    text = data === 1 ? "未付款" : data === 2 ? "已付款" : "已退款"
                    break;
                case "out_type":
                    text = data === 1? "纸质发票" : "电子发票"
                    break
                case "status":
                    text = data === 1 ? "申请中" : "已开票"
                    break;
                default:
                    text = data
                    break;
            }
            return text;
          }
          
      }
  },
  methods: {
      // 发送邮箱
      sendMailFn(row){
        console.log(row)
        this.$prompt('请输入邮箱', '提示', {
          inputValue: row.user_email,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          // 进行发送
          this.$message({
            type: 'success',
            message: '你的邮箱是: ' + value
          });
        }).catch(() => {

        });
      }
  },
  mounted(){
      console.log(this.itemData)
  }
};
</script>

<style scoped lang="less">
.bill-box {
  height: 100%;
  background-color: #fff;
  font-size: 16px;
  overflow-y: auto;
  .bill-status{
      width: 50%;
      margin: 0 auto;
  }
  .bill-content{
      width: 900px;
      margin: 30px auto;
      .order-detail{
          margin: 10px 0 20px
      }
      .bill-detail{
          margin-bottom: 20px;
          ul{
              padding: 0;
              li{
                  border: 1px solid #eaf8ff;
                  &:not(:first-of-type){
                    margin-top: -1px;
                  }
              }
              .label{
                  padding: 10px;
                  width: 120px;
                  font-weight: bold;
                  border-right: 1px solid #eaf8ff;
              }
              .info{
                  padding: 10px;
              }
          }
          
      }
  }
}

.money {
  font-size: 22px;
  line-height: 22px;
  font-weight: bold;
}
.red {
  color: #e31613;
}
.gray {
  color: #8c8c8c;
}
.blue {
  color: #1890ff;
}
</style>