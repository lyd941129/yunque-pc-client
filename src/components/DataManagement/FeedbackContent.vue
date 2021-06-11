<template>
    <div class="feedback-container">
        <el-form :model="itemData" :rules="rules" ref="form" label-width="135px">
            <el-form-item label="问题描述" prop="content">
                <el-input :rows="5" type="textarea" v-model="itemData.content" clearable></el-input>
            </el-form-item>
            <el-form-item label="问题类型" clearable prop="type">
                <el-select class="w-100" v-model="itemData.type" placeholder="请选择...">
                    <el-option 
                    :label="item.dict_label" 
                    :value="item.dict_value" 
                    v-for="(item,index) in typeData" 
                    :key="index">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="问题截图" prop="content">
                <el-upload
                    :limit="9"
                    :on-exceed="handleExceed"
                    ref="upload"
                    action="#"
                    :http-request="uploadFn"
                    :before-remove="beforeRemoveFn"
                    :on-preview="handlePictureCardPreview"
                    list-type="picture-card"
                    multiple>
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
                <el-input type="text" v-model="itemData.phone" clearable placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" class="sure-btn" @click="sureFn()">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
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
        },
        // 问题类型的参数
        typeData: {
            type: Array,
            default(){
                return []
            }
        },
    },
    data(){
        return {
            // 验证
            rules: {
                content: [{
                    required: true,
                    message: '请输入问题描述',
                    trigger: 'blur'
                }],
                type: [{
                    required: true,
                    message: '请选择问题类型',
                    trigger: 'blur'
                }],
                phone: [{
                    required: true,
                    message: '请输入联系方式',
                    trigger: 'blur'
                }]
            },
            dialogImageUrl: "",
            dialogVisible: false
        }
    },
    methods: {
        // 预览
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 上传图片之前
        handleExceed(file){
            // console.log(file)
            // return false
            console.log("超限制了")
        },
        // 确定
        sureFn(){
            this.$emit("hfsure",this.itemData)
        },
        // 移除图片
        beforeRemoveFn(file,lists){
            console.log(file)
            console.log(lists)
            let idx = 0
            lists.find((e,i)=>{
                if(e.uid === file.uid){
                    idx = i
                }
            })
            this.itemData.image.splice(idx,1)
        },
        // 图片上传
        uploadFn(obj){
            

            console.log(this.$refs.upload.uploadFiles)
            let idx = this.$refs.upload.uploadFiles.length - 1
            let url = "/custom/file/upload",
                that = this,
                fd = new FormData()
                fd.append("file",obj.file)

            that.$axios.post(url,fd).then(res => {
                if(res.data.code === 1){
                    console.log(res)
                    that.itemData.image[idx] = res.data.data.file_url
                }else{
                    that.overdueOperation(res.data.code, res.data.msg);
                    that.$refs.upload.uploadFiles.splice(idx,1)
                }
                that.loading = false;
            }).catch(err => {
                that.$refs.upload.uploadFiles.splice(idx,1)
                that.loading = false;
                that.$message({
                    message: err,
                    type: 'error'
                });
            })
        },
    }
}
</script>
<style scoped lang="less">
.feedback-container{
    padding: 20px 0 0;
    .sure-btn{
        width: 140px;
    }
    /deep/ .el-dialog__header{
        display: none;
    }
}
</style>