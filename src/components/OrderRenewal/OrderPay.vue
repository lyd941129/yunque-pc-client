<template>
  <div class="pay-box">
    <div class="pay-container">
      <div class="pay-top dis-flex">
        <div class="pay-top-left average">
          <div class="tip">订单提交成功，请尽快付款！订单号 : {{itemData.subData.order_no}}</div>
              <div v-show="countDown" class="">
                  请您在<span class="red">{{countDown}}</span>内完成支付，否则订单会被自动取消。
              </div>
        </div>
        <div class="pay-top-right gray">
          <div class="for-money">
            应付金额 : <span class="money red">{{moneyFormat(itemData.subData.pay_price)}}</span>元
          </div>
          <div class="detail-title blue" @click="showDetail = !showDetail">
            订单详情<i :class="['el-icon-arrow-down',{'active': showDetail}]"></i>
          </div>
        </div>
      </div>
      <div :class="['order-detail', { active: showDetail }]">
        {{orderDetail}}
      </div>
      <div class="pay-content">
        <div v-if="showLists" class="bank-lists">
          <div
            v-for="(item,index) in bankLists"
            :key="index"
            class="bank-lists-item dis-flex"
          >
            <el-checkbox @change="checkBankFn(index)" :checked="isChecked(index)"></el-checkbox>
            <div class="bank-icon" @click="checkBankFn(index)">
                <i :class="[{'icon': item.icon},item.icon]"></i>
                <span>{{item.name}}</span>
            </div>
            
            <div class="bank-tip average">{{ item.type }}({{ item.no }})</div>
            <div v-show="isChecked(index)" class="for-money gray">
              应付金额 : <span class="money red">{{moneyFormat(itemData.subData.pay_price)}}</span>元
            </div>
          </div>
        </div>
        <div class="add-bank">
            <el-button type="text">添加新卡/网银支付</el-button>
        </div>
        <div v-show="~checkBankIdx" class="bank-password">
            <div class="tip gray">请输入密码支付</div>
            <div class="password-input">
                <el-input v-model="password" maxlength="6" minlength="6" autocomplete="off" placeholder="请输入密码" show-password></el-input>
                <el-button @click="forgetFn" type="text">忘记支付密码?</el-button>
            </div>
            <el-button class="pay-btn" type="danger">立即支付</el-button>
        </div>
      </div>
      <div class="pay-bottom">
          <div @click="thirdFn(item)" class="third-item" v-for="(item,index) in thirdPartyData" :key="index">
              <i :class="[{'icon': item.icon},item.icon]"></i>
              <span>{{item.name}}</span>
          </div>
      </div>
    </div>
    
    <!-- 部门新增/编辑弹框 -->
		<el-dialog :title="dalogTitle" @close="closeDialogFn" :visible.sync="centerDialogVisible" center width='530px'>
			<div id="qrcode" ref="qrcode">
      </div>
      <!-- <div class="ac">
        <span>二维码已失效，点击</span>
        <el-button @click="refreshQrFn" type="text"><i data-v-61bf120c="" class="el-icon-refresh"></i>刷新</el-button>
      </div> -->
		</el-dialog>
  </div>
</template>


<script>
import {moneyFormat} from '../../common/mixin/moneyFormat'
import {countDownFn} from '../../common/mixin/countDown'
import QRCode from 'qrcodejs2'
export default {
  props: {
      itemData:{},
      editableTabs: {},
			editableTabsValue: {},
  },
  mixins: [moneyFormat,countDownFn],
  data() {
    return {
      // 倒计时定时器
      countDownPolling: "",
      // 倒计时文本
      countDown: "",
      // 二维码生成
      qrcode:"",
      // 获取二维码的数据
      qrData: {

      },
      // qr有效期，默认60秒
      timing: 60,
      // qr定时函数
      qrTimingObj: "",
      // 轮询查询是否已支付
      polling: "",
      dalogTitle: "微信支付",
      centerDialogVisible: false,
      // 密码
      password: "",
      showDetail: false,
      checkBankIdx: -1,
      showLists: true,
      bankLists: [
        {
          icon: "icon-ccb",
          name: "建设银行",
          type: "储蓄卡",
          no: "2569",
        },
        {
          icon: "icon-cmb",
          name: "招商银行",
          type: "储蓄卡",
          no: "2569",
        },
      ],
      thirdPartyData: [
          {
              icon: "",
              type: "yinlian",
              name: "中国银联"
          },
          {
              icon: "icon-wechat",
              type: "wechat",
              name: "微信支付"
          },
          {
              icon: "icon-alipay",
              type: "alipay",
              name: "支付宝支付"
          }
      ]
    };
  },
  computed: {
      // 选中
      isChecked(){
          let that = this;
          return function(idx){
              return that.checkBankIdx === idx
          }
      },
      // 订单详情
      orderDetail(){
          let extraArr = [], // 增值服务
              mainText = "", // 主服务续费
              text = ""; // 显示的文本
          this.itemData.subData.items.map((v)=>{
              if(v.serve_type === 1){
                  mainText = v.serve_name + "：" + v.packages_name + "，" + v.price + "元。"
                  return
              }
              extraArr.length ? extraArr.push(v.packages_name + "(" + v.duration + ")，" + v.price + "元") : extraArr.push(v.serve_name + " : " + v.packages_name + "(" + v.duration + ")，" + v.price + "元")
          })
          text = mainText + extraArr.join("；") + (extraArr.length ? "。" : "")
          return text
      }
  },
  methods: {
      // 支付二维码弹框关闭时
      closeDialogFn(){
        clearInterval(that.polling)
        clearInterval(that.qrTimingObj)
      },
      // 选中支付方式(银行卡)
      checkBankFn(idx){
          this.checkBankIdx === idx ? this.checkBankIdx = -1 : this.checkBankIdx = idx
          this.showLists = false;
          this.$nextTick(()=>{
              this.showLists = true;
          })
      },
      // 第三方支付方式
      thirdFn(data){
          console.log(data)
          this.dalogTitle = data.name
          let url = "/custom/pay/payment",
              option = {
                pay_type: data.type,
                order_id: this.itemData.subData.id
              };
          this.qrData = {
            url: url,
            option: option
          }
          this.refreshQrFn()

      },
      // 忘记密码
      forgetFn(){
          console.log("忘记密码")
      },
      // 轮询查询是否支付,5s查一次
      pollingFn(){
            //         let deldata = that.editableTabs.pop();
            // that.$emit('updata:editableTabs', deldata);
            // that.$emit('update:editableTabsValue', '1');
            // return
        let that = this;
        clearInterval(that.polling)
        that.polling = setInterval(() => {
          that.postFn({
            url: "/custom/order/find",
            option: {
              order_no: this.itemData.subData.order_no
            }
          },(res)=>{
            if(res.data.pay_result === "TRADE_SUCCESS"){
              clearInterval(that.polling)
              that.centerDialogVisible = false
              this.$message({
                message: res.msg,
                type: 'success'
              });
              let deldata = that.editableTabs.pop();
              that.$emit('updata:editableTabs', deldata);
              that.$emit('update:editableTabsValue', '1');
            }
          },()=>{
            clearInterval(that.polling)
          })
        }, 5000);
      },
      // 二维码刷新
      refreshQrFn(){
        let that = this;
        that.postFn(that.qrData,(res)=>{
          that.centerDialogVisible = true
          that.$nextTick(()=>{
            that.pollingFn()
            let timing = that.timing
            clearInterval(that.qrTimingObj)
            that.qrTimingObj = setInterval(() => {
              timing -= 1
              if(!timing){
                clearInterval(that.qrTimingObj)
                clearInterval(that.polling) // 轮训结束
              }
            }, 1000);
            if(that.qrcode){
              that.qrcode.makeCode(res.data.pay_code)
              return
            }
            that.qrcode = new QRCode('qrcode',{
                width: 240, // 设置宽度，单位像素
                height: 240, // 设置高度，单位像素
                text: res.data.pay_code
            })
          })
        })
      },
      // post请求
			postFn(Data,success,error){
				this.loading = true
				this.$axios.post(Data.url,Data.option).then(res => {
					if(res.data.code === 1){
						success(res.data)
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
					error()
				})
			},
      getCountDownFn(){
        let that = this;
        let row = that.itemData.subData
        let timer = new Date(row.create_time).getTime() + row.expires - new Date().getTime(),
          text = 0;
        if(timer > 0){
          // 还没超时
          text = timer
        }else{
          // 超时了
          clearInterval(this.countDownPolling)
          row.installed = 0
          that.$message({
              message: "订单已超时，请重新下单",
              type: 'error'
          });
          setTimeout(() => {
            let deldata = that.editableTabs.pop();
            that.$emit('updata:editableTabs', deldata);
            that.$emit('update:editableTabsValue', '1');
          }, 3000);
        }
        that.countDown = that.countDownFn(text)
      }
  },
  mounted(){
    let that = this;
      that.countDownPolling = setInterval(() => {
        that.getCountDownFn()
        console.log("轮询咯")
      }, 1000);
  },
  beforeDestroy(){
    clearInterval(this.countDownPolling)
  }
};
</script>

<style scoped lang="less">
.pay-box {
  height: 100%;
  background-color: #fff;
  font-size: 16px;
  overflow-y: auto;
  #qrcode{
    // 支付二维码
    display: flex;
    /deep/ img{
      margin: 10px auto;
    }
  }
  .pay-container {
    width: 900px;
    margin: 22px auto 0;
    .pay-top {
      border-bottom: 2px solid #ebebeb;
      padding-bottom: 16px;
      margin-bottom: 16px;
      .pay-top-left {
        line-height: 26px;
        .tip {
          color: #000;
        }
      }
      .pay-top-right {
        .for-money {
          vertical-align: bottom;
        }
        .detail-title {
          text-align: right;
          cursor: pointer;
          .el-icon-arrow-down{
              transition: transform .3s;
              transform: rotateZ(0deg);
              &.active{
                  transform: rotateZ(180deg);
              }
          }
        }
      }
    }
    .order-detail {
      font-size: 14px;
      line-height: 24px;
      transition: 0.5s max-height;
      max-height: 0px;
      overflow: hidden;
      &.active {
        max-height: 100px;
      }
    }
    .pay-content {
      margin-top: 20px;
      border: 10px solid #e6e6e6;
      padding: 40px 34px;
      margin: 20px 0;
      .bank-lists{
          .bank-lists-item{
              padding: 0 20px;
              height: 48px;
              line-height: 48px;
              border-bottom: 1px solid #EBEBEB;
              font-size: 14px;
              &.active{
                  border: 1px solid #CAD6EB;
                  box-shadow: 0 0 6px #CAD6EB;
              }
              .bank-icon{
                  margin: auto 30px;
                  line-height: 24px;
                  font-weight: bold;
                  width: 150px;
                  cursor: pointer;
                  i{
                      display: inline-block;
                      height: 24px;
                      width: 24px;
                      vertical-align: middle;
                      margin-right: 6px;
                  }
              }
          }
      }
      .add-bank{
          padding: 16px 68px;
          .el-button{
              width: 170px;
              border: 1px solid #EBEBEB;
              &:hover{
                  color: #e31613;
                  border-color: #e31613;
              }
          }
      }
      .bank-password{
          font-size: 14px;
          margin-top: 24px;
          .tip{
              line-height: 14px;
              margin-bottom: 16px;
          }
          .password-input{
              .el-input{
                  width: 170px;
                  margin-right: 12px;
              }
          }
          .pay-btn{
              width: 170px;
              font-weight: bold;
              margin-top: 14px;
              background-color: #E31613;
              &:hover{
                opacity: .7;
              }
          }
      }
    }
    .pay-bottom {
      border: 10px solid #e6e6e6;
      padding: 28px 34px 28px 0;
      .third-item{
          display: inline-block;
          padding: 0 38px;
          cursor: pointer;
          &:not(:last-of-type){
            border-right: 1px solid #E6E6E6;
          }
          i{
              display: inline-block;
              width: 16px;
              height: 16px;
              vertical-align: middle;
              margin-right: 6px;
              position: initial;
          }
          span{
              line-height: 16px;
              font-size: 14px;
              vertical-align: middle;
              &:hover{
                  color: #e31613;
              }
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