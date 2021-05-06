<!-- 部门管理页面 -->
<template>
	<div class="divisionalmanagement" v-loading="loading">
		<!-- 左边树 -->
		<div class="left">
			<div class="tree-input">
				<el-input placeholder="搜索" v-model="filterText" size="medium"></el-input>
			</div>
			<!-- <div>
				<el-radio-group v-model="radio1">
					<el-radio-button label="组织架构"></el-radio-button>
					<el-radio-button label="角色"></el-radio-button>
				</el-radio-group>
			</div> -->
			<el-tree @node-click="treeClick" node-key="id" class="filter-tree" :data="treeData" :props="defaultProps" default-expand-all :filter-node-method="filterNode"
			ref="tree" :expand-on-click-node="false" :highlight-current="true">
				<span slot-scope="{ node, data }" :class="{'node-hide': data.username}">
					<i class="icon icon-grading" :class="{'icon-grading-first': data.first}"></i>
					<span>{{ data.depart_name || data.username }}</span>
				</span>
			</el-tree>
		</div>
		<!-- 右边内容 -->
		<div class="right">
			<!-- 标题 -->
			<div class="title">
				<h2>{{title}}</h2>
				<el-button round @click="setPartFn()">设置</el-button>
			</div>
			<div class="list-box">
				<!-- 下级部门 -->
				<div class="list">
					<div class="list-title">
						<i class="icon icon-grading"></i>
						<h3>下级部门</h3>
					</div>
					<div class="list-btn">
						<el-row>
							<el-button :disabled="dragShow" round @click="operatePartFn(1)">添加子部门</el-button>
							<el-button :disabled="dragShow" v-if="dep.length" round @click="operatePartFn(2)">调整排序</el-button>
							<!-- <el-button round @click="operatePartFn(3)">编辑</el-button> -->
						</el-row>
					</div>
					<div class="list-contant">
						<div class="empty" v-if="!dep.length">暂无数据</div>
						<div v-show="dragShow && dep.length" class="drag-operate">
							<span>上下移动部门调整位置</span>
							<el-link type="primary" :underline="false" @click="saveDragFn()">保存</el-link>
							<el-link type="primary" :underline="false" @click="cancelDragFn()">取消</el-link>
						</div>
						<draggable handle=".drag-item" v-model="dep" :group="{ name: 'people', pull: 'clone', put: false }">
							<!-- <transition-group> -->
								<div @click="!dragShow && throughDepFn(item)" class="dep-item" v-for="item in dep" :key="item.id">
									<span v-show="dragShow" @click.stop class="drag-item">
										<i class="icon icon-drag"></i>
									</span>
									<span class="average">{{item.depart_name}}</span>
									<el-link v-show="!dragShow" type="primary" :underline="false" @click.stop="operatePartFn(3,item)">编辑</el-link>
									<el-link v-show="!dragShow" type="danger" :underline="false" @click.stop="operatePartFn(4,item)">删除</el-link>
									<i v-show="!dragShow" class="icon icon-right"></i>
								</div>
							<!-- </transition-group> -->
							
						</draggable>
						

					</div>
				</div>
				<!-- 部门人员 -->
				<div class="list" style="margin-top: 20px;">
					<div class="list-title">
						<i class="icon icon-person"></i>
						<h3>部门人员</h3>
					</div>
					<div class="list-btn">
						<el-row>
							<el-button @click="operatePersonFn(1)" round type="primary">添加成员</el-button>
							<el-button @click="operatePersonFn(2)" round>调整部门</el-button>
							<el-button @click="operatePersonFn(3)" round type="danger">删除</el-button>
						</el-row>
					</div>
					<div class="list-contant">
						<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;" height="100%">
							<el-table-column type="selection" width="55"></el-table-column>
							<el-table-column prop="username" label="姓名"></el-table-column>
							<!-- <el-table-column prop="job" label="工号"></el-table-column> -->
							<!-- <el-table-column prop="position" label="职位"></el-table-column> -->
							<el-table-column prop="phone" label="手机号"></el-table-column>
							<!-- <el-table-column prop="mailbox" label="邮箱"></el-table-column> -->
						</el-table>
					</div>
				</div>
			</div>
		</div>
		<!-- 弹框 -->
		<el-dialog :title="dalogTitle" :visible.sync="centerDialogVisible" center width='530px'>
			<el-form :model="depEdit" :rules="rules.depEdit" ref="form" label-width="135px">
				<el-form-item label="部门名称" prop="depart_name">
					<el-input v-model="depEdit.depart_name" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="上级部门" prop="dict_sort">
					<!-- <el-input v-model="depEdit.dict_sort" autocomplete="off"></el-input> -->
					<el-cascader class="w-100" 
					placeholder="默认空则是最顶级目录" 
					clearable 
					v-model="depEdit.showDep" 
					:options="treeData" 
					:props="depConfig" 
					></el-cascader>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="btn-dialog" @click="sureFn('form')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import draggable from 'vuedraggable'
	export default {
		props:{
			editableTabs: {},
			editableTabsValue: {},
		},
		components: {
			draggable
		},
		data() {
			return {
				title: '',
				filterText: '',
				treeData: [],
				defaultProps: {
					children: 'child',
					label: 'depart_name'
				},
				// 拖拽的前部门数据
				depDrag: [],
				// 部门数据
				dep: [],
				tableData: [],
				loading: false,
				// 选中的节点data
				checkData: {},
				// 部门编辑
				depEdit: {
					depart_id: "",
					parent_id: "",
					depart_name: "",
					showDep: []
				},
				// 验证
				rules: {
					// 部门编辑的验证
					depEdit: {
						depart_name: [{
							required: true,
							message: '请输入数据名称',
							trigger: 'blur'
						}]
					}
				},
				// 弹框显示
				centerDialogVisible: false,
				// 弹框标题
				dalogTitle: "",
				// 上级部门选择的配置
				depConfig: {
					label: "depart_name",
					children: "child",
					value: "id",
					checkStrictly: true
				},
				// 部门编辑或修改
				isDepAdd: false,
				// 是否显示拖动按钮
				dragShow: false
			}
		},
		created() {
			this.refreshApi();
		},
		methods: {
			// 拖拽保存
			saveDragFn(){
				let that = this;
				that.$confirm('确定要保存排序操作吗？','提示',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					
					console.log(that.dep)
					let arr = [];
					that.dep.map((v,i)=>{
						arr.push({
							id: v.id,
							sort: i + 1
						})
					})
					let option = {
						url: "/custom/depart/sort",
						option: {
							"param": arr
						}
					}
					that.postFn(option,function(){
						// 成功
						that.dragShow = false
						that.$refs.tree.updateKeyChildren(that.checkData.id,JSON.parse(JSON.stringify(that.dep)))
					})
				}).catch(err => {
					
				});
			},
			// 拖拽取消
			cancelDragFn(){
				// 数据还原
				let that = this;
				that.$confirm('确定要取消排序操作吗？','提示',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.$set(that,'dep',that.depDrag)
					that.dragShow = false
				}).catch(err => {
					
				});
			},
			refreshApi(){// 数据获取
				var that = this;
				this.loading = true;
				let url = '/custom/depart/lists';
				this.$axios.get(url).then(res => {
					if(res.data.code === 1){
						// console.log(res.data.data);
						that.$set(that, 'treeData', res.data.data);
						that.$nextTick(()=>{
							that.checkData = that.$refs.tree.getNode(that.checkData.id || that.treeData[0].id).data
							that.childDep(that.checkData)
							that.childPerson(that.checkData)
							// 当前选中的目录
							that.$refs.tree.setCurrentKey(that.checkData.id)
						})

						// that.operateDom();
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
			childPerson(val){
				this.loading = true;
				let url = '/custom/depart/user',
					that = this,
					obj = {
						params:{
							depart_id: val.id
						}
					};
				this.$axios.get(url,obj).then(res => {
					console.log(res)
					if(res.data.code === 1){
						that.$set(that, 'tableData', res.data.data);
					}else{
						that.overdueOperation(res.data.code, res.data.msg);
					}
					this.loading = false;
				}).catch(err => {
					this.loading = false;
					this.$message({
						message: err,
						type: 'error'
					});
				});
			},
			childDep(val){
				let that = this;
				that.$set(that, 'title', val.depart_name);
				if(val.child){
					that.$set(that, 'dep', val.child);
				}else{
					that.$set(that, 'dep', []);
				}
			},
			// 新接口的部门树没有人员，用不到了
/* 			operateDom(){// 隐藏树数据中人员的节点
				this.$nextTick(() => {
					let dom = document.querySelectorAll('.node-hide');
					dom.forEach((item) => {
						item.parentNode.parentNode.style.display = 'none';
					});
				})
			}, */
			filterNode(value, data) {// 筛选树结构
				if (!value) return true;
				return (data.depart_name && data.depart_name.indexOf(value) !== -1);
			},
			treeClick(val) {// 树节点点击
				let that = this;
				if(that.dragShow){
					// 拖拽排序打开的时候，进行提示
					that.$confirm('该操作会取消正在进行的<span class="red">【部门排序操作】</span>，确认继续吗？','提示',{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						dangerouslyUseHTMLString: true,
						type: 'warning'
					}).then(() => {
						that.dragShow = false
						that.checkData = val
						that.childDep(val);
						that.childPerson(val);
					}).catch(err => {
						that.$refs.tree.setCurrentKey(that.checkData.id)
					});
				}else{
					that.checkData = val
					that.childDep(val);
					that.childPerson(val);
				}
			},
			// 设置当前部门名称和上级部门
			setPartFn(data){
				let node = data || this.$refs.tree.getCurrentNode(),
					showDep = node.label.split(",");
				this.centerDialogVisible = true;
				this.depEdit.depart_name = node.depart_name || ""
				this.depEdit.depart_id = node.id || ""
				this.depEdit.parent_id = node.parent_id
				// id存在表明是编辑,否则便是新增
				if(node.id){
					showDep.pop()
					this.isDepAdd = false
				}else{
					this.isDepAdd = true
				}
				this.depEdit.showDep = showDep
				console.log(node)
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
			// 模态框确认
			sureFn(formName){
				let that = this;
				that.$refs[formName].validate((valid)=>{
					if(valid){
						// 验证成功
						that.depEdit.parent_id = that.depEdit.showDep.slice(-1)[0] || ""
						// that.depEdit.showDep = ""
						let url = "/custom/depart/edit";
						if(that.isDepAdd){
							url = "/custom/depart/add";
						}
						that.postFn({
							url: url,
							option: that.depEdit
						},function(){
							that.centerDialogVisible = false;
							that.refreshApi();
						})
					}else{
						return false
					}
				})
			},
			// 穿透到该目录
			throughDepFn(data){
				this.checkData = data
				this.childDep(data)
				this.childPerson(data)
				this.$refs.tree.setCurrentKey(this.checkData.id)
			},
			/* 下级部门列表操作按钮
			type: 1 添加子部门；
				  2 调整排序
				  3 编辑
				  4 删除
			 */
			operatePartFn(type,data){
				let that = this;
				switch (type) {
					case 1:
						that.setPartFn({
							label: that.checkData.label,
							parent_id: that.checkData.id
						})
						break;
					case 2:
						that.dragShow = true
						that.depDrag = JSON.parse(JSON.stringify(that.dep))
						break;
					case 3:
						that.setPartFn(data)
						break;
					case 4:
						// 删除
						let url = "/custom/depart/del"
						that.$confirm('确认删除<span class="red">【' + data.depart_name + '】</span>吗？','提示',{
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							dangerouslyUseHTMLString: true,
							type: 'warning'
						}).then(() => {
							that.postFn({
								url: url,
								option: {
									depart_id: data.id
								}
							},function(){
								that.refreshApi();
							})

						}).catch(err => {
							
						});
						break;
					default:
						break;
				}
			},
			/* 部门人员操作按钮
			type: 1 添加成员；
				  2 调整部门
				  3 删除
			 */
			operatePersonFn(type){
				let that = this;
				switch (type) {
					case 1:
						
						break;
					case 2:
						
						break;
					case 3:
						let selectData = this.$refs.multipleTable.selection;
						if(selectData.length === 0){
							this.$message.error('请至少勾选一项');
							return
						}
						let arr = []
						selectData.map((v)=>{
							arr.push(v.id)
						})
						that.postFn({
							url: "/custom/depart/remove_user",
							option: {
								depart_id: that.checkData.id,
								user_ids: arr
							}
						},(res)=>{
							that.childPerson(that.checkData);
						})
						break;
					default:
						break;
				}
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
	}
</script>

<style lang="less" scoped="scoped">
	.divisionalmanagement {
		height: 100%;
		display: flex;

		.left {
			height: 100%;
			width: 260px;
			background-color: rgba(244, 246, 248, 1);
			border: 1px solid rgba(234, 235, 236, 1);
			margin-right: 28px;

			.tree-input {
				padding: 18px 10px;
			}

			.el-tree {
				background-color: rgba(244, 246, 248, 1);
			}
		}

		.right {
			width: calc(100% - 260px);
			.title {
				display: flex;
				align-items: center;

				h2 {
					margin-right: 20px;
				}
			}
			.list-box{
				height: calc(100% - 65px);
				.list {
					height: 50%;
					.list-title {
						display: flex;
						align-items: center;
				
						h3 {
							margin: 0;
						}
					}
				
					.list-btn {
						height: 38px;
						display: flex;
						align-items: center;
						background-color: rgba(236, 239, 244, 1);
						margin-top: 20px;
				
						button {
							margin: 0 10px;
						}
					}
				
					.list-contant {
						height: calc(100% - 102px);
						overflow: auto;
						.dep-item {
							height: 38px;
							padding: 10px 20px;
							display: flex;
							justify-content: space-between;
							border-bottom: 1px solid #DDDDDD;
							transition: all .3s;
							&:hover {
								background-color: rgba(247, 247, 247, 1);
							}
							.el-link{
								margin-right: 10px;
							}
							.drag-item{
								cursor: pointer;
								padding: 2px 10px 0 0;
							}
						}
						.empty{
							height: 100%;
							text-align: center;
							width: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							color: #909399;
						}
						.drag-operate{
							height: 38px;
							line-height: 38px;
							text-align: center;
							background-color: #FFFADA;
							span{
								vertical-align: middle;
							}
							.el-link{
								margin-left: 17px;
							}
						}
					}
				}
			}
		}

		.icon {
			display: inline-block;
			background: url(../assets/icon/iconWhite.png) no-repeat;
			width: 16px;
			height: 16px;
			&.icon-drag{
				width: 20px;
				height: 12px;
				background-position: -0px -434px;
			}
			&.icon-grading {
				background-position: -494px -136px;
				margin-top: 3px;
				margin-right: 10px;

				&.icon-grading-first {
					background-position: -469px -136px;
				}
			}

			&.icon-right {
				background-position: 0 -160px;
			}

			&.icon-person {
				background-position: -389px -136px;
				margin-top: 3px;
				margin-right: 10px;
			}
		}
	}
</style>
<style lang="less">
	.red {
		color: #e31613;
	}
	.divisionalmanagement {
		.el-table::before{
			height: 0;
		}
		.el-tree-node__content:has(.node-hide){
			display: none;
		}
		.el-button.is-round {
			height: 26px;
			line-height: 26px;
			padding: 0;
			max-width: 102px;
			text-align: center;
			padding: 0 16px;
		}

		.el-tree-node__content {
			transition: all .3s;
		}

		.el-tree-node__content:hover {
			background-color: rgba(24, 144, 255, 1);
			color: white;

			.el-icon-caret-right:not(.is-leaf):before {
				color: white;
			}
		}

		.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
			background-color: rgba(24, 144, 255, 1);
			color: white;

			.el-icon-caret-right:not(.is-leaf):before {
				color: white;
			}
		}

		.el-icon-caret-right:before {
			font-size: 18px;
		}
		.el-table thead tr th{
			background-color: white;
			font-weight: 600;
			color: black;
		}
	}
</style>
