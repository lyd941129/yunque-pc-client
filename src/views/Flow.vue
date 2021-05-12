<!-- 流程设计页面 -->
<template>
	<div ref="flow" class="flow">
		<!-- 缩放按钮 -->
		<div class="zoom">
			<div class="zoom-out" @click="scaleMinus">-</div>
			<span>{{percentage}}%</span>
			<div class="zoom-in" @click="scaleAdd">+</div>
		</div>
		<!-- 中间内容区域 -->
		<div class="container" @click="closeEntrance">
			<div class="container-scale" :style="scaleFun">
				<NodeElement v-if="refresh && refresh2" :clearNode="clearNode" :nodedata="flowData" :selectDataDispose="selectDataDispose" :addNodeEntrance="addNodeEntrance" :openProperty="openProperty" 
				:addCondition="addCondition" :formConfigData="formConfigData" :appStyle='appStyle'></NodeElement>
				<div class="end-node">
					<div class="end-node-circle"></div>
					<div class="end-node-text">流程结束</div>
				</div>
			</div>
		</div>
		<!-- 添加节点菜单 -->
		<transition name="fade">
			<div v-show="show" class="ant-popover-inner-content" :style="addNodeEntranceFun">
				<div class="add-node-popover">
					<div class="add-node-popover-body">
						<a class="add-node-popover-item approver" @click="addNode('approver')" v-show="appStyle==2">
							<div class="item-wrapper">
								<i class="icon icon-add-approver"></i>
							</div>
							<span>审批人</span>
						</a>
						<a class="add-node-popover-item notifier" @click="addNode('notifier')">
							<div class="item-wrapper">
								<i class="icon icon-add-notifier"></i>
							</div>
							<span>抄送人</span>
						</a>
						<a class="add-node-popover-item route" @click="addNode('route')" v-show="appStyle==2">
							<div class="item-wrapper">
								<i class="icon icon-add-route"></i>
							</div>
							<span>条件分支</span>
						</a>
					</div>
				</div>
			</div>
		</transition>
		<!-- 右边节点属性编辑区域 -->
		<Property :property="property" :colseProperty="colseProperty" :qwer="qwer" :formData="selectData" :switchover="switchover" :jurisdiction="jurisdiction"
		:nodeData.sync="nodeData" :conditionIndex="conditionIndex ? conditionIndex : 0" :sysCode="sysCode" :conNodes="conNodes" :formConfigData.sync="formConfigData"
		:selectDataDispose="selectDataDispose"></Property>
		<!-- <button @click="dataPost" style="position: fixed;z-index: 12321321;bottom: 0;">提交</button> -->
	</div>
</template>

<script>
	// @ is an alias to /src
	import NodeElement from '../components/NodeElement.vue';
	import Property from '../components/Property.vue';
	export default {
		props:{
			flowData:{
				type: Object
			},
			sysCode:{
				type: Object
			},
			selectData: {
				type: Array
			},
			formConfigData: {
			},
			selectDataDispose: {
				type: Array
			},
			appStyle: {}
		},
		components: {
			NodeElement,
			Property,
		},
		data() {
			return {
				flow: {
					"name": "发起人",
					"nodeId": "sid-startevent",
					"type": "start",
					"childNode": {
						"name": "", // 节点名称;默认
						"type": "approver", // 节点类型; approver: 审批类型、start: 开始类型、route: 条件分支类型、condition: 条件类型、notifier: 抄送类型。
						"prevId": "sid-startevent", // 上一级节点的id
						"nodeId": "4687_868c", // 本节点的id
						"properties": { // 节点内容
							"activateType": "ONE_BY_ONE", // 
							"agreeAll": false,
							"actionerRules": [{ // 节点规则
								"type": "target_approval", // 页面设置审批人; target_approval: 指定成员;target_select: 发起人自选;target_originator: 发起人自己;
								//target_management: 主管; target_label: 角色;target_formcomponent_approval: 表单里的联系人;
								"isEmpty": false, // 是否是空审批人
								"actType": "and", // 多人审批时采用的审批方式; and: 会签;or: 或签;or: 或签;为空时是依次审批
								"noneActionerAction": "admin", // 审批人为空时; admin: 自动转交管理员;auto: 自动通过;
								// 当类型为指定成员会有的参数target_approval
								"approvals": [{ // 审批人数据
									"personalPhoto": undefined, // 审批人头像
									"userName": "杨凡", // 审批人头名字
									"workNo": "22351401841593", // 审批人标识id
								}],
							}, ],
							"noneActionerAction": "admin"
						},
						"childNode": {
							"type": "route",
							"prevId": "4687_868c",
							"nodeId": "0418_53aa",
							"properties": {},
							"conditionNodes": [{
									"name": "第一个条件",
									"type": "condition",
									"prevId": "0418_53aa",
									"nodeId": "c99d_29b1",
									"properties": {
										"conditions": [ // 条件节点内容
											[{
												"paramKey": "dingtalk_origin_dept",
												"type": "yunque_dept_condition",
												"paramLabel": "发起人",
												"isEmpty": false,
												"conds": [{
													"type": "user",
													"value": "181501565626255234",
													"attrs": {
														"name": "李杨东",
														"avatar": ""
													}
												}]
											}, ]
										]
									},
								},
								{
									"name": "第二个条件",
									"type": "condition",
									"prevId": "0418_53aa",
									"nodeId": "7fdb_0aee",
									"properties": {
										"conditions": [
											[{
												isEmpty: false,
												paramKey: "DDHolidayField-J2BWEN12__options",
												paramLabel: "请假类型",
												paramValue: "",
												paramValues: (5)["产假", "婚假", "例假", "丧假", "调休"],
												type: "yunque_value_condition",
												valid: undefined
											}, {
												isEmpty: false,
												paramKey: "dingtalk_origin_dept",
												paramLabel: "发起人",
												type: "yunque_dept_condition",
												conds: [{
													attrs: {
														name: "张三",
														avatar: ""
													},
													type: "user",
													value: "011218522710774889",
												}]
											}, {
												boundEqual: "",
												isEmpty: false,
												key: "l",
												lowerBound: "",
												lowerBoundNotEqual: "",
												paramKey: "DDHolidayField-J2BWEN12__duration",
												paramLabel: "时长（天）",
												type: "yunque_range_condition",
												unit: "天",
												upperBound: "2",
												upperBoundEqual: "",
												valid: undefined,
												validtype: undefined,
											}]
										]
									}
								},
								{
									"name": "",
									"type": "condition",
									"prevId": "0418_53aa",
									"nodeId": "7fdb_0aee1",
									"properties": {
										"conditions": [
											[{
												"paramKey": "dingtalk_origin_dept",
												"type": "yunque_dept_condition",
												"paramLabel": "发起人",
												"isEmpty": false,
												"conds": [{
													"type": "user",
													"value": "181501565626255234",
													"attrs": {
														"name": "李杨东",
														"avatar": ""
													}
												}]
											}]
										]
									}
								}
							],
							"childNode": { // 结尾直接主管
								"name": "",
								"type": "approver",
								"prevId": "0418_53aa",
								"nodeId": "7366_d5f0",
								"properties": {
									"activateType": "ONE_BY_ONE",
									"agreeAll": false,
									"actionerRules": [{
										"type": "target_management",
										"level": 1,
										"isEmpty": false,
										"autoUp": true
									}],
									"noneActionerAction": "admin"
								},
								"childNode": { // 抄送人
									"type": "notifier",
									"name": "",
									"nodeId": "UoEA_09nZ",
									"prevId": "7366_d5f0",
									"properties": {
										"actionerRules": [{
												"type": "target_approval", // 选择的数据类型; target_approval: 人员;target_label: 角色;target_management: 主管;
												"approvals": [{ // 抄送人的数据
														"userName": "叶丽玉",
														"workNo": "021110185921306210"
													},

												]
											},
											{
												labelNames: "主管",
												labels: 1542328583,
												type: "target_label",
											},
											{
												level: '1',
												type: "target_management",
											},
											{
												key: "manual_c6d5_e1ec_7e06_09a9",
												multi: 1,
												range: {
													allStaff: null
												},
												select: ["allStaff"],
												type: "target_select"
											}
										]
									},
								},
							}
						}
					}
				},
				scale: 1,
				percentage: 100,
				top: 0,
				left: 0,
				show: false,
				qwer: false,
				jurisdiction: false,
				property: false,
				nodeData: null,
				conditionIndex: '',
				addData: null,
				refresh: true,
				refresh2: true,
				conNodes: [],
			}
		},
		computed: {
			scaleFun: function() { // 监听scale数据变化，去动态修改页面的缩放
				var scale = this.scale;
				return `transform:scale(${scale})`;
			},
			addNodeEntranceFun: function() { // 监听top数据变化，去动态修改增加菜单的定位
				var top = this.top;
				var left = this.left;
				return `top: ${top}px; left: ${left}px`;
			}
		},
		methods: {
			scaleMinus() { // 点击缩小
				var scale = this.scale;
				(scale - 0.1) > 0.5 && (this.scale -= 0.1) && (this.percentage -= 10);
			},
			scaleAdd() { // 点击放大
				var scale = this.scale;
				(scale + 0.1) <= 3 && (this.scale += 0.1) && (this.percentage += 10);
			},
			deepClone(data) { // 对象深拷贝
				let obj = {};
				obj = JSON.parse(JSON.stringify(data));
				return obj;
			},
			addNodeEntrance(e, data) { // 点击显示增加节点菜单
				this.addData = data;
				this.show && (this.show = false);
				this.top = e.pageY - 120;
				this.left = e.pageX;
				this.show = true;
				if((this.top+224) >= this.$refs.flow.offsetHeight){
					this.top = this.top - 224;
				}
				if((this.left+202) >= this.$refs.flow.offsetWidth){
					this.left = this.left - 232;
				}
			},
			addNode(type) { // 新增审批人
				this.show = false;
				var preId = this.addData.nodeId;
				var obj = null;
				switch(type){
					case "approver":
						obj  = {
							"name": "", // 节点名称;默认
							"type": "approver", // 节点类型; approver: 审批类型、start: 开始类型、route: 条件分支类型、condition: 条件类型、notifier: 抄送类型。
							"prevId": "sid_startevent", // 上一级节点的id
							"nodeId": "4687_868c", // 本节点的id
							"properties": { // 节点内容
								"activateType": "ONE_BY_ONE", // 
								"agreeAll": false,
								"actionerRules": [{ // 节点规则
									"type": "target_approval", // 页面设置审批人; target_approval: 指定成员;target_select: 发起人自选;target_originator: 发起人自己;
									//target_management: 主管; target_label: 角色;target_formcomponent_approval: 表单里的联系人;
									"isEmpty": true, // 是否是空审批人
									"actType": "and", // 多人审批时采用的审批方式; and: 会签;or: 或签;or: 或签;为空时是依次审批
									"noneActionerAction": "admin", // 审批人为空时; admin: 自动转交管理员;auto: 自动通过;
									// 当类型为指定成员会有的参数target_approval
									"approvals": [],
								}, ],
								"noneActionerAction": "admin"
							},
						};
						obj.nodeId = this.createid();
						obj.prevId = preId;
						break;
					case "notifier":
						obj  = {
							"name": "",
							"nodeId": "",
							"prevId": "",
							"type": "notifier",
							"properties": {
								"actionerRules": []
							},
						};
						obj.nodeId = this.createid();
						obj.prevId = preId;
						break;
					case "route":
						obj  = {
							"type": "route",
							"prevId": "",
							"nodeId": "",
							"conditionNodes": [{//第一个条件，数组，一个数组元素为一条条件流
								"name": "第一个条件",
								"type": "condition",
								"prevId": "",
								"nodeId": this.createid(),
								"properties": {// 条件节点内容
									"conditions": []
								},
							}, 
							{//第二个条件
								"name": "第二个条件",
								"type": "condition",
								"prevId": "",
								"nodeId": this.createid(),
								"properties": {
									"conditions": []
								}
							}],
						};
						obj.nodeId = this.createid();
						obj.prevId = preId;
						obj.conditionNodes[0].prevId = obj.conditionNodes[1].prevId = obj.nodeId;
						break;
				}
				if (this.addData.childNode) {// 如果添加的节点处后面跟着有节点则要将数据拷贝一下放入添加的节点中
					var childNode = this.addData.childNode;
					obj.childNode = childNode;
					obj.childNode.prevId = obj.nodeId;
				}
				this.addData.childNode = obj;
			},
			addCondition(node){// 添加条件
				// console.log(node);
				var num = node.conditionNodes.length;
				var id = node.nodeId;
				var obj = {//第一个条件，数组，一个数组元素为一条条件流
					"name": `第${num+1}个条件`,
					"type": "condition",
					"prevId": id,
					"nodeId": this.createid(),
					"properties": {// 条件节点内容
						"conditions": []
					},
				};
				node.conditionNodes.push(obj);
				this.refreshModule1();
			},
			clearNode(parentData, condition, index){// 删除节点、抄送人、条件
				this.formConfigData[parentData.childNode.nodeId] && this.$delete(this.formConfigData, parentData.childNode.nodeId);
				// console.log(this.formConfigData)
				if(condition && condition.length > 2){
					condition.splice(index, 1);
					this.refreshModule();
					return
				}
				if(!parentData.childNode.childNode){
					this.$set(parentData, 'childNode', '');
				}else{
					this.$set(parentData.childNode.childNode, 'prevId',parentData.childNode.prevId);
					this.$set(parentData, 'childNode', parentData.childNode.childNode);
				}
				this.refreshModule();
			},
			closeEntrance() { // 点击关闭增加节点菜单
				this.show = false;
			},
			switchover() { // 是否显示表单操作权限
				this.jurisdiction = !this.jurisdiction;
			},
			colseProperty() { // 关闭属性设置区域
				this.property = false;
				this.jurisdiction = false;
			},
			openProperty(data, index, conNod) { // 显示属性设置区域
				this.property = true;
				this.nodeData = data;
				this.conNodes = conNod;
				this.conditionIndex = index;
			},
			createid() {// 创建id
				const timestamp = new Date().getTime(); //获取当前时间戳
				let chars = "0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ-~".split("")
				let qutient = +timestamp;
				const radix = chars.length, arr = [];
				do {
					let mod = qutient % radix;
					qutient = (qutient - mod) / radix;
					arr.unshift(chars[mod]);
				} while (qutient);
				const zid = (arr.join("") + this.createCode()).split("~").join("");
				return zid.replace('-', '_');
			},
			createCode() {//随机验证码 4位数
				//首先默认code为空字符串
				var code = "";
				//设置长度，这里看需求，我这里设置了4
				var codeLength = 4;
				//设置随机字符
				var random = "0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ-~".split("");
				//循环codeLength 我设置的4就是循环4次
				for (var i = 0; i < codeLength; i++) {
					//设置随机数范围,这设置为0 ~ 64
					var index = Math.floor(Math.random() * 64);
					//字符串拼接 将每次随机的字符 进行拼接
					code += random[index];
				}
				//将拼接好的字符串赋值给展示的Value
				return code;
			},
			dataPost(){
				// console.log(this.flow)
			},
			refreshModule1(){
				this.refresh = !this.refresh;
				this.$nextTick(function(){// 加此操作是为了将递归组件做强制刷新，因为递归组件第一时间不能及时更新dom
					this.refresh = !this.refresh;
				});
			},
			refreshModule(){
				this.refresh2 = !this.refresh2;
				this.$nextTick(function(){// 加此操作是为了将递归组件做强制刷新，因为递归组件第一时间不能及时更新dom
					this.refresh2 = !this.refresh2;
				});
			}
		},
		watch:{
			flow:{// 监听这个数据是为了在做节点操作的时候实时更新节点的dom
				handler () {
					this.refreshModule1();
				},
				deep: true
			},
			show:{// 监听这个数据是为了在做节点操作的时候实时更新节点的dom
				handler (val) {
					if(!val){
						this.refreshModule();
					}
				},
				deep: true
			},
			// flowData:{// 监听这个数据是为了在做节点操作的时候实时更新节点的dom
			// 	handler (val) {
			// 		console.log(val)
			// 	},
			// 	deep: true
			// },
			nodeData:{
				handler (val) {
					if(val){
						this.refreshModule();
					}
				},
				deep: true,
			}
		}
	}
</script>

<style scoped lang="less">
	@import "../../static/css/general.less";

	.flow {
		width: @width;
		height: @width;
		background-color: #f5f5f7;

		.zoom {
			// 右上角缩放放大
			display: flex;
			position: fixed;
			-webkit-box-align: center;
			-ms-flex-align: center;
			align-items: center;
			-webkit-box-pack: justify;
			-ms-flex-pack: justify;
			justify-content: space-between;
			height: 40px;
			width: 125px;
			right: 40px;
			margin-top: 30px;
			z-index: 10;

			.zoom-out {
				width: 30px;
				height: 30px;
				background: #fff;
				color: #c1c1cd;
				cursor: pointer;
				border: 1px solid #c1c1cd;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30px;
			}

			.zoom-in {
				.zoom .zoom-out();
			}
		}

		.container {
			// 中间内容
			width: @width;
			height: @width;

			// 中间内容缩放区域
			.container-scale {
				transform: scale(1);
				display: inline-block;
				position: relative;
				width: 100%;
				padding: 54.5px 0;
				-webkit-box-align: start;
				-ms-flex-align: start;
				align-items: flex-start;
				-webkit-box-pack: center;
				-ms-flex-pack: center;
				justify-content: center;
				-ms-flex-wrap: wrap;
				flex-wrap: wrap;
				min-width: -webkit-min-content;
				min-width: -moz-min-content;
				min-width: min-content;
				background-color: #f5f5f7;
				-webkit-transform-origin: 0 0 0;
				transform-origin: 0 0 0;
				transform-origin: 50% 0px 0px;
				transition: all .3s;

				// 结束样式
				.end-node {
					border-radius: 50%;
					font-size: 14px;
					color: rgba(25, 31, 37, 0.4);
					text-align: left;

					.end-node-circle {
						width: 10px;
						height: 10px;
						margin: auto;
						border-radius: 50%;
						background: #DBDCDC;
					}

					.end-node-text {
						margin-top: 5px;
						text-align: center;
					}
				}
			}
		}

		.ant-popover-inner-content {
			padding: 12px 16px;
			color: rgba(0, 0, 0, .65);
			position: absolute;
			z-index: 1030;
			top: 0;
			left: 0;
			background: white;
			border: 1px solid rgba(17, 31, 44, 0.12);
			border-radius: 8px;
			overflow: hidden;

			.add-node-popover-body {
				display: inline-block;
				max-width: 168px;

				.add-node-popover-item {
					display: inline-flex;
					align-items: center;
					cursor: pointer;
					color: #191F25 !important;
					margin-right: 8px;
					margin-bottom: 8px;
					width: 160px;
					background: rgba(17, 31, 44, 0.02);
					padding: 8px;
					border: 1px solid #FFFFFF;
					border-radius: 4px;
					transition: all .3s;

					&:hover {
						background: #FFFFFF;
						border: 1px solid #ecedef;
						box-shadow: 0 2px 8px 0 rgba(17, 31, 44, 0.08);
					}

					.item-wrapper {
						user-select: none;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 40px;
						height: 40px;
						// background: #FFFFFF;
						// border: 1px solid #eeeeee;
						border-radius: 16px;
						transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
						margin-right: 12px;
					}
				}
			}
		}
	}
</style>
