<!-- 部门管理页面 -->
<template>
	<div class="divisionalmanagement" v-loading="loading">
		<!-- 左边树 -->
		<div class="left">
			<div class="tree-input">
				<el-input placeholder="搜索" v-model="filterText" size="medium"></el-input>
			</div>
			<div class="tab-toggle">
				<el-radio-group v-model="depRole" @change="tabChange" size="small">
					<el-radio-button label="bmgl">组织架构</el-radio-button>
					<el-radio-button label="jsgl">角色</el-radio-button>
				</el-radio-group>
			</div>
			<el-row v-show="depRole === 'jsgl'" class="tole-tree-operate dis-flex">
				<div class="average ar">
					<el-button size="small" round @click="roleEditFn(1)">添加角色组</el-button>
				</div>
				<div class="average al">
					<el-button size="small" round @click="roleEditFn(2)">添加角色</el-button>
				</div>
				
			</el-row>
			<el-tree v-if="toggleTree" @node-click="treeClick" node-key="id" class="filter-tree" :data="treeData" :props="defaultProps" default-expand-all :filter-node-method="filterNode"
			ref="tree" :expand-on-click-node="false" :highlight-current="true">
				<span class="average tree-item" slot-scope="{ node, data }">
					<i class="icon" :class="[{'icon-grading-first': data.first},treeIcon(data)]"></i>
					<span>{{ data.depart_name || data.username || data.group_name || data.role_name}}</span>
					<i v-if="depRole === 'jsgl'" class="role-edit icon icon-role-edit" @click.stop="roleEditFn(data.group_name ? 1 : 2,data)"></i>
				</span>
			</el-tree>
		</div>
		<!-- 右边内容 -->
		<div class="right">
			<template v-if="depRole === 'bmgl'">
				<!-- 标题 -->
				<div v-show="JSON.stringify(checkData) !== '{}'" class="title">
					<h2>{{title}}</h2>
					<el-button round @click="setPartFn()">设置</el-button>
				</div>
				<div class="list-box">
					<!-- 下级部门 -->
					<div class="list">
						<div v-show="JSON.stringify(checkData) !== '{}'" class="list-title">
							<i class="icon icon-grading"></i>
							<h3>下级部门</h3>
						</div>
						<div class="list-btn">
							<el-row>
								<el-button :disabled="dragShow" round @click="operatePartFn(1)">添加子部门</el-button>
								<el-button :disabled="dragShow" v-if="dep.length" round @click="operatePartFn(2)">调整排序</el-button>
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
					<div v-show="JSON.stringify(checkData) !== '{}'" class="list" style="margin-top: 20px;">
						<div class="list-title">
							<i class="icon icon-persons"></i>
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
			</template>
			<template v-if="depRole === 'jsgl'">
				<!-- 标题 -->
				<template v-if="rolePersonShow">
					<div class="title">
						<h2><i class="icon icon-person-big"></i>{{title}}</h2>
						<el-button round @click="roleEditFn(2,checkData)">设置</el-button>
					</div>
					<div class="list-box">
						<!-- 下级部门 -->
						<div class="list role-list">
							<div class="list-btn">
								<el-row>
									<el-button :disabled="dragShow" round @click="operatePersonFn(1)">添加成员</el-button>
									<el-button :disabled="dragShow" round @click="operatePersonFn(3)">批量移除</el-button>
								</el-row>
							</div>
							<div class="list-contant">
								<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;" height="100%">
									<el-table-column type="selection" width="55"></el-table-column>
									<el-table-column prop="username" label="姓名"></el-table-column>
									<el-table-column prop="depart_name" label="部门"></el-table-column>
									<el-table-column prop="job_name" label="职位"></el-table-column>
									<el-table-column prop="phone" label="手机号"></el-table-column>
								</el-table>
							</div>
						</div>
						
					</div>
				</template>
				<template v-if="!rolePersonShow">
					<div>
						<div class="no-treedata">
							<img width="100%" src="./../assets/img/role-bg.png" alt="" srcset="">
						</div>
						<el-row class="role-operate ac">
							<el-col :span="6" :offset="3">
								<el-button type="primary" size="small" @click="roleEditFn(2)">添加角色</el-button>
							</el-col>
							<el-col :span="6" :offset="3">
								<el-button type="primary" size="small" @click="roleEditFn(1)">添加角色组</el-button>
							</el-col>
							
							
						</el-row>
					</div>
				</template>
				
			</template>

		</div>
		<!-- 部门新增/编辑弹框 -->
		<el-dialog :title="dalogTitle" :visible.sync="centerDialogVisible" center width='530px'>
			<el-form :model="depEdit" :rules="rules.depEdit" ref="form" label-width="135px">
				<el-form-item label="部门名称" prop="depart_name">
					<el-input v-model="depEdit.depart_name" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="上级部门" prop="dict_sort">
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
				<el-button v-show="depEdit.depart_id" type="danger" class="btn-dialog" @click="sureFn('form','del')">删 除</el-button>
			</span>
		</el-dialog>
		<!-- 添加成员弹框 -->
		<el-dialog :title="dalogTitle" :visible.sync="personEditDalog" width='530px'>
			<ThroughTree :strictly="strictly" :isMultiple="throuthMultiple" :treeData="personLists" :treeSaveData.sync="savePersonData"></ThroughTree>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addPersonFn">确 认</el-button>
				<el-button @click="personEditDalog = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 添加角色弹框 -->
		<el-dialog :title="dalogTitle" :visible.sync="roleEditDalog" center width='530px'>
			<el-form :model="roleEdit" :rules="rules.roleEdit" ref="roleForm" label-width="135px">
				<el-form-item label="角色名称" prop="role_name">
					<el-input v-model="roleEdit.role_name" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="分组到" prop="group_id">
					  <el-select class="w-100" v-model="roleEdit.group_id" filterable placeholder="请选择">
						<el-option
						v-for="item in treeData"
						:key="item.id"
						:label="item.group_name"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否是管理员" prop="is_manager">
					<el-radio v-model="roleEdit.is_manager" :label="1">是</el-radio>
					<el-radio v-model="roleEdit.is_manager" :label="0">否</el-radio>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="btn-dialog" @click="sureFn('roleForm')">确 定</el-button>
				<el-button v-show="roleEdit.id" type="danger" class="btn-dialog" @click="sureFn('roleForm','del')">删 除</el-button>
			</span>
		</el-dialog>
		<!-- 添加角色分组弹框 -->
		<el-dialog :title="dalogTitle" :visible.sync="roleGroupEditDalog" center width='530px'>
			<el-form :model="roleGroupEdit" :rules="rules.roleGroupEdit" ref="roleGroupForm" label-width="135px">
				<el-form-item label="分组名称" prop="group_name">
					<el-input v-model="roleGroupEdit.group_name" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input v-model="roleGroupEdit.sort" autocomplete="off" clearable></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="btn-dialog" @click="sureFn('roleGroupForm')">保 存</el-button>
				<el-button v-show="roleGroupEdit.id" type="danger" class="btn-dialog" @click="sureFn('roleGroupForm','del')">删 除</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import draggable from 'vuedraggable'
	import ThroughTree from './ThroughTree.vue';
	export default {
		props:{
			itemData: {},
			editableTabs: {},
			editableTabsValue: {},
		},
		components: {
			draggable,
			ThroughTree
		},
		computed:{
			// 左侧tree的icon
			treeIcon(){
				let that = this;
				return function(data){
					return that.depRole === 'jsgl' ? data.group_name ? "icon-folder" : 'icon-person' : 'icon-grading';
				}
			},
			// 左侧tree配置
			defaultProps(){
				let props = {
					children: 'child',
					label: 'depart_name'
				};
				if(this.depRole === "jsgl"){
					props.children = "role"
					props.label = "group_name"
				}
				this.toggleTree = false
				this.$nextTick(()=>{
					this.toggleTree = true
				})
				return props
			}
		},
		data() {
			return {
				// 显示角色人员列表
				rolePersonShow: false,
				// tree父子关联
				strictly: true,
				// 部门 和 角色 切换
				toggleTree: true,
				// 部门 | 角色
				depRole: "",
				title: '',
				filterText: '',
				treeData: [],
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
				// 角色编辑
				roleEdit: {
					id: "",
					group_id: "",
					role_name: "",
					is_manager: 0
				},
				// 角色分组编辑
				roleGroupEdit: {
					id: "",
					group_name: "",
					sort: 1
				},
				// 部门添加成员
				personEdit: {
					depart_id: "",
					user_ids: []
				},
				// 选择人员列表
				personLists: [],
				savePersonData: [],
				// 验证
				rules: {
					// 部门编辑的验证
					depEdit: {
						depart_name: [{
							required: true,
							message: '请输入数据名称',
							trigger: 'blur'
						}]
					},
					// 角色编辑的验证
					roleEdit: {
						
					},
					// 角色组编辑的验证
					roleGroupEdit:{

					}
				},
				// 弹框显示
				centerDialogVisible: false,
				personEditDalog: false,
				roleEditDalog: false,
				roleGroupEditDalog: false,
				// 弹框标题
				dalogTitle: "",
				// throughTree是否多选
				throuthMultiple: true,
				// 上级部门选择的配置
				depConfig: {
					label: "depart_name",
					children: "child",
					value: "id",
					checkStrictly: true
				},
				// 部门编辑或修改
				isDepAdd: false,
				// 角色编辑或修改
				isRoleAdd: false,
				// 是否显示拖动按钮
				dragShow: false,
				// 添加人员|调整部门数据
				addUser:{
					depart_id: "",
					user_ids: []
				}
			}
		},
		created() {
			// 部门管理 | 角色管理
			this.depRole = this.itemData.app_id;
			this.refreshApi();
		},
		methods: {
			/* 
				type: 1|添加角色组;2|添加角色;
				data: 编辑时候的数据;
			 */
			roleEditFn(type,data){
				let that = this;
				that.isRoleAdd = true
				switch (type) {
					case 1:
						// 角色组
						if(data){
							// 编辑
							that.isRoleAdd = false;
							that.dalogTitle = "编辑角色组";
							that.roleGroupEdit = {
								id: data.id,
								group_name: data.group_name,
								sort: data.sort
							}
						}else{
							// 新增
							that.dalogTitle = "添加角色组"
							that.roleGroupEdit = {
								id: "",
								group_name: "",
								sort: 1
							}
						}
						
						that.roleGroupEditDalog = true
						break;
					case 2:
						// 角色
						if(!that.treeData.length){
							that.$message.error('请先添加角色组，再添加角色');
							return
						}
						if(data){
							// 编辑
							that.isRoleAdd = false;
							that.dalogTitle = "编辑角色";
							that.roleEdit = {
								id: data.id,
								group_id: data.group_id,
								role_name: data.role_name,
								is_manager: data.is_manager
							}
						}else{
							// 新增
							that.dalogTitle = "添加角色"
							that.roleEdit = {
								id: "",
								group_id: that.treeData[0].id,
								role_name: "",
								is_manager: 0
							}
						}
						that.roleEditDalog = true
						break;
					default:
						break;
				}
			},
			// 编辑角色 | 角色组
			editRoleFn(){

			},
			// 角色 | 部门 tab切换
			tabChange(type){
				console.log(type)
				let that = this;
				switch (type) {
					case "bmgl":
						// 部门管理
						
						break;
					case "jsgl":
						// 角色管理
						that.dragShow = false
						break;
					default:
						break;
				}
				that.checkData = {}
				that.refreshApi()
			},
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
				if(this.depRole === "jsgl"){
					url = '/custom/role/list'
					// 角色列表
				}
				this.$axios.get(url).then(res => {
					this.loading = false;
					if(res.data.code === 1){
						// console.log(res.data.data);
						that.$set(that, 'treeData', res.data.data);
						if(!that.treeData.length){
							return
						}
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
				
				let url = '',
					that = this,
					obj = {};
				if(that.depRole === 'bmgl'){
					url = '/custom/depart/user'
					obj.params = {
						depart_id: val.id
					}
				}else{
					// jsgl
					if(!val.role_name){
						return
					}
					url = '/custom/role/user'
					obj.params = {
						role_id: val.id
					}
				}
				// debugger
				// return
				this.loading = true;
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
				that.$set(that, 'title', val.depart_name || val.group_name || val.role_name);
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
					if(that.depRole === 'jsgl'){
						if(val.group_name){
							// 角色 =》分组
							that.rolePersonShow = false
							return
						}
						that.rolePersonShow = true
					}
					that.checkData = val
					that.childDep(val);
					that.childPerson(val);
				}
			},
			// 设置当前部门名称和上级部门
			setPartFn(data){
				let node = data || this.$refs.tree.getCurrentNode(),
					showDep = [];
				if(node.label){
					showDep = node.label.split(",")
				}
				this.centerDialogVisible = true;
				this.dalogTitle = node.dalogTitle || "编辑部门"
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
			// 部门模态框确认 type = del 删除
			sureFn(formName,type){
				let that = this;
				if(type === "del"){
					// 删除(角色编辑和角色组编辑)
					let url = "",
						option = {};
					switch (formName) {
						case "roleGroupForm":
							// 删除角色组
							url = "/custom/role/del_group"
							option = {
								id : that.roleGroupEdit.id
							}
							break;
						case "roleForm":
							// 删除角色
							url = "/custom/role/del"
							option = {
								id : that.roleEdit.id
							}
							break;
						case "form":
							url = "/custom/depart/del"
							option = {
								depart_id : that.depEdit.depart_id
							}
							break;
						default:
							break;
					}
					that.$confirm('确认删除吗？','提示',{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						dangerouslyUseHTMLString: true,
						type: 'warning'
					}).then(() => {
						that.postFn({
							url: url,
							option: option
						},function(){
							that.centerDialogVisible = false;
							that.roleEditDalog = false;
							that.roleGroupEditDalog = false;
							if(option.id === that.checkData.id || option.depart_id === that.checkData.id){
								that.checkData = {}
								that.rolePersonShow = false
							}
							that.refreshApi();
						})

					}).catch(err => {
						
					});
					return
				}
				that.$refs[formName].validate((valid)=>{
					if(valid){
						// 验证成功
						// that.depEdit.showDep = ""
						let url = "",
							option = {};
						if(formName === "form"){
							// 部门管理
							that.depEdit.parent_id = that.depEdit.showDep.slice(-1)[0] || ""
							option = that.depEdit
							if(that.isDepAdd){
								url = "/custom/depart/add";
							}else{
								url = "/custom/depart/edit";
							}
						}else if(formName === 'roleForm'){
							// 角色管理
							option = that.roleEdit
							if(that.isRoleAdd){
								// 新增
								url = "/custom/role/add"
							}else{
								url = "/custom/role/edit"
							}
						}else if(formName === 'roleGroupForm'){
							// 角色组管理
							option = that.roleGroupEdit
							if(that.isRoleAdd){
								// 新增
								url = "/custom/role/add_group"
							}else{
								url = "custom/role/edit_group"
							}
						}
						console.log(option)
						// return

						that.postFn({
							url: url,
							option: option
						},function(){
							that.centerDialogVisible = false;
							that.roleEditDalog = false;
							that.roleGroupEditDalog = false;
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
				// this.$set(this,"savePersonData",JSON.parse(JSON.stringify([that.checkData])))
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
							parent_id: that.checkData.id,
							dalogTitle: "添加子部门"
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
			// 部门人员添加确认|调整部门的确认|角色添加人员
			addPersonFn(){
				let that = this,
					url = "",
					option = {};
				console.log(this.savePersonData)
				console.log(this.checkData)
				console.log(that.savePersonData)
				
				if(that.savePersonData[0].depart_name){
					// 部门调整
					that.addUser.depart_id = that.savePersonData[0].id
				}else{
					// 添加成员
					that.addUser.depart_id = that.checkData.id
					that.savePersonData.map((v)=>{
						that.addUser.user_ids.push(v.id)
					})
				}
				if(that.depRole === "bmgl"){
					url = "/custom/depart/add_user";
					option = that.addUser
				}else{
					url = "/custom/role/add_user";
					option = {
						role_id: that.checkData.id,
						user_ids: that.addUser.user_ids
					}
				}
				// 选中的数据
				that.postFn({
					url: url,
					option: option
				},(res)=>{
					that.personEditDalog = false
					that.$message.success(res.msg);
					that.childPerson(that.checkData);
				})
			},
			/* 部门人员操作按钮 | 角色人员操作按钮
			type: 1 添加成员；
				  2 调整部门
				  3 删除
			 */
			operatePersonFn(type){
				let that = this,
					selectData = that.$refs.multipleTable.selection;
				switch (type) {
					case 1:
						that.dalogTitle = "添加成员"
						that.loading = true;
						that.throuthMultiple = true;
						let url = "",
							obj = {};
						if(that.depRole === 'bmgl'){
							// 部门管理
							that.strictly = true;
							url = "/custom/depart/select_user";
							obj.params = {
								type: 2
							}
						}else{
							// jsgl角色管理
							that.strictly = false;
							url = "/custom/depart/tree";
							obj.params = {}
						}
						
						that.$axios.get(url,obj).then(res => {
							console.log(res)
							if(res.data.code === 1){
								
								that.personEditDalog = true;
								that.savePersonData = [];
								that.personLists = res.data.data;
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
						});

						break;
					case 2:
						if(selectData.length === 0){
							that.$message.error('请至少勾选一项');
							return
						}
						that.addUser.user_ids = []
						selectData.map((v)=>{
							that.addUser.user_ids.push(v.id)
						})
						that.dalogTitle = "调整部门"
						that.strictly = true;
						that.personEditDalog = true;
						that.throuthMultiple = false;
						that.$nextTick(()=>{
							that.$set(that,"savePersonData",[that.checkData])
							that.$set(that,"personLists",that.treeData)
						})

						break;
					case 3:
						if(selectData.length === 0){
							that.$message.error('请至少勾选一项');
							return
						}
						// 删除
						that.$confirm('确定要删除<span class="red">【选中的人员】</span>吗？','提示',{
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							dangerouslyUseHTMLString: true,
							type: 'warning'
						}).then(() => {
							let arr = []
							selectData.map((v)=>{
								arr.push(v.id)
							})
							let url = "",
								option = {}
							if(that.depRole === 'bmgl'){
								// 部门管理
								url = "/custom/depart/remove_user";
								option = {
									depart_id: that.checkData.id,
									user_ids: arr
								}
							}else{
								// jsgl角色管理
								url = "/custom/role/remove_user";
								option = {
									role_id: that.checkData.id,
									user_ids: arr
								}
							}

							that.postFn({
								url: url,
								option: option
							},(res)=>{
								// 删除成功
								that.$message.success(res.msg);
								that.childPerson(that.checkData);
							})
						}).catch(err => {
							
						});












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
				padding: 18px 10px 20px;
			}
			.tab-toggle{
				padding: 0 10px 18px;

				.el-radio-group{
					width: 100%;
					.el-radio-button{
						width: 50%;
						overflow: hidden;
						/deep/ .el-radio-button__inner{
							width: 100%;
						}
						&:first-of-type /deep/ .el-radio-button__inner{
							border-top-left-radius: 16px;
							border-bottom-left-radius: 16px;
						}
						&:last-of-type /deep/ .el-radio-button__inner{
							border-top-right-radius: 16px;
							border-bottom-right-radius: 16px;
						}
						
					}
				}
				
			}
			.tole-tree-operate{
				margin-top: -6px;
				padding-bottom: 16px;
				.el-button{
					margin: 0 8px;
				}
			}
			.el-tree {
				background-color: rgba(244, 246, 248, 1);
			}
			.filter-tree{
				.tree-item{
					.role-edit{
						float: right;
						padding: 5px 10px;
						display: none;
					}
					&:hover{
						.role-edit{
							display: block;
						}
					}
				}
				
			}
		}

		.right {
			width: calc(100% - 288px);
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
					&.role-list{
						height: 100%;
					}
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
			&.icon-role-edit{
				background-position: -415px -136px;
				margin-top: 3px;
				margin-right: 10px;
			}
			&.icon-person {
				background-position: -389px -136px;
				margin-top: 3px;
				margin-right: 10px;
			}
			&.icon-person-big{
				width: 20px;
				height: 20px;
				background-position: 0 -304px;
				margin: -3px 10px 0 0;
    			vertical-align: middle;
			}
			&.icon-persons{
				width: 20px;
				height: 20px;
				background-position: -30px -304px;
				margin-right: 10px;
    			vertical-align: middle;
			}
			&.icon-folder{
				background-position: -363px -136px;
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
			background-color: #E7EAEF;
			// color: white;

			.el-icon-caret-right:not(.is-leaf):before {
				color: white;
			}
		}

		.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
			background-color: rgba(24, 144, 255, 1);
			color: white;
			.icon-role-edit{
				background-position: -597px -136px;
			}
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
