<template>
    <div class="help-box">
        <h3 class="title ac">
            {{itemData.subData.title}}
        </h3>
        <div class="content" v-html="itemData.subData.content"></div>
    </div>
</template>
<script>
export default {
    props: {
         itemData:{}
    },
    data(){
        return {

        }
    },
    mounted(){
        console.log(this.itemData)
    }
}
</script>
<style scoped lang="less">
.help-box{
    height: 100%;
    background-color: #fff;
    font-size: 16px;
    overflow-y: auto;
    padding: 0 30px;
    .content{
        display: inline-block;
        margin: auto;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
    }

}
</style>