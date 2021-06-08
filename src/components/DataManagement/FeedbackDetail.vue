<template>
    <el-row class="feedback-container" :gutter="20">
        <el-col :span="15" :offset="3">
            <el-form :model="itemData.subData" ref="form" label-width="135px">
                <el-form-item label="问题描述" prop="content">
                    <el-input :rows="5" disabled type="textarea" v-model="itemData.subData.content" clearable></el-input>
                </el-form-item>
                <el-form-item label="问题类型" clearable prop="type">
                    <el-select class="w-100" :value="itemData.subData.type + ''" placeholder="请选择..." disabled>
                        <el-option 
                        :label="item.dict_label" 
                        :value="item.dict_value" 
                        v-for="(item,index) in itemData.subData.typeData" 
                        :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题截图" prop="content">
                    <div class="demo-image__preview">
                        <el-image 
                            v-for="(item,index) in itemData.subData.image" :key="index"
                            style="width: 100px; height: 100px"
                            :src="item"
                            :preview-src-list="itemData.subData.image">
                        </el-image>
                    </div>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input disabled type="text" v-model="itemData.subData.phone" clearable placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item v-if="itemData.subData.reply" label="解答" prop="reply">
                    <el-input :rows="5" disabled type="textarea" v-model="itemData.subData.reply" clearable></el-input>
                </el-form-item>
            </el-form>
        </el-col>
        
    </el-row>
</template>
<script>
export default {
    props: {
        // 数据
        itemData:{
            type: Object,
            default(){
                return {

                }
            }
        }
    },
    data(){
        return {

        }
    },
    methods: {

    },
    mounted(){
        console.log(this.itemData)
    }
}
</script>
<style scoped lang="less">
.feedback-container{
    padding: 20px 0 0;
    .sure-btn{
        width: 140px;
    }
    .el-image{
        margin-right: 10px;
        margin-bottom: 10px;
    }
    /deep/ textarea{
        min-height: 100px;
    }
}
</style>