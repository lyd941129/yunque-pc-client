<!-- 选择弹框模板 -->
<template>
	<div class="tranferbox">
		<div class="conbox conbox-left">
			<div class="titbox">
				<h5>选择：</h5>
				<el-input size="mini" placeholder="搜索" suffix-icon="el-icon-search" v-model="filterText"></el-input>
			</div>
			<div class="wordbox">
				<!-- @node-click="" -->
				<el-tree @check="getData" :check-strictly="strictly" show-checkbox class="filter-tree" node-key="id" :data="treeData" :default-expanded-keys="defaultShowNodes"
				:props="defaultProps" :filter-node-method="filterNode" ref="tree">
					<span class="slot-t-node self-box" slot-scope="{node, data}">
						<span v-if="node.label" style="font-weight:600">{{node.label}}</span>
						<span v-if="data.username">
							<span class="userIcon">{{data.username.substring(data.username.length-1, data.username.length)}}</span>
							<span>{{data.username}}</span>
						</span>
						<span v-if="data.role_name">
							<span>{{data.role_name}}</span>
						</span>
						<span v-if="data.title">
							<span>{{data.title}}</span>
						</span>
						<span v-if="data.dict_label">
							<span>{{data.dict_label}}</span>
						</span>
					</span>
				</el-tree>
			</div>
		</div>
		<div class="conbox conbox-right">
			<div class="titbox">
				<h5>已选（{{keyarr.length}}）</h5>
			</div>
			<div class="wordbox">
				<ul>
					<li v-for="(item,index) in keyarr" :key="index">
						<div class="inli">
							<span>{{item.depart_name || item.username || item.role_name || item.title || item.dict_label}}</span>
							<i class="el-icon-circle-close" @click="removeData(item)"></i>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'ThroughTree',
		props:{
			treeData:{},
			treeSaveData:{},
			radioed:{
				
			},
			isMultiple:{
				type: Boolean,
				default: true
			},
			strictly: { // fale时，勾选父级时，选中的是没有子级的选项
				type: Boolean,
				default: true
			},
			// 只能勾选人员
			onlyPerson: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				checkList: [],
				keyarr: [],
				filterText: "",
				data: [{ //部门信息
						"id": "2111112211", //部门id
						"company_id": "154181400785031168", //企业id
						"depart_name": "开发部", //部门名称
						"parent_id": "", //上级部门id
						"sort": 2, //排序
						"child": [ //下级部门
							{
								"id": "2111112216",
								"company_id": "154181400785031168",
								"depart_name": "后端开发小组",
								"parent_id": "21111122112",
								"sort": 2,
							},
							{
								"id": "20571972329136179", //人员id
								"depart_id": "21111122113", //人员所属部门id
								"username": "张三" //人员名称
							},
							{
								"id": "205719723291361793", //人员id
								"depart_id": "21111122114", //人员所属部门id
								"username": "李四" //人员名称
							}
						]
					}
				],
				defaultProps: {
					children: "child",
					label: "depart_name",
				},
				defaultShowNodes: []
			};
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			},
			keyarr(val,old){
				if(JSON.stringify(val) !== JSON.stringify(old)){
					this.$emit('update:treeSaveData', val);
				}
				
			},
			treeSaveData(val){
				if(val){
					this.keyarr = val;
				}
			},
			treeData(){
				this.$nextTick(function(){// 加此操作是为了将递归组件做强制刷新，因为递归组件第一时间不能及时更新dom
					// console.log(this.keyarr)
					this.keyarr = this.treeSaveData;
					this.setCheckedNodes(this.keyarr);
					// 设置之前选中节点高亮及展开
					const currentKey = this.$refs.tree.getCurrentKey();
					currentKey && (this.defaultShowNodes.push(currentKey));
				});
			}
		},
		methods: {
			//关键词搜索
			filterNode(value, data) {
				if (!value) return true;
				return data.depart_name ? data.depart_name.indexOf(value) !== -1 : (data.username ? data.username.indexOf(value) !== -1 : data.role_name.indexOf(value) !== -1);
			},
			getData(a, b) {
				if (b.checkedKeys.length > 0 && this.radioed) {
					this.$refs.tree.setCheckedKeys([a.id]);
				}
				this.keyarr = []
				this.checkList = this.$refs.tree.getCheckedNodes();
				
				if (this.checkList.length != 0) {
					for (var i = 0; i < this.checkList.length; i++) {
						if (!this.checkList[i].children) {
							let data = this.checkList[i]
							if(!this.strictly && data.child){
								continue;
							}
							this.keyarr.push(data)
						}
					}

				} else {
					this.keyarr = []
				}
				if(!this.isMultiple){
					// 单选
					let delNode = this.keyarr.find((e)=>{
						return e.id !== a.id
					})
					this.keyarr.length > 1 ? this.removeData(delNode) : ""
				}
			},
			setCheckedNodes(arr) {
				this.$refs.tree.setCheckedNodes(arr);
			},
			removeData(data) {
				let checklist = this.keyarr;
				var id = data.id;
				for (var i = 0; i < checklist.length; i++) {
					if (checklist[i].id === id) {
						checklist.splice(i, 1);
					}
				}
				this.keyarr = checklist;
				this.setCheckedNodes(this.keyarr);
			},
		},
		mounted(){
			if(this.onlyPerson){
				this.treeData.map((v)=>{
					v.user_id ? "" : v.disabled = false
				})
			}
		}
	};
</script>
<style lang="less">
	.el-dialog__header{
		text-align: center;
		background: linear-gradient(90deg, #1890FF, #40A9FF);
		position: relative;
		padding: 10px 20px 10px;
		height: 70px;
		display: flex;
		justify-content: center;
		align-items: center;
		&::after{
			position:absolute; 
			left:0; 
			right:0; 
			bottom:-11px; 
			content:""; 
			z-index:1; 
			height:20px; 
			width:100%; 
			border-radius:50%; 
			background:#fff;

		}
		.el-dialog__title{
			color: white;
		}
		.el-dialog__headerbtn{
			.el-dialog__close{
				color: white;
			}
			&:hover{
				.el-dialog__close{
					color: #ced1d3;
				}
			}
		}
	}
	.el-dialog__footer{
		text-align: center;
	}
	.tranferbox{
		display: flex;
		height: 300px;
		position: relative;
		.conbox{
			flex: 1;
			h5{
				margin: 0;
				position: absolute;
				top: -22px;
			}
			padding: 20px 15px;
			border-radius: 4px;
			background-color: rgba(234, 235, 236, 1);
			&.conbox-left{
				margin-right: 10px;
				.wordbox{
					height: calc(100% - 20px);
				}
			}
			&.conbox-right{
				margin-left: 10px;
				.wordbox{
					height: 100%;
				}
			}
			.wordbox{
				overflow: auto;
				.el-tree{
					background: rgba(234, 235, 236, 1);
					.el-tree-node__content{
						background: rgba(234, 235, 236, 1);
						height: 35px;
						.self-box{
							span{
								display: flex;
								align-items: center
							}
							.userIcon{
								width: 30px;
								height: 30px;
								background: rgba(246, 191, 38, 1);
								border-radius: 50%;
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 12px;
								color: white;
								margin-right: 5px;
							}
						}
					}
				}
				ul{
					margin: 0;
					padding: 0;
					li{
						list-style: none;
						.inli{
							display: flex;
							justify-content: space-between;
							align-items: center;
						}
					}
				}
				
			}
		}
	}
	
</style>