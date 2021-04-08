<!-- 高级设置模块 -->
<template>
	<div class="advanced">
		<el-form ref="form" label-width="140px">
			<el-form-item label="可见范围">
				<el-radio-group v-model="advData.visible_scope">
					<el-radio :label="1">全部员工</el-radio>
					<el-radio :label="2">部分员工</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="" v-if="advData.visible_scope=='2'">
				<div class="selectPeople" @click="openFigure">
					<span v-for="(item, index) in show2" :key='index'>{{(index > 0 ? ',' : '')}}{{item}}</span>
				</div>
			</el-form-item>
			<el-form-item label="审批人去重">
				<el-select v-model="advData.approve_person" placeholder="请选择">
					<el-option label="不启用自动去重" :value="0"></el-option>
					<el-option label="启用自动去重" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="发起人审批">
				<!-- <el-checkbox-group> -->
					<el-checkbox v-model="start_person" label="自动通过" name="type"></el-checkbox>
				<!-- </el-checkbox-group> -->
			</el-form-item>
			<el-form-item label="审批意见">
					<el-checkbox v-model="approve_opinion" label="必填" name="type"></el-checkbox>
					<el-checkbox v-model="approve_start" label="对发起人不可见" name="type"></el-checkbox>
			</el-form-item>
			<el-form-item label="导出、打印所有权限">
				<div class="selectPeople" @click="openFigure('derive')">
					<span v-for="(item, index) in show" :key='index'>{{(index > 0 ? ',' : '')}}{{item}}</span>
				</div>
			</el-form-item>
		</el-form>
		<el-dialog title="选择人员" :visible.sync="dialogTableVisible">
				<ThroughTree :treeData="treeData" :treeSaveData.sync="treeSaveData"></ThroughTree>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="visiblePersonnel">确 认</el-button>
					<el-button @click="dialogTableVisible = false">取 消</el-button>
				</span>
		</el-dialog>
		<el-dialog title="选择人员" :visible.sync="dialogTableVisibleDerive">
				<ThroughTree :treeData="treeData" :treeSaveData.sync="treeSaveDataDerive"></ThroughTree>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="visiblePersonnelDerive">确 认</el-button>
					<el-button @click="dialogTableVisibleDerive = false">取 消</el-button>
				</span>
		</el-dialog>
	</div>
</template>

<script>
	import ThroughTree from './ThroughTree.vue';
	export default {
		components: {
			ThroughTree,
		},
		props: {
			advData:{
				type: Object
			},
		},
		data() {
			return {
				start_person: true,
				approve_opinion: true,
				approve_start: true,
				dialogTableVisible: false,
				dialogTableVisibleDerive: false,
				treeData: [],
				treeSaveData: [{
					id: "159319995586105345",
					username: "开发第三分部"
				}],
				treeSaveDataDerive: [],
				show: [],
				show2: [],
			}
		},
		methods: {
			onSubmit() {
				// console.log('submit!');
			},
			openFigure(type){
				var that = this;
				type === 'derive' ? (that.dialogTableVisibleDerive = true) : (that.dialogTableVisible = true);
				this.$axios.post('/api/memCompany/getMem', {
					'company_id': that.loginData.default_company.id
				}).then(res => {
					if(res.data.code === 1){
						that.treeData = res.data.data;
						// console.log(res);
					}else{
						that.overdueOperation(res.data.code, res.data.msg);
					}
				}).catch(err => {
					// console.log(err)
				})
			},
			visiblePersonnel(){
				var user = [];
				var dep = [];
				this.treeSaveData.length && this.treeSaveData.map((item) => {
					if(item.username){
						let obj = {};
						obj[item.id] = item.username;
						user.push(obj);
					}else if(item.depart_name){
						let obj = {};
						obj[item.id] = item.depart_name;
						dep.push(obj);
					}
				});
				this.show2 = [];
				this.advData.visible_member = user;
				this.advData.visible_depart = dep;
				// let that = this;
				// this.advData.visible_depart.length && this.advData.visible_depart.map((item) => {
				// 	for(let key in item){
				// 		that.show2.push(item[key]);
				// 	}
				// });
				// this.advData.visible_member.length && this.advData.visible_member.map((item) => {
				// 	for(let key in item){
				// 		that.show2.push(item[key]);
				// 	}
				// });
				this.$emit('update:advData', this.advData);
				this.dialogTableVisible = false;
			},
			visiblePersonnelDerive(){
				var user = [];
				this.treeSaveDataDerive.length && this.treeSaveDataDerive.map((item) => {
					let obj = {};
					if(item.username){
						obj[item.id] = item.username;
					}else if(item.depart_name){
						obj[item.id] = item.depart_name;
					}
					user.push(obj);
				});
				this.show = [];
				this.advData.export_print = user;
				let that = this;
				this.treeSaveDataDerive = [];
				this.advData.export_print.length && this.advData.export_print.map((item) => {
					for(let key in item){
						this.treeSaveDataDerive.push({
							id: key,
							username: item[key]
						});
						that.show.push(item[key]);
					}
				});
				this.$emit('update:advData', this.advData);
				this.dialogTableVisibleDerive = false;
			}
		},
		watch:{
			start_person:{
				handler (val) {
					val ? (this.advData.start_person = 1) : (this.advData.start_person = 0);
				}
			},
			approve_opinion:{
				handler (val) {
					val ? (this.advData.approve_opinion = 1) : (this.advData.approve_opinion = 0);
				}
			},
			approve_start:{
				handler (val) {
					val ? (this.advData.approve_start = 1) : (this.advData.approve_start = 0);
				}
			},
			'advData.export_print':{
				handler (val) {
					if(val){
						let that = this;
						that.show = [];
						this.treeSaveDataDerive = [];
						val.map((item) => {
							for(let key in item){
								this.treeSaveDataDerive.push({
									id: key,
									username: item[key]
								});
								that.show.push(item[key]);
							}
						});
					}
				},
				deep: true
			},
			// 'advData.visible_member':{
			// 	handler (val) {
			// 		if(val){
			// 			let that = this;
			// 			val.map((item) => {
			// 				for(let key in item){
			// 					that.show2.push(item[key]);
			// 				}
			// 			});
			// 		}
			// 	},
			// 	deep: true
			// },
			// 'advData.visible_depart':{
			// 	handler (val) {
			// 		if(val){
			// 			let that = this;
			// 			val.map((item) => {
			// 				for(let key in item){
			// 					that.show2.push(item[key]);
			// 				}
			// 			});
			// 		}
			// 	},
			// 	deep: true
			// },
			advData: {
				handler (val) {
					val.start_person ? (this.start_person = true) : (this.start_person = false);
					val.approve_opinion ? (this.approve_opinion = true) : (this.approve_opinion = false);
					val.approve_start ? (this.approve_start = true) : (this.approve_start = false);
					let that = this;
					this.treeSaveData = [];
					that.show2 = [];
					if(val.visible_depart && val.visible_depart.length){
						val.visible_depart.map((item) => {
							for(let key in item){
								that.treeSaveData.push({
									id: key,
									username: item[key]
								});
								that.show2.push(item[key]);
							}
						});
					}
					if(val.visible_member && val.visible_member.length){
						val.visible_member.map((item) => {
							for(let key in item){
								that.treeSaveData.push({
									id: key,
									username: item[key]
								})
								that.show2.push(item[key]);
							}
						});
					}
				},
				deep: true
			},
		}
	}
</script>

<style lang="less" scoped="scoped">
	.selectPeople{
		width: 100%;
		height: 38px;
		border: 1px solid #DCDFE6;
		line-height: 38px;
		padding: 0 15px;
		color: rgba(24, 144, 255, 1);
		cursor: pointer;
		border-radius: 4px;
		&:hover{
			border-color: #C0C4CC;
		}
	}
</style>
