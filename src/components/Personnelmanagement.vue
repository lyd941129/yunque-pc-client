<!-- 人员管理 -->
<template>
	<div class="personnelmanagement" v-loading="loading">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="角色" v-if="itemData.app_id === 'jsgl'">
				<el-input @keyup.enter.native="onScreen" v-model="formInline.role_name" placeholder="请输入角色名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="人员名称" v-if="itemData.app_id === 'rygl'">
				<el-input @keyup.enter.native="onScreen" v-model="formInline.username" placeholder="请输入人员名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="部门名称" v-if="itemData.app_id === 'rygl'">
				<el-input @keyup.enter.native="onScreen" v-model="formInline.depart_name" placeholder="请输入部门名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="onScreen">确认筛选</el-button>
			</el-form-item>
		</el-form>
		<el-row class="btn-row">
			<el-button type="primary" class="btn-blue" @click="depRoleEditFn(1)">调整部门</el-button>
			<el-button type="primary" class="btn-blue" @click="depRoleEditFn(2)">调整角色</el-button>
			<el-button type="danger" class="btn-red" @click='roleProjectDele'>批量删除</el-button>
		</el-row>
		<!-- 人员管理 -->
		<div class="table-box table-box-btn" v-if="itemData.app_id === 'rygl'">
			<el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
			:select-on-indeterminate='false' height="100%" @row-click="on_select">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column label="姓名" prop="username" align="center" width="80"></el-table-column>
				<el-table-column label="生日" prop="birthday" align="center" width="160">
				</el-table-column>
				<el-table-column label="性别" align="center" width="160">
					<template slot-scope="scope">
						<div>{{scope.row.gender ? '女' : '男'}}</div>
					</template>
				</el-table-column>
				<el-table-column label="所属部门" prop="depart_name" align="center"></el-table-column>
				<el-table-column label="手机号" prop="phone" align="center"></el-table-column>
				<el-table-column label="是否启用" prop="installed" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.installed ? '启用' : '不启用'}}</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" @size-change="sizeChange"
		:page-size="searchData.page_size" :page-sizes="pageSizes" layout="sizes, total, prev, pager, next, jumper" :total="total">
		</el-pagination>
		<!-- 添加成员弹框 -->
		<el-dialog :title="throughTitle" :visible.sync="personEditDalog" width='530px'>
			<ThroughTree :isMultiple="throuthMultiple" :treeData="personLists" :treeSaveData.sync="savePersonData"></ThroughTree>
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
			itemData: {},
			editableTabs: {},
			editableTabsValue: {},
		},
		components: {
			ThroughTree
		},
		data() {
			return {
				formInline: {
					username: '',
					depart_name: '',
					role_name: '',
					keyword: '',
					status: '',
					dateStart: '',
					dateEnd: '',
				},
				searchData: {
					page: 1,
					page_size: 15,
				},
				// 翻页的数组
				pageSizes: [15,30,50,100],
				tableData: [],
				currentPage: 1,
				total: 0,
				loading: false,
				// 添加人员|调整部门数据
				addUser:{
					depart_id: "",
					user_ids: []
				},
				personEditDalog: false,
				// throughTree是否多选
				throuthMultiple: true,
				// 更换部门
				personLists: [],
				// throughTree选中的
				savePersonData: [],
				// 弹框标题
				throughTitle: ""
			}
		},
		created() {
			this.refreshApi();
		},
		computed: {
			getLocalTime: function() {// 时间转化
				return function(nS) {
					return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
				}
			},
			getStatus: function() {// 时间转化
				return function(text) {
					let color = '';
					text == '试用' && (color = 'orange')
					return color;
				}
			},
		},
		methods: {
			refreshApi(){// 获取数据
				var that = this;
				this.loading = true;
				let url = '/custom/user/index';
				this.$axios.get(url, {params: this.searchData}).then(res => {
					if(res.data.code === 1){
						that.$set(that.searchData, 'page_size', res.data.data.page_size);
						that.$set(that, 'total', res.data.data.total);
						that.$set(that, 'tableData', res.data.data.list);
					}else{
						that.overdueOperation(res.data.code, res.data.msg);
						setTimeout(function(){
							if(that.editableTabs.length>1){// 如果请求失败则返回上个页签
								let deldata = that.editableTabs.pop();
								that.$emit('updata:editableTabs', deldata);
								that.$emit('update:editableTabsValue', '1');
							}
						}, 1000);
					}
					this.loading = false;
				}).catch(err => {
					// console.log(err);
					this.loading = false;
					this.$message({
						message: err,
						type: 'error'
					});
					setTimeout(function(){
						if(that.editableTabs.length>1){// 如果请求失败则返回上个页签
							let deldata = that.editableTabs.pop();
							that.$emit('updata:editableTabs', deldata);
							that.$emit('update:editableTabsValue', '1');
						}
					}, 1000);
				});
			},
			onScreen() {// 确认筛选
				this.searchData.page = 1;
				this.refreshApi();
			},
			on_select(val) { // 让表格点击行可以选中
				this.$refs.multipleTable.toggleRowSelection(val);
			},
			handleCurrentChange(val) {// 切换页
				this.searchData.page = val;
				this.refreshApi();
				// console.log(`当前页: ${val}`);
			},
			// 部门人员添加确认|调整部门的确认
			addPersonFn(){
				let that = this,
					url = "";
				console.log(that.savePersonData)
				console.log(that.checkData)
				console.log(that.savePersonData)
				// 部门调整
				if(!that.savePersonData[0]){
					// 没选中
					that.$message.error('请选择数据');
					return
				}
				if(that.savePersonData[0].role_name){
					// 更换角色
					that.addUser.depart_id = ""
					url = "/custom/role/add_user"
					that.addUser.role_id = that.savePersonData[0].id
				}else{
					// 调整部门
					that.addUser.role_id = ""
					url = "/custom/depart/add_user"
					that.addUser.depart_id = that.savePersonData[0].id
				}
				// 选中的数据
				that.postFn({
					url: url,
					option: that.addUser
				},(res)=>{
					that.personEditDalog = false
					that.$message.success(res.msg);
					that.refreshApi()
				})
			},
			// 部门调整(type: 1) | 角色调整 (type: 2)
			depRoleEditFn(type){
				let that = this,
					selectData = that.getSelected();
				if(selectData.length === 0){
					that.$message.error('请至少勾选一项');
					return
				}
				console.log(selectData)
				// depart_id
				// user_ids

				this.loading = true;
				let url = '/custom/depart/lists';
				if(type === 2){
					url = '/custom/user/select_role'
				}
				this.$axios.get(url).then(res => {
					if(res.data.code === 1){
						that.addUser.user_ids = []
						selectData.map((v)=>{
							that.addUser.user_ids.push(v.id)
						})
						that.throughTitle = type === 1 ? "调整部门" : "更换角色"
						that.personEditDalog = true;
						that.throuthMultiple = false;
						that.$nextTick(()=>{
							that.$set(that,"savePersonData",[])
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
			getSelected() {// 获取表格选中数据
				return this.$refs.multipleTable.selection;
			},
			roleProjectDele(){// 删除项目角色
				let selectData = this.getSelected();
				let that = this;
				if (selectData.length == 0) {
					that.$message.error('请选择要删除的选项！');
					return
				}
				let arrId = [];
				selectData.map((item) => {
					arrId.push(item.id);
				});
				this.$confirm('确认删除<span class="red">【选中的人员】</span>吗？','提示',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					dangerouslyUseHTMLString: true,
					type: 'warning'
				}).then(() => {
					that.postFn({
						url: "/custom/user/del",
						option: {
							user_id: arrId
						}
					},(res)=>{
						that.$message({
							message: res.msg,
							type: 'success'
						});
						that.refreshApi();
					})
				}).catch(() => {});
			},
			sizeChange(val){
				this.$set(this.searchData, 'page_size', val);
				this.refreshApi();
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
		}
	}
</script>

<style lang="less" scoped="scoped">
	.personnelmanagement{
		height: 100%;
		.table-box {
			height: calc(100% - 104px);
			&.table-box-btn{
				height: calc(100% - 154px);
				margin-top: 20px;
			}
		}
		.el-pagination{
			text-align: center;
			margin-top: 10px;
			.el-pagination__sizes{
				display: none;
			}
		}
		.orange{
			color: rgba(250, 84, 28, 1);
		}
	}
</style>

<style lang="less">
	.personnelmanagement{
		.demo-form-inline{
			.el-input,
			.el-date-editor.el-input{
				width: 150px;
			}
		}
	}
</style>
