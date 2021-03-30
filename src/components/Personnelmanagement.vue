<!-- 人员管理 -->
<template>
	<div class="personnelmanagement" v-loading="loading">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="人员名称" v-if="itemData.app_id === 'rygl'">
				<el-input v-model="formInline.username" placeholder="请输入人员名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="部门名称" v-if="itemData.app_id === 'rygl'">
				<el-input v-model="formInline.depart_name" placeholder="请输入部门名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="角色名称" v-if="itemData.app_id === 'jsgl'">
				<el-input v-model="formInline.role_name" placeholder="请输入角色名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="项目角色名称" v-if="itemData.app_id === 'xmgl'">
				<el-input v-model="formInline.role_name" placeholder="请输入角色名称" clearable></el-input>
			</el-form-item>
			<!-- <el-form-item label="关键字">
				<el-input v-model="formInline.keyword" placeholder="请输入关键字"></el-input>
			</el-form-item>
			<el-form-item label="员工状态">
				<el-select v-model="formInline.status" filterable placeholder="请选择..." clearable>
					<el-option v-for="item in options" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="入职时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateStart"></el-date-picker>
					——
					<el-date-picker type="date" placeholder="选择日期" v-model="formInline.dateEnd"></el-date-picker>
			</el-form-item> -->
			<el-form-item>
				<el-button @click="onScreen">确认筛选</el-button>
			</el-form-item>
		</el-form>
		<el-row v-if="itemData.app_id === 'xmgl'">
			<el-button type="primary" class="btn-blue" @click="roleProjectAdd">新增</el-button>
			<el-button type="primary" class="btn-blue" @click="roleProjectEdit">编辑</el-button>
			<el-button type="danger" class="btn-red" @click='roleProjectDele'>批量删除</el-button>
		</el-row>
		<!-- 人员管理 -->
		<div class="table-box" v-if="itemData.app_id === 'rygl'">
			<el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
			:select-on-indeterminate='false' height="100%" @row-click="on_select">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column label="姓名" prop="username" align="center" width="80"></el-table-column>
				<el-table-column label="生日" prop="birthday" align="center" width="160">
					<!-- <template slot-scope="scope">
						<div>{{scope.row.birthday ? getLocalTime(scope.row.birthday) : ''}}</div>
					</template> -->
				</el-table-column>
				<el-table-column label="性别" align="center" width="160">
					<template slot-scope="scope">
						<div>{{scope.row.gender ? '女' : '男'}}</div>
					</template>
				</el-table-column>
				<!-- <el-table-column label="工号" prop="jobNumber" align="center"></el-table-column> -->
				<el-table-column label="所属部门" prop="depart_name" align="center"></el-table-column>
				<!-- <el-table-column label="职位" prop="position" align="center"></el-table-column> -->
				<!-- <el-table-column label="角色" prop="role" align="center"></el-table-column> -->
				<el-table-column label="手机号" prop="phone" align="center"></el-table-column>
				<el-table-column label="是否启用" prop="installed" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.installed ? '启用' : '不启用'}}</div>
					</template>
				</el-table-column>
				<!-- <el-table-column label="邮箱" prop="mailbox" align="center" width="180"></el-table-column> -->
				<!-- <el-table-column label="状态" prop="installed" align="center" width="70">
					<template slot-scope="scope">
						<div :class="getStatus(scope.row.installed ? '正式' : '使用')">{{scope.row.installed ? '正式' : '使用'}}</div>
					</template>
				</el-table-column> -->
			</el-table>
		</div>
		<!-- 角色管理 -->
		<div class="table-box" v-if="itemData.app_id === 'jsgl'">
			<el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
			:select-on-indeterminate='false' height="100%" @row-click="on_select">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column label="角色名称" prop="role_name" align="center"></el-table-column>
				<el-table-column label="管理员" prop="birthday" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.is_manager ? '是' : '否'}}</div>
					</template>
				</el-table-column>
				<el-table-column label="经办人" prop="handler_name" align="center"></el-table-column>
				<el-table-column label="是否启用" prop="installed" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.installed ? '启用' : '不启用'}}</div>
					</template>
				</el-table-column>
				<el-table-column label="最后修改时间" prop="update_time" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.update_time ? getLocalTime(scope.row.update_time) : ''}}</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 项目角色管理 -->
		<div class="table-box" v-if="itemData.app_id === 'xmgl'" :class="{'table-box-btn': (itemData.app_id === 'xmgl')}">
			<el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
			:select-on-indeterminate='false' height="100%" @row-click="on_select">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column label="角色名称" prop="role_name" align="center"></el-table-column>
				<el-table-column label="职责描述" prop="role_describe" align="center"></el-table-column>
				<el-table-column label="经办人" prop="handler_name" align="center"></el-table-column>
				<el-table-column label="最后修改时间" prop="update_time" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.update_time ? getLocalTime(scope.row.update_time) : ''}}</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" @size-change="sizeChange"
		:page-size="pageSize" layout="sizes, total, prev, pager, next, jumper" :total="total">
		</el-pagination>
		<!-- 弹框 -->
		<el-dialog :title="title" :visible.sync="centerDialogVisible" center width='530px'>
			<el-form :model="form" :rules="rules" ref="form" label-width="135px">
				<el-form-item label="角色名称" prop="role_name">
					<el-input v-model="form.role_name" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="职责描述" prop="role_describe">
					<el-input v-model="form.role_describe" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否启用" prop="installed">
					<el-radio-group v-model="form.installed">
						<el-radio label="1">启用</el-radio>
						<el-radio label="0">停用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="btn-dialog" @click="createAn('form')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: {
			itemData: {},
			editableTabs: {},
			editableTabsValue: {},
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
				options: ['正式', '试用'],
				tableData: [],
				page: 1,
				currentPage: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				title: '新增项目角色',
				centerDialogVisible: false,
				form: {
					role_name: '',
					role_describe: '',
					installed: '',
				},
				rules: {
					role_name: [{
						required: true,
						message: '请输入项目角色名称',
						trigger: 'blur'
					}],
					role_describe: [{
						required: true,
						message: '请输入职责描述',
						trigger: 'blur'
					}],
					installed: [{
						required: true,
						message: '请选择是否启用',
						trigger: 'change'
					}],
				},
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
				let url = '/api/memCompany/list';
				let obj = {
					company_id: that.loginData.default_company.id,
					uid: that.loginData.user_info.id,
					page: this.page,
					page_size: this.pageSize,
				}
				if(this.itemData.app_id === 'rygl'){
					obj.username = '';
					obj.depart_name = '';
				}else if(this.itemData.app_id === 'jsgl'){
					obj.role_name = '';
					url = '/api/roleCompany/list';
				}else if(this.itemData.app_id === 'xmgl'){
					obj.role_name = '';
					url = '/api/projectRole/list';
				}
				this.formInline.username && (obj.username = this.formInline.username);
				this.formInline.depart_name && (obj.depart_name = this.formInline.depart_name);
				this.formInline.role_name && (obj.role_name = this.formInline.role_name);
				this.$axios.post(url, obj).then(res => {
					// console.log( res.data.data);
					if(res.data.code === 1){
						that.$set(that, 'pageSize', res.data.data.page_size);
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
				this.page = 1;
				this.refreshApi();
			},
			on_select(val) { // 让表格点击行可以选中
				this.$refs.multipleTable.toggleRowSelection(val);
			},
			handleCurrentChange(val) {// 切换页
				this.page = val;
				this.refreshApi();
				// console.log(`当前页: ${val}`);
			},
			roleProjectAdd(){// 点击新增
				let obj = {
					role_name: '',
					role_describe: '',
					installed: '',
				};
				this.$set(this, 'title', '新增项目角色');
				this.$set(this, 'centerDialogVisible', true);
				this.$set(this, 'form', obj);
			},
			createAn(formName){// 确认创建打印模板
				let that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						that.loading = true;
						let objPost = {
							"company_id": that.loginData.default_company.id,//打印模板id
							"role_name": this.form.role_name,
							"role_describe": this.form.role_describe,
							"installed": this.form.installed,
							"uid": that.loginData.user_info.id
						}
						if (this.form.id) {
							objPost.id = this.form.id;
						}
						this.$axios.post('/api/projectRole/save', objPost).then(res => {
							if(res.data.code === 1){
								that.$message({
									message: res.data.msg,
									type: 'success'
								});
								this.$set(this, 'centerDialogVisible', false);
								that.refreshApi();
							}else{
								that.overdueOperation(res.data.code, res.data.msg);
							}
						}).catch(err => {
							that.$message.error(err);
							that.loading = false;
						});
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			roleProjectEdit(){// 点击编辑
				let selectData = this.getSelected();
				let that = this;
				if (selectData.length > 1) {
					that.$message.error('只能选择一项进行编辑！');
					return
				} else if (selectData.length == 0) {
					that.$message.error('请选择要编辑的选项！');
					return
				}
				that.loading = true;
				let postObj = {
					uid: that.loginData.user_info.id,
					id: selectData[0].id
				}
				this.$axios.post('/api/projectRole/edit', postObj).then(res => {
					if(res.data.code === 1){
						let obj = {
							role_name: res.data.data.role_name,
							role_describe: res.data.data.role_describe,
							installed: res.data.data.installed + '',
							id: res.data.data.id,
						};
						that.$set(that, 'form', obj);
						that.$set(that, 'title', '编辑项目角色');
						that.$set(that, 'centerDialogVisible', true);
					}else{
						that.overdueOperation(res.data.code, res.data.msg);
					}
					that.loading = false;
				}).catch(err => {
					that.$message.error(err);
					that.loading = false;
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
				this.$confirm('确认删除选中的项目角色？').then(() => {
					that.loading = true;
					this.$axios.post('/api/projectRole/del', {
						'uid': that.loginData.user_info.id,
						'id': arrId
					}).then(res => {
						if(res.data.code === 1){
							that.$message({
								message: res.data.msg,
								type: 'success'
							});
							that.refreshApi();
						}else{
							that.overdueOperation(res.data.code, res.data.msg);
						}
					}).catch(err => {
						that.$message.error(err);
						that.loading = false;
					});
				}).catch(() => {});
			},
			sizeChange(val){
				this.$set(this, 'pageSize', val);
				this.refreshApi();
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.personnelmanagement{
		height: 100%;
		.table-box {
			height: calc(100% - 104px);
			&.table-box-btn{
				height: calc(100% - 164px);
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
