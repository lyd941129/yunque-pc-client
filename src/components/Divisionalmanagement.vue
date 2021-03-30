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
			<el-tree class="filter-tree" :data="treeData" :props="defaultProps" default-expand-all :filter-node-method="filterNode"
			ref="tree" :expand-on-click-node="false" :highlight-current="true">
				<span class="custom-tree-node" slot-scope="{ node, data }" @click="treeClick(data)" :class="{'node-hide': data.username}">
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
				<el-button round>设置</el-button>
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
							<el-button round>添加子部门</el-button>
							<el-button round>调整排序</el-button>
							<el-button round>编辑</el-button>
						</el-row>
					</div>
					<div class="list-contant">
						<div class="empty" v-if="!dep.length">暂无数据</div>
						<div class="dep-item" v-for="item in dep" :key="item.id">
							<span>{{item.depart_name}}</span>
							<i class="icon icon-right"></i>
						</div>
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
							<el-button round type="primary">添加成员</el-button>
							<el-button round>调整部门</el-button>
							<el-button round type="danger">删除</el-button>
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
	</div>
</template>

<script>
	export default {
		props:{
			editableTabs: {},
			editableTabsValue: {},
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
				dep: [],
				tableData: [],
				loading: false,
			}
		},
		created() {
			this.refreshApi();
		},
		methods: {
			refreshApi(){// 数据获取
				var that = this;
				this.loading = true;
				let url = '/api/departCompany/list';
				let obj = {
					company_id: that.loginData.default_company.id,
					uid: that.loginData.user_info.id,
				}
				this.$axios.post(url, obj).then(res => {
					if(res.data.code === 1){
						// console.log(res.data.data);
						that.$set(that, 'treeData', res.data.data);
						that.depPeople(that.treeData[0]);
						that.operateDom();
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
			depPeople(val){
				let that = this;
				that.$set(that, 'title', val.depart_name);
				if(val.child){
					let depData = val.child.filter((s) => {
						return s.depart_name;
					});
					let peopleData = val.child.filter((s) => {
						return s.username;
					})
					that.$set(that, 'dep', depData);
					that.$set(that, 'tableData', peopleData);
				}else{
					that.$set(that, 'dep', []);
					that.$set(that, 'tableData', []);
				}
			},
			operateDom(){// 隐藏树数据中人员的节点
				this.$nextTick(() => {
					let dom = document.querySelectorAll('.node-hide');
					dom.forEach((item) => {
						item.parentNode.parentNode.style.display = 'none';
					});
				})
			},
			filterNode(value, data) {// 筛选树结构
				if (!value) return true;
				return (data.depart_name && data.depart_name.indexOf(value) !== -1);
			},
			treeClick(val) {// 树节点点击
				// console.log(val);
				this.depPeople(val);
			},
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
					}
				}
			}
		}

		.icon {
			display: inline-block;
			background: url(../assets/icon/iconWhite.png) no-repeat;
			width: 16px;
			height: 16px;

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
