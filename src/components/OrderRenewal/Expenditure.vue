<!-- 续费管理 -->
<template>
    <div class="expenditure-box" v-loading="loading">
        <div class="expenditure-title">
            会员级别
        </div>
        <ul class="expenditure-Carousel">
            <li class="cards-list">
                <img src="./../../../src/assets/img/vip/vip1.png"/>
            </li>
            <li class="cards-list">
                <img src="./../../../src/assets/img/vip/vip2.png"/>
            </li>
            <li class="cards-list">
                <img src="./../../../src/assets/img/vip/vip3.png"/>
            </li>
            <li class="cards-list">
                <img src="./../../../src/assets/img/vip/vip4.png"/>
            </li>
            <li class="cards-list">
                <img src="./../../../src/assets/img/vip/vip5.png"/>
            </li>
        </ul>
        <div class="expenditure-title">
            选择续费
        </div>
        <ul class="expenditure-service">
            <li v-for="(item,index) in serveData" :key="index" class="service dis-flex">
                <div class="check-box">
                    <el-checkbox v-model="item.checkServe" @change="checkServeFn(item)"></el-checkbox>
                </div>
                <div class="title-box">
                    <div class="serve-name">{{item.name}}</div>
                    <div class="serve-surplus">到期时间: 2022-10-25</div>
                    <div class="serve-describe">{{item.describe}}</div>
                </div>
                 <!-- 会员续费服务 -->
                <template v-if="item.type === 1">
                    <div class="enum-box average">
                        <span @click="checkMealFn(1,item,idx)" class="enum-box-item" :class="['enum-box-item',{'checked': item.checkMeal === idx},{'disabled': !item.checkServe}]" v-for="(ele,idx) in item.packages" :key="idx">
                            {{ele.name}}
                        </span>
                    </div>
                    <div class="custom-box average">
                        <div class="title">自选续费时间:</div> 
                        <el-input :disabled="!item.checkServe" v-model="item.duration" @input="checkMealFn(2,item)" placeholder="请输入月数">
                            <template slot="append">个月</template>
                        </el-input>
                    </div>
                </template>
                <!-- 增值服务 -->
                <div v-else-if="item.type === 2" class="average meal-box">
                    <div class="meal-item" v-for="(ele,idx) in item.packages" :key="idx">
                        <el-checkbox :disabled="!item.checkServe" @change="checkMealFn(3,item,idx)" :label="ele[0].name" border></el-checkbox>
                        <el-select :disabled="!item['checkMeal' + idx] || !item.checkServe" @change="checkMealFn(4,item,idx)" v-model="item['checkVal' + idx]" placeholder="请选择">
                            <el-option
                            v-for="e in ele"
                            :key="e.id"
                            :label="duration(e)"
                            :value="e.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                    
                <div class="money-box">
                    <div class="mini-title">总价</div>
                    <div class="item-total money">
                        {{moneyFormat(item.checkServe && item.itemTotal || 0)}}
                        <small>元</small>
                    </div>
                </div>
            </li>
        </ul>
        <div class="expenditure-bottom dis-flex">
            <div class="bottom-left average">
                <div class="num">已选商品 : <span class="money">{{checkServeLength}}</span></div>
                <div class="totals">合计 : <span class="money">{{totalsMoney}}<small>元</small></span></div>
            </div>
            <div @click="sendFn" class="sure-btn">结算</div>
        </div>
    </div>
</template>


<script>
import empile from '../../../static/js/empile.js'
import {moneyFormat} from '../../common/mixin/moneyFormat'
export default {
    props: {

    },
    components: {
        
    },
    mixins: [moneyFormat],
    computed: {



        // 已选服务数量
        checkServeLength(){
            return this.serveData.filter((v)=>{
                return v.checkServe
            }).length
        },
        // 选择的服务的总价
        totalsMoney(){
            let money = 0
            this.serveData.map((v)=>{
                if(v.checkServe){
                    money += (v.itemTotal || 0) - 0
                }
            })
            
            return this.moneyFormat(money)
        },
        // 增值服务渲染
        duration(){
            return function(v){
                let text = v.name;
                switch(v.type){
                    case 2:
                    // 短信套餐
                    text += `(${v.duration}条)`
                        break;
                    case 3:
                    // OCR发票识别套餐
                    text += `(${v.duration}次)`
                        break;
                    default:
                        break;
                }
                return text
            }
        }
    },
    data(){
        return {
            loading: false,
            // 选中的数据
            checkData: [],
            value: "",
            // 列表查询数据
            searchLists: {
                dict_type: "", // 查询的类型
                page: 1,
                page_size: 15,
                dict_label: "", // 查询的值
            },
            // 服务数据
            serveData: [
/*                 {
                    id: "167570907815153665",
                    name: "软件续费",
                    price: "10.00",
                    type: 1,
                    describe: "建筑装饰行业SAAS项目管理软件续费" ,
                    packages: [
                        {
                            id: "164405520063606785",
                            serve_id: "167570907815153665",
                            type: 1,
                            name: "三个月",
                            price: "0.01",
                            duration: 3,
                            sort: 0
                        },
                        {
                            id: "164405736573579264",
                            serve_id: "167570907815153665",
                            type: 1,
                            name: "半年",
                            price: "5000.00",
                            duration: 6,
                            sort: 0
                        },
                        {
                            id: "164405882334031872",
                            serve_id: "167570907815153665",
                            type: 1,
                            name: "一年",
                            price: "10000.00",
                            duration: 12,
                            sort: 0
                        }
                    ]
                },
                {
                    id: "167915184705482752",
                    name: "增值服务",
                    price: "0.00",
                    type: 2,
                    describe: "短信套餐、OCR发票识别等",
                    packages: [
                        [{
                            id: "215435887877369857",
                            serve_id: "167915184705482752",
                            type: 2,
                            name: "短信套餐",
                            price: "0.01",
                            duration: 1000,
                            sort: 0
                        },
                        {
                            id: "215435963798466560",
                            serve_id: "167915184705482752",
                            type: 2,
                            name: "短信套餐",
                            price: "0.01",
                            duration: 5000,
                            sort: 0
                        },
                        {
                            id: "215436091540189184",
                            serve_id: "167915184705482752",
                            type: 2,
                            name: "短信套餐",
                            price: "880.00",
                            duration: 10000,
                            sort: 0
                        }],
                        [{
                            id: "215436540771119104",
                            serve_id: "167915184705482752",
                            type: 3,
                            name: "发票识别",
                            price: "0.01",
                            duration: 1000,
                            sort: 0
                        },
                        {
                            id: "215436652398325760",
                            serve_id: "167915184705482752",
                            type: 3,
                            name: "发票识别",
                            price: "0.01",
                            duration: 5000,
                            sort: 0
                        },
                        {
                            id: "215436749219639296",
                            serve_id: "167915184705482752",
                            type: 3,
                            name: "发票识别",
                            price: "1500.00",
                            duration: 10000,
                            sort: 0
                        }]
                    ]
                } */
            ]
        }
    },
    methods: {
        // 去结算
        sendFn(){
            console.log(this.serveData)
            let arr = [];
            this.serveData.map((v)=>{
                if(!v.checkServe) return
                if(v.type === 1){
                    // 主服务续费
                    arr.push({
                        duration: v.duration || "",
                        serve_id: v.id,
                        pack_id: v.checkMeal > -1 ? v.packages[v.checkMeal].id : ""
                    })
                }else{
                    // 2 增值服务
                    let mealArr = []
                    v.packages.map((val,idx)=>{
                        if(v['checkMeal' + idx] && v['checkVal' + idx]){
                            mealArr.push(v['checkVal' + idx])
                        }
                    })
                    if(mealArr.length){
                        arr.push({
                            duration: v.duration || "",
                            serve_id: v.id,
                            pack_id: mealArr.join(",")
                        })
                    }
                }
            })
            if(!arr.length){
                this.$message.error('请至少选择一个服务');
                return;
            }
            let sendData = {
                order_data: arr
            }
            console.log(sendData)
            console.log(this.$parent.$parent.$parent.adhibitionFun)




            let url = "/custom/order/create";
            this.loading = true
            this.$axios.post(url,sendData).then(res => {
                if(res.data.code === 1){
                    console.log(res.data.data)
                    let Data = {
                        tab: {
                            app_name: "订单付款",
                            app_id: "OrderPay",
                            type: "OrderPay"
                        },
                        data: res.data.data
                    }

                    this.$hfBus.$emit("addnewtabs",Data)
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
        // 套餐选择判断提示
        mealTipFn(data){
            if(!data.checkServe){
                this.$message.error('请先勾选左侧服务选框，再进行套餐选择操作');
                return true
            }
        },
        // 增值服务套餐金额计算
        incrementMealCountFn(data){
            let money = 0
            data.packages.map((v,i)=>{
                if(data["checkMeal" + i] && data["checkVal" + i]){
                    let mealData = v.find((v)=>{
                        return v.id === data["checkVal" + i]
                    })
                    money += mealData.price - 0
                }
            })
            return money
        },
        /* 增值套餐选择( 
            type:1,2是软件续费主服务;3,4是增值服务;
            type = 1, 选中的套餐;
            type = 2，自定义时间;
            type = 3，表示选中该套餐,同时的select解锁;
            type = 4，表示选择的具体套餐;

            data,该服务数据
            option,个性化数据
        ) */
        checkMealFn(type,data,option){
            if(this.mealTipFn(data)){
                return
            }
            switch (type) {
                case 1:
                    // option为选中的套餐索引
                    this.$set(data,"checkMeal",option)
                    this.$set(data,"duration","")
                    this.$set(data,"itemTotal",data.packages[option].price)
                    break;
                case 2:
                    this.$set(data,"checkMeal",-1)
                    this.$set(data,"itemTotal",data.price * data.duration)
                    break;
                case 3:
                    // option为选中的套餐索引
                    this.$set(data,"checkMeal" + option,!data["checkMeal" + option])
                    this.$set(data,"itemTotal",this.incrementMealCountFn(data))
                    break;
                case 4:
                    // option为选中的套餐索引
                    this.$set(data,"itemTotal",this.incrementMealCountFn(data))
                    break;
                default:

                    break;
            }
            console.log(data)
        },
        // 选中服务
        checkServeFn(data){
            // this.$set(data,"checkServe",!data.checkServe)
        },
        // 查询
        searchFn(){
            let url = "/custom/order/package";
            this.loading = true;
            this.$axios.get(url).then((res)=>{
                if(res.data.code === 1){
                    console.log(res.data.data.list)
                    this.serveData = res.data.data.list
                }else{
                    this.overdueOperation(res.data.code, res.data.msg);
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
        }
    },
    mounted(){
        this.searchFn()
        let option ={
            autoplay: {
                delay: 0,
                docHiddenOff: true,
            },
            waitForTransition: true,
            isClickSlide: true,
            pagination: {
                el: document.querySelector('.navigation'),
                clickable: true,
                bulletClass: 'dot',
                bulletActiveClass: 'active',
            },
            css: function (coord, absCoord) {
                var zIndex = 100 - absCoord,
                    opacity = Math.pow(.92, absCoord).toFixed(3),
                    scale = 'scale(' + Math.pow(.9, absCoord).toFixed(2) + ')',
                    translateX = 'translateX(' + 180 * coord + 'px)';

                var transform = [translateX, scale].join(' ');
                return {
                    zIndex: zIndex,
                    opacity: opacity,
                    transform: transform,
                }
            },
        }
        new empile.Empile(document.querySelector('.expenditure-Carousel'),option)
    }
}
</script>

<style scoped lang="less">
    .disabled{
        background-color: #f5f7fa!important;
    }
    .money{
        color: #FAAD14;
        font-size: 22px;
        font-weight: bold;
        small{
            font-size: 12px;
            font-weight: initial;
        }
    }
	.expenditure-box{
		height: 100%;
        font-size: 16px;
        overflow-y: auto;
        .expenditure-title{
            padding-left: 18px;
            background-color: #ECEFF4;
            height: 38px;
            line-height: 38px;
        }
        .expenditure-Carousel{
            height: 190px;
            display: flex;
            position: relative;
            margin: 0 auto;
            height: 190px;
            padding: 0;
            .cards-list{
                margin: auto 0;
                position: absolute;
                left: 50%;
                top: 18px;
                background-color: transparent;
                transition: 330ms;
                height: 136px;
                img{
                    height: 100%;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
        .expenditure-service{
            padding: 0;
            .service{
                margin: 20px 0;
                >div{
                    border: 1px solid #EAF8FF;
                }
                >div:not(.enum-box):not(.check-box){
                    padding: 15px 20px;
                }
                >div:not(:last-of-type){
                    border-right: 0;
                }
                .check-box{
                    width: 20px;
                    border: none;
                }
                .title-box{
                    width: 202px;
                    background-color: #EAF8FF;
                    .serve-name{
                        margin-top: -3px;
                        font-size: 16px;
                        line-height: 22px;
                        color: #1890FF;
                    }
                    .serve-surplus{
                        color: #6DB9FF;
                        font-size: 14px;
                    }
                    .serve-describe{
                        color: #8C8C8C;
                        font-size: 14px;
                    }
                }
                .money-box{
                    width: 230px;
                    .mini-title{
                        color: #000000;
                        font-size: 12px;
                    }
                }
                .enum-box{
                    font-size: 0;
                    padding: 10px 13px;
                    .enum-box-item{
                        min-width: 80px;
                        border: 1px solid #A2A7E6;
                        border-radius: 3px;
                        height: 40px;
                        line-height: 40px;
                        display: inline-block;
                        font-size: 16px;
                        text-align: center;
                        margin: 7px;
                        cursor: pointer;
                        &.checked{
                            background-color: #FFF6E5;
                        }
                    }
                }
                .custom-box{
                    .title{
                        color: #333333;
                        font-size: 16px;
                        line-height: 16px;
                        margin-bottom: 14px;
                    }
                }
                .meal-box{
                    .meal-item{
                        margin-bottom: 14px;
                        .el-checkbox{
                            vertical-align: top;
                            width: 150px;
                        }
                        .el-select{
                            width: 250px;
                        }
                    }
                    .meal-item:last-of-type{
                        margin: 0;
                    }
                }
                
            }
        }
        .expenditure-bottom{
            background-color: #EAF8FF;
            line-height: 38px;
            height: 38px;
            font-size: 16px;
            color: #333;
            .bottom-left{
                .num{
                    margin-left: 20px;
                    float: left;
                }
                .totals{
                    float: right;
                    margin-right: 70px;
                }
            }
            .sure-btn{
                background-color: #699EEC;
                cursor: pointer;
                width: 100px;
                height: 100%;
                color: #fff;
                text-align: center;
            }
            .sure-btn:hover{
                opacity: .7;
            }
        }
	}

</style>