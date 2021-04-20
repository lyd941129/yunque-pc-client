<template>
    <div class="title">
        {{title}}
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: "标题"
        }
    }
}
</script>
<style scoped>
.title{
    padding-left: 18px;
    background-color: #ECEFF4;
    height: 38px;
    line-height: 38px;
}
</style>