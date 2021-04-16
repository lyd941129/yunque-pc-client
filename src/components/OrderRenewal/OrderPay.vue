<template>
  <div class="pay-box">
    <div class="pay-container">
      <div class="pay-top dis-flex">
        <div class="pay-top-left average">
          <div class="tip">订单提交成功，请尽快付款！订单号：XVB25648785</div>
          <!--       <div class="">
                       请您在<span class="red">1时30分60秒</span>内完成支付，否则订单会被自动取消。
                   </div> -->
        </div>
        <div class="pay-top-right gray">
          <div class="for-money">
            应付金额 : <span class="money red">65,200.00</span>元
          </div>
          <div class="detail-title blue" @click="showDetail = !showDetail">
            订单详情<i class="el-icon-arrow-down"></i>
          </div>
        </div>
      </div>
      <div :class="['order-detail', { active: showDetail }]">
        商品详情：软件会员，1年，60000万元。增值服务：短信通知，5000条，600元。发票识别，400次，200元。
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
                <i :class="item.icon"></i>
                <span>{{item.name}}</span>
            </div>
            
            <div class="bank-tip average">{{ item.type }}({{ item.no }})</div>
            <div v-show="isChecked(index)" class="for-money gray">
              应付金额 : <span class="money red">65,200.00</span>元
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
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
          </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      // 密码
      password: "",
      showDetail: false,
      checkBankIdx: -1,
      showLists: true,
      bankLists: [
        {
          icon: "",
          name: "建设银行",
          type: "储蓄卡",
          no: "2569",
        },
        {
          icon: "",
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
              icon: "",
              type: "wechat",
              name: "微信支付"
          },
          {
              icon: "",
              type: "alipay",
              name: "支付宝支付"
          }
      ]
    };
  },
  computed: {
      isChecked(){
          let that = this;
          return function(idx){
              return that.checkBankIdx === idx
          }
      }
  },
  methods: {
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
      },
      // 忘记密码
      forgetFn(){
          console.log("忘记密码")
      }
  }
};
</script>

<style scoped lang="less">
.pay-box {
  height: 100%;
  background-color: #fff;
  font-size: 16px;
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
                  i{
                      background-color: pink;
                      display: inline-block;
                      height: 24px;
                      width: 24px;
                      vertical-align: middle;
                      margin-right: 10px;
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
              background-color: pink;
              vertical-align: middle;
              margin-right: 6px;
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