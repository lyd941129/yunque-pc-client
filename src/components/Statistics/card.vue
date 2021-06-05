<template>
    <div class="card" :class="cardClass">
        <div class="title">
            {{mainData.title}}
        </div>
        <div class="content">
            <div class="item" v-for="(item,index) in mainData.data" :key="index">
                <div v-if="item.key || item.key === 0" class="key">{{item.key}}</div>
                <div v-if="item.value || item.value === 0" class="value" :class="item.color">{{item.value}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        mainData: {
            type: Object,
            default(){
                return {}
            }
        },
        cardClass: {
            type: String,
            default: ""
        }
    }
}
</script>
<style lang="less" scoped>
.card{
    border-radius: 6px;
    overflow: hidden;
    text-align: center;
    .title{
        font-size: 14px;
        line-height: 40px;
        color: #fff;
    }
    .content{
        height: 110px;
        display: flex;
        flex-direction: column;
        padding: 10px 0 20px;
        background-color: #fff;
        .item{
            margin: auto;
            display: flex;
            line-height: 22px;
            width: 100%;
            .key{
                // margin-right: 70px;
                font-size: 16px;
                flex: 1;
            }
            .value {
                font-size: 22px;
                flex: 1;
            }
        }
    }
    &.blue{
        background-color: #85A5FF;
        border: 1px solid #85A5FF;
    }
    &.purple{
        background-color: #B37FEB;
        border: 1px solid #B37FEB;
    }
    &.green{
        background-color: #5CDBD3;
        border: 1px solid #5CDBD3;
    }
    .blue{
        color: #1890FF;
    }
    .red{
        color: #FA541C;
    }
}
</style>