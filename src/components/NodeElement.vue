<!-- 流程节点组件 -->
<template>
	<div class="node">
		<!-- 渲染普通节点 -->
		<div v-if="nodedata && nodedata.type !== 'route'" class="node-diagram">
			<div class="node-diagram-box" :class="{'start-node': nodedata.type === 'start'}">
				<div>
					<div class="title" :style="color" @click="editChange">
						<span v-show="!edit" class="node-title" :class="{'start-node-title': nodedata.type === 'start'}"><i class="icon" 
						:class="{'icon-start': nodedata.type === 'start','icon-approver': nodedata.type === 'approver', 'icon-notifier': nodedata.type === 'notifier'}"></i>{{nodedata.name === "" ? headerTitle : nodedata.name}}</span>
						<i v-if="(!edit && nodedata.type !== 'start')" class="close" @click.stop="clearNode(parentData)">X</i>
						<input v-show="edit" type="text" v-myfocus="edit" @focus="focus($event)" class="input input-small" v-model="nodedata.name" @blur="editInputblur">
					</div>
					<div class="content" @click="openProperty(nodedata)">
						<div class="text" :class="{'color-gray': (nodedata.properties && nodedata.properties.actionerRules.length && nodedata.properties.actionerRules[0].isEmpty), 'color-gray1': (nodedata.properties && !nodedata.properties.actionerRules.length)}">
							{{nodedata.properties ? nodePeopleFun(nodedata.properties.actionerRules, nodedata.type) : '发起人'}}
						</div>
						<i class="arrow icon icon-arrow"></i>
					</div>
				</div>
			</div>
			<div class="add-node-btn-box">
				<div class="add-node-btn">
					<button class="btn" type="button" @click.stop="addNodeEntrance($event, nodedata)">
						<span class="iconfont">&#43;</span>
					</button>
				</div>
			</div>
		</div>
		<!-- 渲染条件容器 -->
		<div v-if="nodedata && nodedata.type === 'route'" class="branch-wrap">
			<div class="branch-box-wrap">
				<div class="branch-box">
					<button class="add-branch" @click="addCondition(nodedata)">添加条件</button>
					<div v-for="(item, index) in nodedata.conditionNodes" :key="item.nodeId" class="col-box">
						<div :class="lineFun(index, 'top', nodedata.conditionNodes.length)"></div>
						<div :class="lineFun(index, 'bottom', nodedata.conditionNodes.length)"></div>
						<div class="condition-node">
							<div class="condition-node-box">
								<div class="auto-judge" @click="openProperty(item, index, nodedata.conditionNodes)">
									<i class="close" @click.stop="clearNode(parentData, nodedata.conditionNodes, index)">X</i>
									<div class="title-wrapper">
										<input v-if="ceshi" type="text" class="input input-small">
										<span class="editable-title">{{item.name ? item.name : `条件${index+1}`}}</span>
										<span class="priority-title">优先级{{index+1}}</span>
									</div>
									<div class="content">
										<div v-html="contionTltie(index)"></div>
									</div>
								</div>
								<div class="add-node-btn">
									<button class="btn" type="button" @click.stop="addNodeEntrance($event, item)">
										<span class="iconfont">&#43;</span>
									</button>
								</div>
							</div>
						</div>
						<NodeElement v-if="item && item.childNode" :clearNode="clearNode" :parentData="item" :nodedata="item.childNode" :addNodeEntrance="addNodeEntrance" 
						:openProperty="openProperty" :addCondition="addCondition" :selectDataDispose="selectDataDispose" :formConfigData="formConfigData"></NodeElement>
					</div>
				</div>
				<div class="add-node-btn-box">
					<div class="add-node-btn">
						<button class="btn" type="button" @click.stop="addNodeEntrance($event, nodedata)">
							<span class="iconfont">&#43;</span>
						</button>
					</div>
				</div>
			</div>
		</div>
		<NodeElement v-if="nodedata && nodedata.childNode" :clearNode="clearNode" :parentData="nodedata" :nodedata="nodedata.childNode" :addNodeEntrance="addNodeEntrance" 
		:openProperty="openProperty" :addCondition="addCondition" :selectDataDispose="selectDataDispose" :formConfigData="formConfigData"></NodeElement>
	</div>
</template>

<script>
	export default {
		name: 'NodeElement',
		components: {
		},
		props: {
			nodedata:{// 节点数据
				type: Object
			},
			addNodeEntrance: {// 显示添加节点菜单方法
				type: Function
			},
			openProperty: {
				type: Function
			},
			addCondition: {
				type: Function
			},
			parentData:{// 父节点数据
				type: Object
			},
			clearNode: {
				type: Function
			},
			formConfigData: {
			},
			selectDataDispose: {
				type: Array
			},
			
		},
		created() {
			if(!this.nodedata){
				this.color = 'background: rgba(38, 154, 153, 1)';
				return
			}
			// if(this.nodedata.type === 'start' || this.nodedata.type === 'approver'){
			// 	let name = this.nodedata.nodeId;
			// 	typeof this.formConfigData === 'object' && !this.formConfigData[name] && (this.formConfigData[name] = this.selectDataDispose);
			// }
			switch(this.nodedata.type){
				case "start": 
					this.color = 'background: rgba(38, 154, 153, 1)';
					break;
				case "approver":
					this.color = 'background: rgb(255, 148, 62)';
					this.headerTitle = '审批人';
					break;
				case "notifier":
					this.color = 'background: rgb(50, 150, 250)';
					this.headerTitle = '抄送人';
					break;
			}
		},
		data(){
			return {
				color: '',// 节点颜色
				headerTitle: '',// 节点默认标题
				ceshi: false,
				edit: false,
			}
		},
		computed:{
			lineFun: function(){// 条件容器的线
				return function (index, type, extent){
					var className = '';
					if(index == 0){
						type === 'top' ? (className = 'top-left-cover-line') : (className = 'bottom-left-cover-line');
					}else if(index == extent-1){
						type === 'top' ? (className = 'top-right-cover-line') : (className = 'bottom-right-cover-line');
					}
					return className;
				}
			},
			contionTltie: function() {
				return function (index){
					let str = '';
					let data = this.nodedata.conditionNodes[index].properties.conditions[0];
					data && data.length && data.map((item) => {
						switch(item.type){
							case "yunque_dep_condtion":
								str += '发起人属于：';
								var arrData = [];
								item.conds.length && item.conds.map((co) => {
									arrData.push(co.attrs.name);
								});
								str += arrData.join('或');
								str += '<br />';
								break;
							case "yunque_value_condtion":
								str += `${item.paramLabel}属于：`;
								str += item.paramValues.join('或');
								str += '<br />';
								break;
							case "yunque_range_condtion":
								switch(item.key){
									case "boundEqual":
										str += `${item.paramLabel} = ${item[item.key]}`;
										break;
									case "lowerBoundNotEqual":
										str += `${item.paramLabel} > ${item[item.key]}`;
										break;
									case "upperBound":
										str += `${item.paramLabel} < ${item[item.key]}`;
										break;
									case "upperBoundEqual":
										str += `${item.paramLabel} <= ${item[item.key]}`;
										break;
									case "lowerBound":
										str += `${item.paramLabel} >= ${item[item.key]}`;
										break;
									case "between":
										switch(item.between.one){
											case "lowerBoundNotEqual":
												str += `${item[item.between.one]} < ${item.paramLabel}`;
												break;
											case "lowerBound":
												str += `${item[item.between.one]} <= ${item.paramLabel}`;
												break;
										}
										str += "且";
										switch(item.between.two){
											case "upperBound":
												str += `${item.paramLabel} < ${item[item.between.two]}`;
												break;
											case "upperBoundEqual":
												str += `${item.paramLabel} <= ${item[item.between.two]}`;
												break;
										}
										break;
								}
								str += '<br />';
								break;
						}
					});
					return str ? str : '请设置条件';
				}
			},
			nodePeopleFun: function(){
				return function(actionerRules, nodeType){// 根据节点的数据去显示节点审批人
					var text = '';
					switch(nodeType){
						case "approver":
							var type = actionerRules[0].type;
							var isEmpty = actionerRules[0].isEmpty;
							var approvals = actionerRules[0].approvals;
							if(!actionerRules){
								return text = '发起人';
							}
							if(isEmpty){
								return text = '请选择审批人';
							}
							if(type === "target_approval"){
								if(approvals.length > 1){
									switch(actionerRules[0].actType){
										case "":
											var arr = [];
											approvals.length && approvals.map((item) => {
												arr.push(item.userName);
											});
											text = arr.join(',');
											break;
										case "and":
											text = `${approvals.length}人会签`;
											break;
										case "or":
											text = `${approvals.length}人或签`;
											break;
									}
								}else if(approvals.length == 1){
									text = approvals[0].userName;
								}
							}else if(type === "target_management"){
								actionerRules[0].level === '1' ? (text = '直接主管') : (text = `第${actionerRules[0].level}级主管`);
								actionerRules[0].actType === 'or' ? (text += '或签') : (actionerRules[0].actType === 'and' ? (text += '会签') : '');
							}else if(type === "target_select"){
								text = '发起人自选';
							}else if(type === "target_label"){
								text = actionerRules[0].labelNames;
								actionerRules[0].actType === 'or' ? (text += '或签') : (text += '会签');
							}else if(type === "target_project"){
								text = actionerRules[0].projectNames;
								actionerRules[0].actType === 'or' ? (text += '或签') : (text += '会签');
							}else if(type === "target_originator"){
								text = '发起人自己';
							}
							break;
						case "notifier":
							if(!actionerRules.length){
								return text = '请设置抄送人';
							}
							text = [];
							// console.log(actionerRules);
							actionerRules.map((item, index) => {
								if(index == 0 && item.type === 'target_select'){
									text.push('发起人自选');
								}else{
									switch(item.type){
										case "target_approval":
											text.push(item.approvals[0].userName);
											break;
										case "target_management":
											text.push(`第${item.level}级主管`);
											break;
										case "target_label":
											text.push(item.labelNames);
											break;
										case "target_dep":
											text.push(item.departName);
											break;
									}
								}
							});
							text = text.join(',');
							break;
					}
					return text;
				}
			}
		},
		methods:{
			editChange(){// 点击标题显示输入框
				this.edit = true;
			},
			editInputblur(){// 输入框失焦隐藏输入框
				this.edit = false;
			},
			focus(event){// 获取焦点的时候去选中焦点中的内容
				event.currentTarget.select();
			},
			// clearNode(){// 删除节点、抄送人
			// 	if(!this.parentData.childNode.childNode){
			// 		this.$set(this.parentData, 'childNode', '');
			// 	}else{
			// 		this.$set(this.parentData.childNode.childNode, 'prevId', this.parentData.childNode.prevId);
			// 		this.$set(this.parentData, 'childNode', this.parentData.childNode.childNode);
			// 	}
			// 	this.$forceUpdate();
			// 	this.$emit('welcome', '');
			// },
		},
		directives: {
			myfocus: {// 判渎值，为true就获取焦点
				update: function (el, value) {    //第二个参数传进来的是个json
					if (value) {
						el.focus()
					}
				}
			}
		},
	}
</script>

<style scoped lang="less">
	@import "../../static/css/general.less";
	// 节点样式
	.node-diagram {
		display: inline-flex;
		flex-direction: column;
		-webkit-box-pack: start;
		-ms-flex-pack: start;
		justify-content: flex-start;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		width: 100%;
		padding: 0 50px;
		position: relative;

		// 节点容器
		.node-diagram-box {
			display: -webkit-inline-box;
			display: -ms-inline-flexbox;
			display: inline-flex;
			-webkit-box-orient: vertical;
			-webkit-box-direction: normal;
			-ms-flex-direction: column;
			flex-direction: column;
			position: relative;
			width: 220px;
			min-height: 72px;
			-ms-flex-negative: 0;
			flex-shrink: 0;
			background: #FFFFFF;
			border-radius: 4px;
			cursor: pointer;

			&:after {
				pointer-events: none;
				content: '';
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				z-index: 2;
				border-radius: 4px;
				border: 1px solid transparent;
				transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
				box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
				transition: all 0.3s;
			}

			&:hover:after {
				border: 1px solid #3296FA;
				box-shadow: 0 0 6px 0 rgba(50, 150, 250, 0.3);
			}

			&:hover .close {
				display: block !important;
			}

			&:not(.start-node):before {
				content: '';
				position: absolute;
				top: -12px;
				left: 50%;
				-webkit-transform: translateX(-50%);
				transform: translateX(-50%);
				width: 0;
				height: 4px;
				border-style: solid;
				border-width: 8px 6px 4px;
				border-color: #CACACA transparent transparent;
				background: #F5F5F7;
			}

			.content {
				position: relative;
				font-size: 14px;
				padding: 16px;
				padding-right: 30px;

				.text {
					display: block;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
				}

				.arrow {
					position: absolute;
					right: 10px;
					top: 50%;
					transform: translateY(-50%);
					width: 20px;
					height: 14px;
					font-size: 14px;
					color: #979797;
					text-align: center;
					font-weight: bold;
					color: black;
					line-height: 14px;
				}
			}

			.title {
				position: relative;
				display: flex;
				align-items: center;
				padding-left: 30px;
				padding-right: 30px;
				width: 100%;
				height: 24px;
				line-height: 24px;
				font-size: 12px;
				color: #FFFFFF;
				text-align: left;
				background: #576A95;
				border-radius: 4px 4px 0px 0px;
				background: rgb(38, 154, 153);
				.node-title:not(.start-node-title){
					border-bottom: dashed 1px transparent;
					line-height: 15px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					&:hover{
						border-bottom: dashed 1px #FFFFFF;
					}
				}
				.close {
					display: none;
					position: absolute;
					right: 10px;
					top: 50%;
					transform: translateY(-50%);
					width: 20px;
					height: 20px;
					font-size: 14px;
					color: #fff;
					border-radius: 50%;
					text-align: center;
					line-height: 20px;
				}
			}
		}

		// 节点添加区域
		.add-node-btn-box {
			width: 240px;
			display: -webkit-inline-box;
			display: -ms-inline-flexbox;
			display: inline-flex;
			-ms-flex-negative: 0;
			flex-shrink: 0;
			-webkit-box-flex: 1;
			-ms-flex-positive: 1;
			position: relative;

			&::before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				z-index: -1;
				margin: auto;
				width: 2px;
				height: 100%;
				background-color: #CACACA;
			}

			.add-node-btn {
				user-select: none;
				width: 240px;
				padding: 20px 0px 32px;
				display: flex;
				-webkit-box-pack: center;
				justify-content: center;
				flex-shrink: 0;
				-webkit-box-flex: 1;
				flex-grow: 1;

				.btn {
					outline: none;
					box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
					width: 30px;
					height: 30px;
					background: #3296fa;
					border-radius: 50%;
					position: relative;
					border: none;
					line-height: 30px;
					-webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
					transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
					display: flex;
					justify-content: center;
					.iconfont {
						color: #fff;
						font-family: IconFont !important;
						font-size: 16px;
						font-style: normal;
						-webkit-font-smoothing: antialiased;
						-webkit-text-stroke-width: 0.2px;
					}

					&:hover {
						transform: scale(1.3);
						box-shadow: 0 13px 27px 0 rgba(0, 0, 0, 0.1);
					}
				}
			}
		}
	}

	// 条件样式
	.branch-wrap {
		display: inline-flex;
		width: 100%;

		.branch-box-wrap {
			display: flex;
			-webkit-box-orient: vertical;
			-webkit-box-direction: normal;
			-ms-flex-direction: column;
			flex-direction: column;
			-ms-flex-wrap: wrap;
			flex-wrap: wrap;
			-webkit-box-align: center;
			-ms-flex-align: center;
			align-items: center;
			min-height: 270px;
			width: 100%;
			-ms-flex-negative: 0;
			flex-shrink: 0;

			.branch-box {
				display: flex;
				overflow: visible;
				min-height: 180px;
				height: auto;
				border-bottom: 2px solid #cccccc;
				border-top: 2px solid #cccccc;
				position: relative;
				margin-top: 15px;

				.add-branch {
					border: none;
					outline: none;
					user-select: none;
					justify-content: center;
					font-size: 12px;
					padding: 0 10px;
					height: 30px;
					line-height: 30px;
					border-radius: 15px;
					color: #0089FF;
					background: #fff;
					box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
					position: absolute;
					top: -16px;
					left: 50%;
					transform: translateX(-50%);
					transform-origin: center center;
					cursor: pointer;
					z-index: 1;
					display: inline-flex;
					align-items: center;
					transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
					word-break: keep-all;

					&:hover {
						transform: translateX(-50%) scale(1.1);
						box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
					}
				}

				.col-box {
					display: inline-flex;
					-webkit-box-orient: vertical;
					-webkit-box-direction: normal;
					flex-direction: column;
					-webkit-box-align: center;
					align-items: center;
					position: relative;
					background: #F5F5F7;

					&:before {
						content: "";
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						z-index: 0;
						margin: auto;
						width: 2px;
						height: 100%;
						background-color: #CACACA;
					}

					.top-left-cover-line {
						position: absolute;
						height: 3px;
						width: 50%;
						background-color: #f5f5f7;
						bottom: -2px;
						left: -1px;
					}

					.top-left-cover-line {
						position: absolute;
						height: 3px;
						width: 50%;
						background-color: #f5f5f7;
						top: -2px;
						left: -1px;
					}

					.condition-node {
						min-height: 220px;
						display: inline-flex;
						-webkit-box-orient: vertical;
						-webkit-box-direction: normal;
						flex-direction: column;
						-webkit-box-flex: 1;

						.condition-node-box {
							padding-top: 30px;
							padding-right: 50px;
							padding-left: 50px;
							-webkit-box-pack: center;
							justify-content: center;
							display: inline-flex;
							-webkit-box-align: center;
							align-items: center;
							-webkit-box-orient: vertical;
							-webkit-box-direction: normal;
							flex-direction: column;
							-webkit-box-flex: 1;
							flex-grow: 1;
							position: relative;

							&::before {
								content: "";
								position: absolute;
								top: 0;
								left: 0;
								right: 0;
								bottom: 0;
								margin: auto;
								width: 2px;
								height: 100%;
								background-color: #CACACA;
							}

							.auto-judge {
								position: relative;
								width: 220px;
								min-height: 72px;
								background: #FFFFFF;
								border-radius: 4px;
								padding: 14px 19px;
								cursor: pointer;
								.close {
									display: none;
									position: absolute;
									right: 5px;
									top: 4px;
									width: 20px;
									height: 20px;
									font-size: 14px;
									color: black;
									text-align: center;
									line-height: 20px;
								}
								.title-wrapper {
									position: relative;
									font-size: 12px;
									color: #15BC83;
									text-align: left;
									line-height: 16px;
									.input.input-small{
										width: 100px;
									}
									.editable-title {
										display: inline-block;
										max-width: 120px;
										overflow: hidden;
										white-space: nowrap;
										text-overflow: ellipsis;
										line-height: 15px;
										border-bottom: dashed 1px transparent;
										&:hover{
											border-color: #15BC83;
										}
										&:before {
											content: "";
											position: absolute;
											top: 0;
											left: 0;
											bottom: 0;
											right: 40px;
										}
									}

									.priority-title {
										display: inline-block;
										float: right;
										margin-right: 10px;
										color: rgba(25, 31, 37, 0.56);
									}
								}

								.content {
									font-size: 14px;
									color: #191F25;
									text-align: left;
									margin-top: 6px;
									overflow: hidden;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 3;
									-webkit-box-orient: vertical;
								}

								&:after {
									pointer-events: none;
									content: '';
									position: absolute;
									top: 0;
									bottom: 0;
									left: 0;
									right: 0;
									z-index: 2;
									border-radius: 4px;
									border: 1px solid transparent;
									transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
									box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
								}

								&:hover:after {
									border: 1px solid #3296FA;
									box-shadow: 0 0 6px 0 rgba(50, 150, 250, 0.3);
									
								}
								&:hover{
									.close{
										display: block !important
									}
								}
							}

							.add-node-btn {
								.node-diagram .add-node-btn-box .add-node-btn()
							}
						}
					}

					.top-right-cover-line {
						position: absolute;
						height: 3px;
						width: 50%;
						background-color: #f5f5f7;
						top: -2px;
						right: -1px;
					}

					.bottom-right-cover-line {
						position: absolute;
						height: 3px;
						width: 50%;
						background-color: #f5f5f7;
						bottom: -2px;
						right: -1px;
					}

					.bottom-left-cover-line {
						position: absolute;
						height: 3px;
						width: 50%;
						background-color: #f5f5f7;
						bottom: -2px;
						left: -1px;
					}
				}
			}

			.add-node-btn-box {
				.node-diagram .add-node-btn-box()
			}
		}
	}
</style>
