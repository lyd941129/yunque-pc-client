<!-- 流程编辑属性组件 -->
<template>
	<div class="property">
		<div class="property-wrapper">
			<transition name="fade">
				<div v-if="property" class="property-mask" @click="colseProperty"></div>
			</transition>
			<transition name="property">
				<div v-if="property" class="property-content">
					<div class="property-header">
						<div class="editable-text-field">
							<div class="editable-text-col">
								<span v-show="!edit" class="text-value-wrapper" @click="editChange">
									<span>{{name}}</span>
								</span>
								<input style="width: calc(100% - 120px);" v-show="edit" v-myfocus="edit" @focus="focus($event)" v-model="name" type="text" class="input" @blur="editInputblur">
								<el-select v-if="type === 'condition'" v-model="conditionRecord" placeholder="请选择" style="width: 120px;position: absolute;right: 20px;">
									<el-option v-for="(item, index) in conNodes" :key="item.nodeId" :value="index" :label="`优先级${index+1}`">优先级{{index+1}}</el-option>
								</el-select>
							</div>
						</div>
					</div>
					<div class="property-body">
						<div class="tabs">
							<div v-if="type === 'start' || type === 'approver'" class="tabs-top-bar">
								<div class="tabs-nav-container">
									<div class="tabs-nav-wrap">
										<div class="tabs-nav-animated">
											<div>
												<div class="tabs-tab" v-show="!(type === 'start')" @click="switchover" :class="{'active': !jurisdiction}">设置审批人</div>
												<div class="tabs-tab" @click="switchover" :class="{'active': jurisdiction || type === 'start'}">表单操作权限</div>
												<div class="tabs-ink-bar" :class="{'tabs-ink-bar-two': jurisdiction, 'tabs-ink-bar-one': type === 'start'}"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="tabs-top-content" :class="{'tabs-top-content-j': jurisdiction || type === 'start'}">
								<div v-if="type === 'start' || type === 'approver'" class="tabpanel">
									<div class="group-content">
										<div>
											<el-radio-group v-model="actionerRules.type" @change="changeApproverType">
												<el-radio v-for="(item, index) in approverType" class="tabpanel-wrapper" :label="item.key" :key="index">{{item.name}}</el-radio>
											</el-radio-group>
										</div>
										<div v-if="actionerRules.type === 'target_project'" class="approver-actions">
											<button type="button" class="btn btn-primary" @click="addPeople(actionerRules.approvals)">
												<span>添加角色</span>
											</button>
										</div>
										<div v-if="actionerRules.type === 'target_project' && actionerRules.projectNames" class="approver-list">
											<span class="approver-item" @click="deleLabelNames">
												<span class="name">{{actionerRules.projectNames }}</span>
											</span>
										</div>
										<div v-if="actionerRules.type === 'target_approval'" class="approver-actions">
											<button type="button" class="btn btn-primary" @click="addPeople(actionerRules.approvals)">
												<span>添加成员</span>
											</button>
											<!-- <span class="text-desc">不能超过20人</span> -->
										</div>
										<div v-if="actionerRules.type === 'target_approval' && actionerRules.approvals && actionerRules.approvals.length>0"
										class="approver-list">
											<span v-for="(item, index) in actionerRules.approvals" :key="index" class="approver-item" @click="deleApprovals(actionerRules.approvals, index)">
												<span class="name">{{item.userName}}</span>
											</span>
											<a @click="clearApprovals">清空</a>
										</div>
										<div v-if="actionerRules.type === 'target_select'" class="approver-actions">
											<!-- 使用下拉框组件 -->
											<el-select v-model="actionerRules.multi" placeholder="请选择">
												<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
												</el-option>
											</el-select>
										</div>

										<div v-if="actionerRules.type === 'target_select'" style="padding: 15px 0px;">
											<div style="font-family: PingFangSC-Medium; font-size: 14px; color: rgb(25, 31, 37); margin-bottom: 16px;">选择范围</div>
											<el-select v-model="actionerRules.select" placeholder="请选择" @change="rangeChange">
												<el-option v-for="item in optionsRange" :key="item.value" :label="item.label" :value="item.value">
												</el-option>
											</el-select>
											<span style="margin-left: 20px;">
												<button v-show="actionerRules.select == 'approvals'" type="button" class="btn btn-primary" @click="addPeople(actionerRules.range.approvals)">
													<span>添加成员</span>
												</button>
												<button v-show="actionerRules.select == 'labels'" type="button" class="btn btn-primary" @click="addPeople(actionerRules.range.approvals)">
													<span>添加角色</span>
												</button>
											</span>
											<div v-if="actionerRules.type === 'target_select' && actionerRules.range && actionerRules.range.approvals.length>0"
											class="approver-list approver-list-range">
												<span v-for="(item, index) in actionerRules.range.approvals" :key="index" class="approver-item" @click="deleApprovals(actionerRules.range.approvals, index)">
													<span class="name">{{item.userName}}</span>
												</span>
												<a @click="clearApprovals">清空</a>
											</div>
											<div v-if="actionerRules.type === 'target_select' && actionerRules.range && actionerRules.range.labels.length>0"
											class="approver-list approver-list-range">
												<span v-for="(item, index) in actionerRules.range.labels" :key="index" class="approver-item" @click="deleApprovals(actionerRules.range.labels, index)">
													<span class="name">{{item.labelNames}}</span>
												</span>
												<a @click="clearApprovals">清空</a>
											</div>
										</div>
										<div v-if="actionerRules.type === 'target_management'" class="approver-actions">
											发起人的&nbsp;&nbsp;
											<el-select v-model="actionerRules.level" placeholder="请选择">
												<el-option v-for="item in sysCode.level_lead" :key="item.dict_value" :label="item.dict_label" :value="item.dict_value">
												</el-option>
											</el-select>
											<div class="area-auto-up">
												<el-checkbox v-model="actionerRules.autoUp">找不到主管时，由上级主管代审批</el-checkbox>
											</div>
										</div>
										<div v-if="actionerRules.type === 'target_originator'" class="originator-desc">发起人自己将作为审批人处理审批单</div>
										<div v-if="actionerRules.type === 'target_formcomponent_approval'" class="approver-actions">
											<el-select v-model="actionerRules.paramKey" placeholder="请选择">
												<el-option v-for="item in formcomponent" :key="item.value" :label="item.label" :value="item.value">
												</el-option>
											</el-select>
										</div>
										<div v-if="actionerRules.type === 'target_label'" style="margin-bottom: 20px;">
											<span>
												<button type="button" class="btn btn-primary" @click="addPeople">
													<span>添加角色</span>
												</button>
											</span>
										</div>
										<div v-if="actionerRules.type === 'target_label' && actionerRules.labelNames" class="approver-list">
											<span class="approver-item" @click="deleLabelNames">
												<span class="name">{{actionerRules.labelNames}}</span>
											</span>
										</div>
									</div>
									<div v-if="(actionerRules.type === 'target_approval' && actionerRules.approvals && actionerRules.approvals.length > 1) || (actionerRules.multi == '1' && actionerRules.select == 'allStaff')  || (actionerRules.multi == '1') || actionerRules.type === 'target_management' || (actionerRules.type === 'target_label' && actionerRules.labelNames) || (actionerRules.type === 'target_project' && actionerRules.projectNames)"
									class="group-content">
										<div class="group-title">
											<div>多人审批时采用的审批方式</div>
										</div>
										<div>
											<el-radio-group v-model="actionerRules.actType">
												<el-radio v-for="(item, index) in approvalWay" class="tabpanel-wrapper w-100" :label="item.key" :key="index">{{item.name}}</el-radio>
											</el-radio-group>
										</div>
									</div>
									<div v-if="actionerRules.type === 'target_management' || (actionerRules.type === 'target_label' && actionerRules.labelNames) || (actionerRules.type === 'target_project' && actionerRules.projectNames)"
									class="group-content">
										<div class="group-title">审批人为空时</div>
										<div>
											<el-radio-group v-model="actionerRules.noneActionerAction">
												<el-radio v-for="(item, index) in noActioner" class="tabpanel-wrapper w-100" :label="item.value" :key="index">{{item.label}}</el-radio>
											</el-radio-group>
										</div>
									</div>
								</div>
								<div v-if="type === 'start' || type === 'approver'" class="tabpanel">
									<div class="jurisdiction-box">
										<div class="table-header">
											<table>
												<tr>
													<th style="width: 40%;">表单字段</th>
													<th>
														<div class="th-box">
															<el-radio label="write" v-model="formFields" @change="allConfigChange" vlaue="write">可编辑</el-radio>
														</div>
													</th>
													<th>
														<div class="th-box">
															<el-radio label="read" v-model="formFields" @change="allConfigChange" vlaue="read">只读</el-radio>
														</div>
													</th>
													<th>
														<div class="th-box">
															<el-radio label="hide" v-model="formFields" @change="allConfigChange" vlaue="hide">隐藏</el-radio>
														</div>
													</th>
												</tr>
											</table>
										</div>
										<div class="table-content">
											<table>
												<tbody>
													<tr v-for="(item, index) in formConfig" :key="index">
														<td style="width: 40%;">{{item.fieldTitle}}</td>
														<td>
															<div class="th-box">
																<el-radio label="NORMAL" v-model="item.fieldBehavior" @change="configChange" vlaue="NORMAL">可编辑</el-radio>
															</div>
														</td>
														<td>
															<div class="th-box">
																<el-radio label="" v-model="item.fieldBehavior" @change="configChange" vlaue="">只读</el-radio>
															</div>
														</td>
														<td>
															<div class="th-box">
																<el-radio label="HIDDEN" v-model="item.fieldBehavior" @change="configChange" vlaue="HIDDEN">隐藏</el-radio>
															</div>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<div v-if="type === 'notifier'" class="tabpanel">
									<div class="group-content border-none">
										<div class="group-title">抄送人</div>
										<button type="button" class="btn btn-primary" @click="addPeople">
											<span>添加成员</span>
										</button>
										<div v-if="actionerRules.length > 0" class="approver-list" style="margin-top: 20px;">
											<span v-for="(item, index) in actionerRules" :key="index" class="approver-item" @click="deleApprovals(actionerRules, index)">
												<span class="name">{{item.approvals ? ('员工:'+item.approvals[0].userName) : (item.labelNames ? ('角色:'+item.labelNames) : (item.departName ? ('部门:'+item.departName) : (`主管:第${item.level}级主管`)))}}</span>
											</span>
											<a @click="clearApprovalsActioner">清空</a>
										</div>
									</div>
									<div class="group-content border-none">
										<el-checkbox v-model="notifierCheck">允许发起人添加抄送人</el-checkbox>
									</div>
								</div>
								<div v-if="type === 'condition' && refe" class="tabpanel">
									<div v-for="(item, index) in checkListShow" :key="item.title">
										<div class="condition-group" v-if="item.type === 'yunque_dep_condtion'">
											<div class="condition-group-header">发起人</div>
											<div class="selection condition-group-content" @click="addPeople(index)">
												<ul>
													<li v-for="(co, index) in item.conds" :key="index">
														<div>{{co.attrs.name}}</div>
														<span @click.stop="clearConds(item.conds, index)">X</span>
													</li>
												</ul>
											</div>
											<i class="el-icon-delete" @click="clearCheck(index)"></i>
										</div>
										<div class="condition-group condition-group-checked" v-else-if="item.type === 'yunque_value_condtion'">
											<div class="condition-group-header">{{item.paramLabel}}</div>
											<div class="condition-group-content">
												<el-checkbox-group v-model="item.paramValues">
													<el-checkbox v-for="(op, index) in item.option" :label="op" :key="index"></el-checkbox>
												</el-checkbox-group>
											</div>
											<i class="el-icon-delete" @click="clearCheck(index)"></i>
										</div>
										<div class="condition-group" v-else-if="item.type === 'yunque_range_condtion' && refe" :class="{'m-b': numberObj[item.paramKey].key == 'between'}">
											<div class="condition-group-header">{{item.paramLabel}}</div>
											<!-- 单数 -->
											<el-select v-model="numberObj[item.paramKey].key" placeholder="请选择" @change="change1(item.paramKey)">
												<el-option v-for="c_item in calculate" :key="c_item.value" :label="c_item.label" :value="c_item.value">
												</el-option>
											</el-select>
											<el-input-number v-if="numberObj[item.paramKey].key != 'between'" label="" :value="numberObj[item.paramKey].one" v-model="numberObj[item.paramKey].one"></el-input-number>
											<!-- 介于两数字之间 -->
											<div v-if="numberObj[item.paramKey].key == 'between'" style="position: absolute; bottom: -50px; width: 100%; display: flex;left: 83px;align-items: center;">
												<el-input @input="force" style="width: 80px;" label=""
												:value="numberObj[item.paramKey].one"
												v-model="numberObj[item.paramKey].one"></el-input>
												<el-select style="width: 103px;" v-if="numberObj[item.paramKey].key == 'between'" placeholder="请选择" @change="change2"
												v-model="numberObj[item.paramKey].between.one">
													<el-option v-for="c_item in calculateBet2" :key="c_item.value" :label="c_item.label" :value="c_item.value">
													</el-option>
												</el-select>
												<div style="max-width: 100px;text-align: center;" v-if="numberObj[item.paramKey].key == 'between'" class="condition-group-header">{{item.paramLabel}}</div>
												<el-select style="width: 80px;" v-if="numberObj[item.paramKey].key == 'between'" placeholder="请选择" @change="change2"
												v-model="numberObj[item.paramKey].between.two">
													<el-option v-for="c_item in calculateBet" :key="c_item.value" :label="c_item.label" :value="c_item.value">
													</el-option>
												</el-select>
												<el-input @input="force" style="width: 80px;" label=""
												:value="numberObj[item.paramKey].two"
												v-model="numberObj[item.paramKey].two"></el-input>
											</div>
											<i class="el-icon-delete" @click="clearCheck(index)"></i>
										</div>
									</div>
									<button type="button" class="btn btn-primary" @click="appendContion" style="margin: 16px 10px 16px 24px;">
										<span>添加条件</span>
									</button>
									<!-- <span class="condition-remain-tip">还有0个可用条件</span> -->
								</div>
							</div>
						</div>
					</div>
					<div class="property-footer">
						<button type="button" class="btn btn-primary" @click="saveNode">
							<span>保 存</span>
						</button>
						<button type="button" class="btn btn-default" @click="colseProperty">
							<span>取 消</span>
						</button>
					</div>
				</div>
			</transition>
		</div>
		<el-dialog class="xzry" title="选择人员" :visible.sync="choosePerson">
			<ThroughTree :treeData="shuttleData" :treeSaveData.sync="shuttleBackData" :radioed="radioed"></ThroughTree>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveChoosePerson">确 认</el-button>
				<el-button @click="choosePerson = false">取 消</el-button>
			</span>
		</el-dialog>
		<el-dialog title="选择条件" :visible.sync="alternative">
			请选择用来区分审批流程的条件字段
			<el-checkbox-group v-model="checkList" style="margin-top: 10px;">
				<el-checkbox v-for="(item) in activeUsers" :label="item.title" :key="item.id"></el-checkbox>
			</el-checkbox-group>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="alterAffirm">确 认</el-button>
				<el-button @click="alternative = false">取 消</el-button>
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
			property: {
				type: Boolean
			},
			colseProperty: {
				type: Function
			},
			qwer: {
				type: Boolean
			},
			switchover: {
				type: Function
			},
			jurisdiction: {
				type: Boolean
			},
			nodeData: {
				type: Object
			},
			conditionIndex: {
				type: Number
			},
			sysCode:{
				type: Object
			},
			formData: {
				type: Array
			},
			formConfigData: {
			},
			conNodes: {
				type: Array
			},
			selectDataDispose: {
				type: Array
			},
		},
		
		data() {
			return {
				approverType: [{
						name: '指定成员',
						key: 'target_approval',
					},
					{
						name: '发起人自选',
						key: 'target_select',
					},
					{
						name: '发起人自己',
						key: 'target_originator',
					},
					{
						name: '级领导',
						key: 'target_management'
					},
					{
						name: '项目角色',
						key: 'target_project',
					},
					{
						name: '角色',
						key: 'target_label',
					},
					// {
					// 	name: '表单里的联系人',
					// 	key: 'target_formcomponent_approval',
					// },
				],
				approvalWay: [{
						name: '依次审批',
						key: '',
					},
					{
						name: '会签（须所有审批人同意）',
						key: 'and',
					},
					{
						name: '或签（一名审批人同意或拒绝即可）',
						key: 'or',
					},
				],
				name: '审批人',
				type: '',
				edit: false,
				actionerRules: {},
				options: [
					{
						value: '0',
						label: '自选一个人'
					}, {
						value: '1',
						label: '自选多个人'
					}],
					optionsRange: [{
						value: 'allStaff',
						label: '全公司'
					}, {
						value: 'approvals',
						label: '指定成员'
					}, {
						value: 'labels',
						label: '角色'
					}, 
				],
				notifierCheck: true,
				charges: [
					{
						value: '1',
						label: '直接主管'
					}, {
						value: '2',
						label: '第二级主管'
					}, {
						value: '3',
						label: '第三季主管'
					}, {
						value: '4',
						label: '第四级主管'
					}, {
						value: '5',
						label: '第五级主管'
					}, ],
					noActioner: [{
						value: 'auto',
						label: '自动通过'
					}, {
						value: 'admin',
						label: '自动转交管理员'
					},
					],
				formcomponent: [],
				calculate: [
					{
						value: 'lowerBound',
						label: '大于等于'
					}, {
						value: 'upperBound',
						label: '小于'
					}, {
						value: 'lowerBoundNotEqual',
						label: '大于'
					}, {
						value: 'upperBoundEqual',
						label: '小于等于'
					}, {
						value: 'boundEqual',
						label: '等于'
					}, {
						value: 'between',
						label: '介于(两个数之间)'
					}, 
				],
				calculateBet: [
					{
						value: 'upperBound',
						label: '小于'
					},
					{
						value: 'upperBoundEqual',
						label: '小于等于'
					}
				],
				calculateBet2: [
					{
						value: 'lowerBound',
						label: '大于等于'
					},
					{
						value: 'lowerBoundNotEqual',
						label: '大于'
					}
				],
				calculateValue: '',
				choosePerson: false,
				alternative: false,
				shuttleData: [],
				shuttleBackData: [],
				radioed: false,
				formFields: 'read',
				formConfig: [],
				checkList: [],
				checkListShow: [],
				conditionsIndex: 0,
				conditionsArr: {},
				oldArr: [],
				conditionRecord: '',
				numberObj: {},
				refe: true,
			}
		},
		computed: {
			activeUsers: function () {
				let arr = this.formData ? this.formData.filter(function (user) {
					return (user.element == 'Choice' || user.element == 'Money');
				}) : [];
				arr.push({title: '发起人', element: "Start"});
				return arr;
			},
		},
		methods: {
			force(){
				this.$forceUpdate();
			},
			change1(){
				// console.log(this.numberObj);
				// console.log(paramKey);
				// if(this.numberObj[paramKey].key === "between"){
				// 	this.numberObj[paramKey].between = {
				// 		one: 'lowerBound',
				// 		two: 'upperBound'
				// 	}
				// }else{
				// 	delete this.numberObj[paramKey].between;
				// }
				this.refe = false;
				this.$nextTick(function(){// 加此操作是为了将递归组件做强制刷新，因为递归组件第一时间不能及时更新dom
					this.refe = true;
				});
			},
			change2(){
				this.refe = false;
				this.$nextTick(function(){// 加此操作是为了将递归组件做强制刷新，因为递归组件第一时间不能及时更新dom
					this.refe = true;
				});
			},
			focus(event) { // 获取焦点的时候去选中焦点中的内容
				event.currentTarget.select();
			},
			editChange() { // 显示输入框
				this.edit = true;
			},
			editInputblur() { // 输入框失焦隐藏输入框
				this.edit = false;
			},
			changeApproverType(type) { // 监听设置审批人的类型切换后，对应要存的数据格式和参数不一样
				switch (type) {
					case "target_approval": // 指定成员
						this.actionerRules = {
							actType: '',
							isEmpty: true,
							noneActionerAction: undefined,
							type: "target_approval",
							approvals: []
						}
						break;
					case "target_select": // 发起人自选
						this.actionerRules = {
							actType: '',
							type: "target_select",
							"multi": '0', // 0为自选一个人;1为自选多个人
							"select": "allStaff", // 选择范围;allStaff: 全公司;approvals: 指定成员;labels: 角色;
							"range": { // 选择范围中选择的数据
								"labels": [],
								"approvals": [],
							},
						}
						break;
					case "target_originator": // 发起人自己
						this.actionerRules = {
							isEmpty: false,
							noneActionerAction: undefined,
							type: "target_originator",
						}
						break;
					case "target_management": // 及领导
						this.actionerRules = {
							actType: "",
							autoUp: true,
							isEmpty: false,
							level: '1',
							noneActionerAction: 'admin', // 审批人为空时;admin: 自动转交管理员;"auto": 自动通过
							type: "target_management"
						}
						break;
					case "target_formcomponent_approval":
						this.actionerRules = {
							isEmpty: true,
							noneActionerAction: undefined,
							paramKey: "",
							type: "target_formcomponent_approval",
						}
						break;
					case "target_label":
						this.actionerRules = {
							actType: "and",
							isEmpty: true,
							labelNames: "",
							labels: '',
							memberCount: 0,
							noneActionerAction: 'admin',
							type: "target_label",
						}
						this.approvalWay.splice(0, 1);
						break;
					case "target_project":
						this.actionerRules = {
							actType: "and",
							isEmpty: true,
							projectNames: "",
							projectId: '',
							memberCount: 0,
							noneActionerAction: 'admin',
							type: "target_project",
						}
						this.approvalWay.splice(0, 1);
						break;
				}
				(this.approvalWay.length < 3 && type !== 'target_label' && type !== 'target_project') && this.approvalWay.unshift({
					key: '',
					name: '依次审批'
				});
			},
			rangeChange(val) { // 发起人自选的选择范围监听改变
				if (val === 'allStaff') {
					this.actionerRules.range.approvals = [];
					this.actionerRules.range.labels = [];
				}else if(val === 'approvals'){
					this.actionerRules.range.labels = [];
				}else if(val === 'labels'){
					this.actionerRules.range.approvals = [];
				}
			},
			addPeople(index) { // 添加审批人
				var that = this;
				this.shuttleBackData = [];
				if(this.type === 'notifier'){
					this.$axios.all([
						this.$axios.post('/api/memCompany/getMem', {
							'company_id': that.loginData.default_company.id
						}),
						this.$axios.post('/api/companyRole/getRole', {
							'company_id': that.loginData.default_company.id
						}),
						this.$axios.post('/api/projectRole/getRole', {
							'company_id': that.loginData.default_company.id
						})
					]).then(this.$axios.spread(function (userResp, reposResp, projectResp) {
						// 上面两个请求都完成后，才执行这个回调方法
						var sysCodeArr = [];
						that.sysCode.level_lead.length && that.sysCode.level_lead.map((item) => {
							sysCodeArr.push({
								dict_label: item.dict_label,
								id: item.dict_value,
								is_default: item.is_default,
							});
						});
						let rendData = [
							{
								id: 'bm',
								title: '人员及部门',
								child: userResp.data.data,
								disabled: true
							},
							{
								id: 'js',
								title: '角色',
								child: reposResp.data.data,
								disabled: true
							},
							{
								id: 'xmjs',
								title: '项目角色',
								child: projectResp.data.data,
								disabled: true
							},
							{
								id: 'zg',
								title: '主管',
								child: sysCodeArr,
								disabled: true
							}
						];
						that.shuttleData = rendData;
						that.actionerRules.length && that.actionerRules.map((item) => {
							switch(item.type){
								case "target_approval":
									that.shuttleBackData.push({
										id: item.approvals[0].workNo,
										username: item.approvals[0].userName,
									});
									break;
								case "target_management":
									that.shuttleBackData.push({
										id: item.level,
										username: `第${item.level}级主管`,
									});
									break;
								case "target_label":
									that.shuttleBackData.push({
										id: item.labels,
										username: item.labelNames,
									});
									break;
								case "target_dep":
									that.shuttleBackData.push({
										id: item.id,
										username: item.depart_name,
									});
									break;
							}
						});
						that.radioed = false;
						that.choosePerson = true;
					}));
					return
				}
				else if(this.type === 'condition'){
					this.conditionsIndex = index;
					this.$axios.all([
						this.$axios.post('/api/memCompany/getMem', {
							'company_id': that.loginData.default_company.id
						}),
						this.$axios.post('/api/companyRole/getRole', {
							'company_id': that.loginData.default_company.id
						}),
						this.$axios.post('/api/projectRole/getRole', {
							'company_id': that.loginData.default_company.id
						})
					]).then(this.$axios.spread(function (userResp, reposResp, projectResp) {
						// 上面两个请求都完成后，才执行这个回调方法
						var sysCodeArr = [];
						that.sysCode.level_lead.length && that.sysCode.level_lead.map((item) => {
							sysCodeArr.push({
								dict_label: item.dict_label,
								id: item.dict_value,
								is_default: item.is_default,
							});
						});
						let rendData = [
							{
								id: 'bm',
								title: '人员及部门',
								child: userResp.data.data,
								disabled: true
							},
							{
								id: 'js',
								title: '角色',
								child: reposResp.data.data,
								disabled: true
							},
							{
								id: 'xmjs',
								title: '项目角色',
								child: projectResp.data.data,
								disabled: true
							},
							{
								id: 'zg',
								title: '主管',
								child: sysCodeArr,
								disabled: true
							}
						];
						that.shuttleData = rendData;
						that.checkListShow[that.conditionsIndex].conds.length && that.checkListShow[that.conditionsIndex].conds.map((item) => {
							switch(item.type){
								case "user":
									that.shuttleBackData.push({
										id: item.attrs.id,
										username: item.attrs.name,
									});
									break;
								case "management":
									that.shuttleBackData.push({
										id: item.attrs.id,
										username: `第${item.id}级主管`,
									});
									break;
								case "label":
									that.shuttleBackData.push({
										id: item.attrs.id,
										username: item.attrs.name,
									});
									break;
								case "dep":
									that.shuttleBackData.push({
										id: item.attrs.id,
										username: item.attrs.name,
									});
									break;
							}
						});
						that.radioed = false;
						that.choosePerson = true;
					}));
					return
				}
				switch (this.actionerRules.type) {
					case "target_approval":
						this.shuttleBackData = this.actionerRules.approvals;
						this.shuttleBackData.length && this.shuttleBackData.map((item) => {
							item.id = item.workNo;
							item.username = item.userName;
						});
						this.radioed = false;
						this.choosePerson = true;
						this.$axios.post('/api/memCompany/getMem', {
							'company_id': that.loginData.default_company.id
						}).then(res => {
							that.shuttleData = res.data.data;
							// console.log(res);
						}).catch(err => {
							// console.log(err)
						});
						break;
					case "target_label":
						this.actionerRules.labelNames && this.shuttleBackData.push({
							id: this.actionerRules.labels,
							role_name: this.actionerRules.labelNames,
						});
						this.radioed = true;
						this.choosePerson = true;
						this.$axios.post('/api/companyRole/getRole', {
							'company_id': that.loginData.default_company.id
						}).then(res => {
							that.shuttleData = res.data.data;
							// console.log(res);
						}).catch(err => {
							// console.log(err)
						});
						break;
					case "target_project":
						this.actionerRules.projectNames && this.shuttleBackData.push({
							id: this.actionerRules.projectId,
							role_name: this.actionerRules.projectNames,
						});
						this.radioed = true;
						this.choosePerson = true;
						this.$axios.post('/api/projectRole/getRole', {
							'company_id': that.loginData.default_company.id
						}).then(res => {
							that.shuttleData = res.data.data;
							// console.log(res);
						}).catch(err => {
							// console.log(err)
						});
						break;
					case "target_select":
						if(this.actionerRules.select === 'approvals'){
							this.shuttleBackData = this.actionerRules.range.approvals;
							this.shuttleBackData.length && this.shuttleBackData.map((item) => {
								item.id = item.workNo;
								item.role_name = item.userName;
							});
							this.radioed = false;
							this.choosePerson = true;
							this.$axios.post('/api/memCompany/getMem', {
								'company_id': that.loginData.default_company.id
							}).then(res => {
								that.shuttleData = res.data.data;
								// console.log(res);
							}).catch(err => {
								// console.log(err)
							});
						}else if(this.actionerRules.select === 'labels'){
							this.shuttleBackData = this.actionerRules.range.labels;
							this.shuttleBackData.length && this.shuttleBackData.map((item) => {
								
								item.id = item.labels;
								item.username = item.labelNames;
							});
							this.radioed = false;
							this.choosePerson = true;
							this.$axios.post('/api/companyRole/getRole', {
								'company_id': that.loginData.default_company.id
							}).then(res => {
								that.shuttleData = res.data.data;
							}).catch(err => {
								// console.log(err)
							});
						}
						break;
				}
			},
			deleLabelNames() { // 设置角色类型删除角色
				switch (this.actionerRules.type) {
					case "target_label":
						this.actionerRules.labelNames = "";
						this.actionerRules.labels = "";
						break;
					case "target_project":{
						this.actionerRules.projectNames = "";
						this.actionerRules.projectId = "";
						break;
					}
				}
				this.judgeIsEmpty();
			},
			deepClone(data) { // 对象深拷贝
				let obj = {};
				obj = JSON.parse(JSON.stringify(data));
				return obj;
			},
			clearApprovals() { // 清空操作
				if(this.actionerRules.approvals){
					this.actionerRules.approvals = [];
				}else{
					this.actionerRules.range.labels = [];
					this.actionerRules.range.approvals = [];
				}
				this.judgeIsEmpty();
			},
			clearApprovalsActioner() {
				if (this.notifierCheck) {
					this.actionerRules.splice(0, this.actionerRules.length);
				} else {
					this.actionerRules.splice(0, this.actionerRules.length - 1);
				}
			},
			deleApprovals(arr, i) { // 删除指定成员的审批人
				arr.splice(i, 1);
				this.nodeData.type !== 'notifier' && this.judgeIsEmpty();
			},
			saveNode() { // 保存节点属性数据
				let replaceName = this.nodeData.nodeId;
				let that = this;
				switch (this.nodeData.type) {
					case "start":
						var arrs = this.formConfig.filter(item => {
							return item.fieldBehavior != "";
						});
						if(!arrs.length){
							// this.$delete(this.formConfigData, replaceName);
							this.$set(this.formConfigData, replaceName,	[]);
						}else{
							this.$set(this.formConfigData, replaceName, this.deepClone(arrs));
						}
						// console.log(this.formConfigData);
						break;
					case "approver": // 节点为普通节点的时候保存数据方法
						var arr = this.formConfig.filter(item => {
							return item.fieldBehavior != "";
						});
						if(!arr.length){
							// this.$delete(this.formConfigData, replaceName);
							this.$set(this.formConfigData, replaceName,	[]);
						}else{
							this.$set(this.formConfigData, replaceName, this.deepClone(arr));
						}
						// console.log(this.formConfigData);
						this.$set(this.nodeData.properties.actionerRules, 0, this.deepClone(this.actionerRules));
						this.$emit('update:nodeData', this.nodeData);
						// this.nodeData.properties.actionerRules[0] = this.deepClone(this.actionerRules);
						break;
					case "notifier":
						if (this.notifierCheck) {
							this.actionerRules.push({
								key: "manual_c6d5_e1ec_7e06_09a9",
								multi: 1,
								range: {
									allStaff: null
								},
								select: ["allStaff"],
								type: "target_select"
							});
						}
						this.$set(this.nodeData.properties, 'actionerRules', this.deepClone(this.actionerRules));
						break;
					case "condition":
						var beforeIndex = this.conditionIndex;
						var afterIndex = this.conditionRecord;
						var objBefore = this.conNodes[beforeIndex];
						if(beforeIndex != afterIndex){
							if(afterIndex > beforeIndex){
								this.conNodes.splice(afterIndex+1, 0, objBefore);
								this.conNodes.splice(beforeIndex, 1);
							}else{
								this.conNodes.splice(beforeIndex, 1);
								this.conNodes.splice(afterIndex, 0, objBefore);
							}
						}
						this.checkListShow.length && this.checkListShow.map((item, index) => {
							if(item.type === 'yunque_range_condtion'){
								if(that.numberObj[item.paramKey].key != 'between'){
									that.numberObj[item.paramKey][that.numberObj[item.paramKey].key] = that.numberObj[item.paramKey].one;
								}else{
									that.numberObj[item.paramKey][that.numberObj[item.paramKey].between.one] = that.numberObj[item.paramKey].one;
									that.numberObj[item.paramKey][that.numberObj[item.paramKey].between.two] = that.numberObj[item.paramKey].two;
								}
								// that.$delete(that.numberObj[item.paramKey], 'between')//删除了age属性
								that.$delete(that.numberObj[item.paramKey], 'one')//删除了age属性
								that.$delete(that.numberObj[item.paramKey], 'two')//删除了age属性
								that.checkListShow[index] = that.deepClone(that.numberObj[item.paramKey]);
							}
						});
						// console.log(that.checkListShow);
						this.$set(this.nodeData.properties.conditions, '0', this.deepClone(this.checkListShow));
						break;
				}
				this.nodeData.name = this.name;
				this.colseProperty();
			},
			judgeIsEmpty() { // 判断IsEmpty应该为true还是false
				if ((this.actionerRules.approvals && this.actionerRules.approvals.length) || (this.actionerRules.range && this.actionerRules
						.range.approvals.length) || (this.actionerRules.labelNames) || (this.actionerRules.projectNames)) {
					this.actionerRules.isEmpty = false;
				} else {
					this.actionerRules.isEmpty = true;
				}
			},
			saveChoosePerson() {
				var that = this;
				if(this.type === 'notifier'){
					this.shuttleBackData.length && this.shuttleBackData.map((item) => {
						if(item.depart_name){
							that.actionerRules.push(
								{ 	// 抄送人的数据
									"type": "target_dep",
									"departName": item.depart_name, // 
									"id": item.id // 
								}
							);
						}else if(item.username){
							that.actionerRules.push(
								{
									"type": "target_approval", // 选择的数据类型; target_approval: 人员;target_label: 角色;target_management: 主管;
									"approvals": [{ // 抄送人的数据
										"userName": item.username, // 人员姓名
										"workNo": item.id // 人员id
									}]
								}
							);
						}else if(item.role_name){
							that.actionerRules.push(
								{ // 抄送人的数据
									"labelNames": item.role_name, // 角色名
									"labels": item.id, // 角色id
									"type": "target_label",
								}
							);
						}else if(item.dict_label){
							that.actionerRules.push(
								{
									"level": item.id, // 主管等级
									"type": "target_management",
								},
							);
						}
					});
					// console.log(this.actionerRules);
					this.choosePerson = false;
					return
				}
				else if(this.type === 'condition'){
					this.shuttleBackData.length && this.shuttleBackData.map((item) => {
						if(item.depart_name){
							that.checkListShow[that.conditionsIndex].conds.push(
								{
									"attrs": {
										"name": item.depart_name,
										"id": item.id,
									},
									"type": "dep", // 表示选择了人员
								}
							);
						}else if(item.username){
							that.checkListShow[that.conditionsIndex].conds.push(
								{
									"attrs": {
										"name": item.username,
										"id": item.id,
									},
									"type": "user", // 表示选择了人员
								}
							);
						}else if(item.role_name){
							that.checkListShow[that.conditionsIndex].conds.push(
								{
									"attrs": {
										"groupId": item.id,
										"name": item.role_name
									},
									"type": "label", // 表示选择了角色
								}
							);
						}else if(item.dict_label){
							that.checkListShow[that.conditionsIndex].conds.push(
								{
									"attrs": {
										"id": item.id,
									},
									"type": "management", // 表示选择了角色
								}
							);
						}
					});
					this.choosePerson = false;
					return
				}
				var user = [];
				switch (this.actionerRules.type) {
					case "target_approval":
						this.shuttleBackData.length && this.shuttleBackData.map((item) => {
							let obj = {
								"userName": item.username,
								"workNo": item.id,
							}
							user.push(obj);
						});
						this.actionerRules.approvals = user;
						break;
					case "target_label":
						this.actionerRules.labelNames = this.shuttleBackData[0].role_name;
						this.actionerRules.labels = this.shuttleBackData[0].id;
						break;
					case "target_project":
						this.actionerRules.projectNames = this.shuttleBackData[0].role_name;
						this.actionerRules.projectId = this.shuttleBackData[0].id;
						break;
					case "target_select":
						if(this.actionerRules.select === 'approvals'){
							this.shuttleBackData.length && this.shuttleBackData.map((item) => {
								let obj = {
									"userName": item.username,
									"workNo": item.id,
								}
								user.push(obj);
							});
							this.actionerRules.range.approvals = user;
						}else if(this.actionerRules.select === 'labels'){
							this.shuttleBackData.length && this.shuttleBackData.map((item) => {
								let obj = {
									"labelNames": item.role_name,
									"labels": item.id,
								}
								user.push(obj);
							});
							this.actionerRules.range.labels = user;
						}
						break;
				}
				this.judgeIsEmpty();
				this.choosePerson = false;
			},
			configChange(){
				this.allCalculation();
			},
			allCalculation(){
				this.formConfig.every(function (val) {
					return val.fieldBehavior == "";
				}) ? (this.formFields = 'read')
				:
				this.formConfig.every(function (val) {
					return val.fieldBehavior == "NORMAL";
				}) ? (this.formFields = 'write')
				:
				this.formConfig.every(function (val) {
					return val.fieldBehavior == "HIDDEN";
				}) ? (this.formFields = 'hide')
				: (this.formFields = 'null');
			},
			allConfigChange(val){
				let that = this;
				switch(val){
					case 'read':
						that.formConfig.length && that.formConfig.map((item) => {
							item.fieldBehavior = '';
						});
						break;
					case 'write':
						that.formConfig.length && that.formConfig.map((item) => {
							item.fieldBehavior = 'NORMAL';
						});
						break;
					case 'hide':
						that.formConfig.length && that.formConfig.map((item) => {
							item.fieldBehavior = 'HIDDEN';
						});
						break;
				}
			},
			appendContion(){
				let that = this;
				this.checkList = [];
				this.oldArr = this.checkListShow;
				this.checkListShow.length && this.checkListShow.map((item) => {
					that.checkList.push(item.paramLabel);
				});
				// console.log(that.numberObj)
				for(let key in that.numberObj){
					that.checkList.push(that.numberObj[key].paramLabel);
				}
				this.alternative = true;
			},
			alterAffirm(){
				this.alternative = false;
				let that = this;
				that.checkListShow = [];
				that.numberObj = {};
				let arr =  this.activeUsers.filter(item => that.checkList.indexOf(item.title) != -1);
				arr.length && arr.map((item) => {
					let historical = this.oldArr ? (this.oldArr.filter(hist => item.title == hist)) : [];
					switch(item.element){
						case "Money":
							if(historical.length){
								that.checkListShow.push(historical[0]);
								break;
							}
							var objAdd = {
								"key": "boundEqual", // between：表示介于两数字之间;1：非两数字之间;
								"boundEqual": '', // 等于
								"lowerBoundNotEqual": "", // 大于
								"upperBound": "", // 小于的值
								"upperBoundEqual": "", // 小于等于 
								"lowerBound": '', // 大于等于
								"paramKey": item.id,
								"paramLabel": `${item.title}`, // 组件名称
								"type": "yunque_range_condtion", // 该类型条件为有公式判断的类型
								"unit": item.unit, // 组件单位
								"one": 0,
								"two": 0,
								"between":{
									one: 'lowerBound',
									two: 'upperBound'
								}
								// "valid": undefined,
								// "validtype": undefined,
							};
							that.numberObj[item.id] = objAdd;
							that.checkListShow.push(objAdd);
							break;
						case "Choice":
							if(historical.length){
								that.checkListShow.push(historical[0]);
								break;
							}
							that.checkListShow.push({
								"paramKey": item.id, // 组件id
								"paramLabel": item.title, // 组件名称
								"paramValue": "",
								"paramValues": [], // 选中的值
								"option": item.option,
								"type": "yunque_value_condtion", // 该类型条件为复选框类型
								"valid": undefined,
							},);
							break;
						case "Start":
							if(historical.length){
								that.checkListShow.push(historical[0]);
								break;
							}
							that.checkListShow.push({
								"conds": [ // 选择的数据，一个数组元素为一个数据
								],
								"paramKey": "origin_dept",
								"paramLabel": "发起人",
								"type": "yunque_dep_condtion", // 该类型条件为发起人
							});
							break;
					}
				});
				// this.conditionsArr.conditions[0] = this.checkListShow;
				// console.log(arr);
			},
			clearCheck(index){
				this.checkListShow.splice(index, 1);
				this.checkList.splice(index, 1);
			},
			clearConds(data, index){
				data.splice(index, 1);
			},
		},
		directives: {
			myfocus: { // 判渎值，为true就获取焦点
				update: function(el, value) { //第二个参数传进来的是个json
					if (value) {
						el.focus();
					}
				}
			}
		},
		watch: {
			property(val) { // 监听页面被打开，将打开的节点数据更新过来
				if (val) {
					// console.log(this.formData);
					let replaceName = this.nodeData ? this.nodeData.nodeId : '';
					let that = this;
					let arrDispose = this.deepClone(this.selectDataDispose);
					switch (this.nodeData.type) {
						case "start":
							this.nodeData.name ? (this.name = this.nodeData.name) : (this.name = '发起人');
							this.formConfigData && this.formConfigData[replaceName] && (this.formConfig = this.deepClone(this.formConfigData[replaceName]));
							if(!this.formConfigData[replaceName]){
								this.$set(this, 'formConfig', arrDispose);
							}else{
								arrDispose.length && arrDispose.map((item) => {
									that.formConfig.length && that.formConfig.map((f_item) => {
										(item.fieldId == f_item.fieldId) && (item.fieldBehavior = f_item.fieldBehavior);
									});
								});
								this.$set(this, 'formConfig', arrDispose);
							}
							this.allCalculation();
							break;
						case "approver": // 审批节点
							this.actionerRules = this.deepClone(this.nodeData.properties.actionerRules[0]);
							this.nodeData.name ? (this.name = this.nodeData.name) : (this.name = '审批人');
							this.formConfigData && this.formConfigData[replaceName] && (this.formConfig = this.deepClone(this.formConfigData[replaceName]));
							if(!this.formConfigData[replaceName]){
								this.$set(this, 'formConfig', arrDispose);
							}else{
								arrDispose.length && arrDispose.map((item) => {
									that.formConfig.length && that.formConfig.map((f_item) => {
										(item.fieldId == f_item.fieldId) && (item.fieldBehavior = f_item.fieldBehavior);
									});
								});
								this.$set(this, 'formConfig', arrDispose);
							}
							this.allCalculation();
							break;
						case "notifier": // 抄送人
							this.actionerRules = this.deepClone(this.nodeData.properties.actionerRules);
							this.nodeData.name ? (this.name = this.nodeData.name) : (this.name = '抄送人');
							if (this.actionerRules.length && this.actionerRules[this.actionerRules.length - 1].type === 'target_select') {
								this.actionerRules.splice(this.actionerRules.length - 1, 1);
								this.notifierCheck = true;
							} else {
								this.notifierCheck = false;
							}
							break;
						case "condition": // 条件节点
							this.numberObj = {};
							this.checkListShow = [];
							this.conditionRecord = this.conditionIndex;
							this.nodeData.name ? (this.name = this.nodeData.name) : (this.name = `条件${this.conditionIndex+1}`);
							if(this.nodeData.properties.conditions.length){
								this.nodeData.properties.conditions[0].length && this.nodeData.properties.conditions[0].map((item) => {
									if(item.type === 'yunque_range_condtion'){
										that.numberObj[item.paramKey] = {};
										if(item.key != 'between'){
											item.one = item[item.key];
											item.two = 0;
										
										}else{
											item.one = item[item.between.one];
											item.two = item[item.between.two];
										}
										that.numberObj[item.paramKey] = that.deepClone(item);
									}
								});
								that.checkListShow = that.nodeData.properties.conditions[0];
							}
							this.refe = false;
							this.$nextTick(function(){// 加此操作是为了将递归组件做强制刷新，因为递归组件第一时间不能及时更新dom
								this.refe = true;
							});
							break;
					}
					this.type = this.nodeData.type;
				}
			}
		},
	}
</script>

<style scoped="scoped" lang="less">
	@import "../../static/css/general.less";

	.property {
		.property-mask {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 999;
			background: rgba(0, 0, 0, 0.28);
		}

		.property-content {
			position: fixed;
			top: 0;
			right: 0px;
			bottom: 0;
			width: 550px;
			background: #fff;
			z-index: 999;

			.property-header {
				font-size: 16px;
				height: 60px;
				line-height: 60px;
				padding: 0 24px;
				box-shadow: 0 1px 0 0 rgba(218, 218, 218, );

				.editable-text-field {
					height: 60px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;

					.text-value-wrapper {
						cursor: pointer;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}

				}
			}

			.property-body {
				bottom: 60px;
				position: absolute;
				top: 57px;
				width: 100%;
				overflow: auto;
				overflow-x: hidden;
				&::-webkit-scrollbar{
					width: 4px;
					height: 4px;
					background-color: #f8f8f8;
				}
				&::-webkit-scrollbar-thumb{
					border-radius: 16px;
					background-color: #e8e8e8;
				}
				.tabs {
					box-sizing: border-box;
					margin: 0;
					padding: 0;
					color: rgba(0, 0, 0, .65);
					font-size: 14px;
					font-variant: tabular-nums;
					line-height: 1.5;
					list-style: none;
					font-feature-settings: "tnum";
					position: relative;
					zoom: 1;

					.tabs-top-bar {
						margin: 0 0 16px;
						border-bottom: 1px solid #e8e8e8;
						outline: none;

						.tabs-nav-container {
							position: relative;
							box-sizing: border-box;
							margin-bottom: -1px;
							overflow: hidden;
							font-size: 14px;
							line-height: 1.5;
							white-space: nowrap;
							zoom: 1;

							.tabs-nav-wrap {
								overflow: hidden;
								white-space: nowrap;

								.tabs-nav-animated {
									position: relative;
									display: inline-block;
									box-sizing: border-box;
									margin: 0;
									padding-left: 0;
									list-style: none;
									transition: -webkit-transform .3s cubic-bezier(.645, .045, .355, 1);
									transition: transform .3s cubic-bezier(.645, .045, .355, 1);
									transition: transform .3s cubic-bezier(.645, .045, .355, 1), -webkit-transform .3s cubic-bezier(.645, .045, .355, 1);

									.tabs-tab {
										position: relative;
										display: inline-block;
										box-sizing: border-box;
										height: 100%;
										margin: 0 32px 0 0;
										padding: 12px 16px;
										text-decoration: none;
										cursor: pointer;
										-webkit-transition: color .3s cubic-bezier(.645, .045, .355, 1);
										transition: color .3s cubic-bezier(.645, .045, .355, 1);
									}

									.tabs-tab.active {
										color: #1890ff;
										font-weight: 500;
									}

									.tabs-tab:hover {
										color: #40a9ff;
									}

									.tabs-ink-bar {
										display: block;
										transform: translate3d(0px, 0px, 0px);
										width: 102px;
										position: absolute;
										bottom: 1px;
										left: 0;
										z-index: 1;
										-webkit-box-sizing: border-box;
										box-sizing: border-box;
										height: 2px;
										background-color: #1890ff;
										-webkit-transform-origin: 0 0;
										-ms-transform-origin: 0 0;
										transform-origin: 0 0;
										transition: all .3s;
									}

									.tabs-ink-bar.tabs-ink-bar-two {
										width: 116px;
										transform: translate3d(134px, 0px, 0px);
									}

									.tabs-ink-bar.tabs-ink-bar-one {
										width: 116px;
										transform: translate3d(0px, 0px, 0px);
									}

								}
							}
						}
					}

					.tabs-top-content {
						width: 100%;
						margin-left: 0%;
						display: flex;
						-webkit-box-orient: horizontal;
						-webkit-box-direction: normal;
						-ms-flex-direction: row;
						flex-direction: row;
						-webkit-transition: margin-left .3s cubic-bezier(.645, .045, .355, 1);
						transition: margin-left .3s cubic-bezier(.645, .045, .355, 1);
						will-change: margin-left;

						.tabpanel {
							flex-shrink: 0;
							width: 100%;
							opacity: 1;
							transition: opacity .45s;

							.group-content {
								width: 100%;
								padding: 15px 24px;
								border-bottom: 1px solid #EBEBEB;
								box-sizing: border-box;
								margin: 0;
								color: rgba(0, 0, 0, .65);
								font-size: 14px;
								font-variant: tabular-nums;
								line-height: 1.5;
								list-style: none;
								-webkit-font-feature-settings: "tnum";
								font-feature-settings: "tnum";
								display: inline-block;
								line-height: unset;

								.approver-actions {
									position: relative;
									padding: 5px 0 7px;
									display: inline-block;

									.area-auto-up {
										margin-top: 14px;
									}
								}

								.approver-list {
									.approver-item {
										display: inline-block;
										white-space: nowrap;
										background: rgba(50, 150, 250, 0.1);
										border-radius: 4px;
										padding: 2px 8px;
										margin-right: 8px;
										margin-bottom: 8px;
										transition: all .3s;

										&:hover {
											cursor: pointer;
											opacity: 0.7;
										}
									}
								}

								.approver-list-range {
									margin-top: 20px;
								}
							}

							.jurisdiction-box {
								position: relative;
								top: -15px;

								.table-header {
									background: #fafafa;
								}

								table {
									overflow-y: scroll;
									table-layout: fixed;
									width: 100%;
									border-collapse: collapse;

									td,
									th {
										border-bottom: 1px solid #e8e8e8;
										text-align: left;
										border-top-left-radius: 4px;
										padding: 15px 15px;
										word-wrap: break-word;

										.th-box {
											display: flex;
										}
									}
								}

								label {
									margin: 0;
								}
							}

							.condition-group {
								padding: 0 16px;
								margin: 16px 0;
								display: flex;
								justify-content: space-between;
								align-items: center;
								position: relative;
								&.m-b{
									margin-bottom: 50px;
								}
								.condition-group-header {
									width: 100px;
								}
								.condition-group-content{
									width: calc(100% - 100px);
									margin-right: 10px;
								}
								.el-input-number{
									margin-right: 10px;
								}
								.selection {
									border: 1px solid #d9d9d9;
									border-radius: 4px;
									min-height: 32px;
									padding-bottom: 3px;
									cursor: text;
									zoom: 1;
									transition: all .3s;

									ul {
										padding-left: 5px;
									}

									li {
										position: relative;
										float: left;
										max-width: 99%;
										margin-right: 4px;
										padding: 0 20px 0 10px;
										overflow: hidden;
										color: rgba(0, 0, 0, .65);
										background-color: #fafafa;
										border: 1px solid #e8e8e8;
										border-radius: 2px;
										cursor: default;
										-webkit-transition: padding .3s cubic-bezier(.645, .045, .355, 1);
										transition: padding .3s cubic-bezier(.645, .045, .355, 1);
										height: 24px;
										margin-top: 3px;
										line-height: 22px;
										span{
											position: absolute;
											right: 5px;
											top: 0;
										}
									}

									&:hover {
										border-color: #40a9ff;
									}
								}
							}

							.condition-group-checked {
								align-items: flex-start;
								margin-bottom: 0;

								

								.el-checkbox {
									margin-bottom: 12px;
								}
							}

							.condition-remain-tip {
								font-family: PingFangTC-Regular;
								font-size: 13px;
								color: rgba(25, 31, 37, 0.56);
							}
						}

						.group-title {
							font-family: PingFangSC-Medium;
							font-size: 14px;
							color: #191F25;
							margin-bottom: 16px;
						}
					}

					.tabs-top-content.tabs-top-content-j {
						margin-left: -100%;
					}
				}
			}

			.property-footer {
				position: absolute;
				bottom: 0;
				width: 100%;
				z-index: 10;
				text-align: left;
				padding: 14px 24px;
				box-shadow: 0 -1px 0 0 rgba(218, 218, 218, 0.5);

				.btn {
					margin-left: 8px;
				}
			}
		}

		.text-desc {
			color: #999;
			margin-left: 15px;
			margin-top: 10px;
		}

		.originator-desc {
			color: #999;
		}
	}
</style>
