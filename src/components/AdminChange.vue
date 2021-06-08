<template>
    <div class="admin-change">
         <!-- 弹框 -->
        <el-dialog @close="closeFn" :close-on-click-modal="false" :close-on-press-escape="false" title="更换主管理员" :visible.sync="centerDialogVisible" center width='530px'>
            <el-form :model="mainData" ref="form" label-width="135px">
                <el-form-item label="当前主管理员" prop="username">
                    {{mainData.username}}
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <div class="dis-flex">
                        <el-input class="average" :value="mainData.phone" autocomplete="off" disabled></el-input>
                        <div v-if="time" class="get-code">{{time}}秒后再次获得</div>
                        <el-button v-else class="get-code" @click="getCodeFn" type="primary">获取验证码</el-button>
                    </div>
                    
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="mainData.code" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" class="btn-dialog" @click="nextFn()">下一步</el-button>
            </span>
        </el-dialog>
        <!-- 选择成员弹框 -->
		<el-dialog @close="closeFn" :close-on-click-modal="false" :close-on-press-escape="false" title="更换主管理员" :visible.sync="personEditDalog" width='530px'>
			<ThroughTree :isMultiple="false" :treeData="personLists" :treeSaveData.sync="savePersonData"></ThroughTree>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addPersonFn">确 认</el-button>
				<el-button @click="personEditDalog = false">取 消</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import ThroughTree from './ThroughTree.vue';
export default {
    props: {
        mainData: {
            type: Object,
            require: true
        }
    },
    data(){
        return {
            centerDialogVisible: true,
            personEditDalog: false,
            time: 0,
            polling: "",
            // 更换部门
            personLists: [],
            // 选中的
            savePersonData: []
        }
    },
    components:{
        ThroughTree
    },
    methods: {
        nextFn(){
            // 下一步
            if(this.mainData.code){
                this.personEditDalog = true
                this.centerDialogVisible = false
            }else{
                this.$message({
                    message: "请输入验证码",
                    type: 'error'
                });
            }
            
        },
        // 获取验证码
        getCodeFn(){
            let that = this;
            that.time = 60
            that.polling = setInterval(()=>{
                that.time --
                if(!that.time){
                    clearInterval(that.polling)
                    that.polling = ""
                }
            },1000)
        },
        // 选中人员确定
        addPersonFn(){
            this.loading = true
            let that = this,
                option = {
                    code: this.mainData.code,
                    user_id: this.savePersonData[0].id
                }
            console.log(option)
            this.$axios.post("/custom/company/master",option).then(res => {
                if(res.data.code === 1){
                    that.$message({
                        message: res.data.msg,
                        type: 'success'
                    });
                    that.$emit("close")
                }else{
                    that.overdueOperation(res.data.code, res.data.msg);
                }
                that.loading = false;
            }).catch(err => {
                that.loading = false;
                that.$message({
                    message: err,
                    type: 'error'
                });
            })
        },
        // 取消
        closeFn(){
            if(this.personEditDalog){
                return
            }
            this.$emit("close")
        }
    },
    mounted(){
        // 挂载之后
        let that = this;
        this.loading = true;
        this.$axios.get('/custom/depart/tree').then(res => {
            if(res.data.code === 1){
                that.personEditDalog = false;
                that.savePersonData = [];
                that.$nextTick(()=>{
                    that.$set(that,"personLists",res.data.data)
                })
            }else{
                that.overdueOperation(res.data.code, res.data.msg);
            }
            this.loading = false;
        }).catch(err => {
            // console.log(err);
            this.loading = false;
            this.$message({
                message: err,
                type: 'error'
            });
        });
    },
    beforeDestroy(){
        clearInterval(this.polling)
        this.polling = ""
    }
}
</script>
<style lang="less" scoped>
.get-code{
    margin-left: 14px;
}
</style>