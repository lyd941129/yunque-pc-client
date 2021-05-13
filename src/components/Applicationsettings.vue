<!-- 应用设置组件 -->
<template>
	<div class="enterprise-box dis-flex">
		<el-row class="tac">
			<el-col :span="12">
				<el-menu :default-active="adhibition" class="el-menu-vertical-demo" @select="handlAdhibition">
					<el-menu-item v-for="(item, index) in adhibitionArr" :index="item.key" :key="index">
						<span slot="title" class="span-css" :class="item.status">{{item.lable}}<i v-if="item.status === 'required-css'" class="required-css">*</i></span>
					</el-menu-item>
				</el-menu>
			</el-col>
		</el-row>
		<div class="enterprise-right" :class="{'gry': adhibition === 'flow'}" v-loading="loading">
			<BasePage :baseData="getSet.base" v-show="adhibition === 'basics'"></BasePage>
			<FromAndPrint :fromData.sync="getSet.form" :enableForm.sync="getSet.base.enable_form" :enableTemplate.sync="getSet.base.enable_template"
			v-show="adhibition === 'from'"></FromAndPrint>
			<Flow :selectData="fieldSelect" :flowData="getSet.flow.flow_set" :sysCode="getSet.sys_code" :formConfigData="getSet.formConfig" 
			:selectDataDispose="jurisdictionExample" v-show="adhibition === 'flow'"
			:appStyle="getSet.base.app_type"></Flow>
			<Advanced :advData.sync="getSet.base" v-show="adhibition === 'advanced'"></Advanced>
			<MsgTemplate key="search" :selectData="fieldSelect" :templateData.sync="getSet.head" :searchData="getSet.search" searchJudge="yes" v-if="adhibition === 'search' && jiazai"></MsgTemplate>
			<MsgTemplate key="msg" :selectData="fieldSelect" :templateData.sync="getSet.template" searchJudge="no" v-if="adhibition === 'msg' && jiazai"></MsgTemplate>
		</div>
	</div>
</template>

<script>
	import Flow from '../views/Flow.vue';
	import BasePage from './Base.vue';
	import Advanced from './Advanced.vue';
	import FromAndPrint from './FormAndPrint.vue';
	import MsgTemplate from './MsgTemplate.vue';
	export default{
		props:{
			itemData: {},
			editableTabs: {},
			editableTabsValue: {},
		},
		components: {
			Flow,
			BasePage,
			Advanced,
			FromAndPrint,
			MsgTemplate,
		},
		data() {
			return {
				adhibition: 'basics',
				adhibitionArr: [{
						lable: '基础设置',
						key: 'basics',
						status: 'required-css',
					},
					{
						lable: '审批流程',
						key: 'flow',
						status: 'required-css',
					},
					{
						lable: '高级设置',
						key: 'advanced',
						status: 'required-css',
					},
					{
						lable: '表单及打印模板',
						key: 'from',
						status: '',
					},
					{
						lable: '查询及列表设置',
						key: 'search',
						status: '',
					},
					{
						lable: '消息推送模板',
						key: 'msg',
						status: '',
					},
				],
				loading: true,
				getSet: {
					base: {
						"id": "", //企业应用表id
						"app_id": "", //关联应用id
						"company_id": "", //企业id
						"app_type": '', //应用类型：1表单、2表单+流程
						"installed": 1, //是否启用
						"enable_form": "", //启用表单id
						"enable_template": "", //启用打印模板id
						"flow_title": "", //审批标题
						"visible_scope": 1, //可见范围：1全部员工、2部分员工
						"visible_member": null, //可见人员
						"visible_depart": null, //可见部门
						"approve_person": 1, //审批人去重：0不启用自动去重、1同一审批人
						"approve_opinion": 1, //审批人意见:1启用必填、0不启用
						"approve_start": 0, //对发起人不可见：1启用、0不启用
						"export_print": null, //可导出打印人员
						"ca_id": "",
						"app_name": '',
						"describe": '',
						"app_module": '',
						"start_person": '',
					},
					"template": { //消息推送模板
						"ca_id": "", //企业应用id
						"field_main": "", //主标题
						"field_vice": "" //副标题
					},
					"head": { //头部信息
						"id": "564442221", //表单主键id
						"field_main": "#单据编号# #项目名称#", //主标题
						"field_vice": "#资金用途# #报销金额# #发起人# #发起时间#"
					},
					"search": [],
					flow: {
						flow_set: {}
					}
				},
				fieldSelect: [],
				jurisdictionExample: [],
				field_main_num: 0,
				jiazai: false,
				isRefresh_l_s: false,
				base_id: '',
				list_type: 'list_text'
			}
		},
		created() {
			let that = this;
			that.loading = true;
			let url = '/api/flow/getSet?app_id='+that.itemData.app_id+'&company_id='+that.loginData.default_company.id+'&uid='+that.loginData.user_info.id;
			this.$axios.post(url).then(res => {
				if(res.data.code === 1){
					that.getSet = res.data.data;
					that.base_id = res.data.data.base.id;
					res.data.data.base.list_type && (that.list_type = res.data.data.base.list_type);
					console.log(that.getSet);
					let obj = that.getSet.form.filter((item) => item.id === that.getSet.base.enable_form);
					obj.length && (this.fieldSelect = obj[0].field);
					if(!that.getSet.flow.flow_set || !that.getSet.flow.flow_set.type){
						that.getSet.flow.flow_set = {
							"name": "发起人",
							"nodeId": "sid_startevent",
							"type": "start"
						}
					}
					if(Array.isArray(that.getSet.formConfig)){
						that.getSet.formConfig = {};
					}
					if(Array.isArray(that.getSet.template)){
						that.getSet.template = {
							"ca_id": "",//企业应用id
							"field_main": "",// 主标题id
							"field_main_title": "", // 主标题id组成的字符
							"field_main_show": "",// 主标题展示文字
							"field_vice": "",// 副标题id
							"field_vice_title": "",// 副标题id组成的字符
							"field_vice_show": ""// 副标题展示文字
						}
					}
					switch(that.list_type){
						case "list_text":
							that.getSet.head = {
								'id': res.data.data.base.id,
								'field_main': res.data.data.head.field_main ? res.data.data.head.field_main : [],//主标题(主标题设置)
								'field_main_title': res.data.data.head.field_main_title ? res.data.data.head.field_main_title : '',
								'field_main_show': res.data.data.head.field_main_show ? res.data.data.head.field_main_show : '',
								'field_vice': res.data.data.head.field_vice ? res.data.data.head.field_vice : [],//副标题（两列显示）
								'field_vice_title': res.data.data.head.field_vice_title ? res.data.data.head.field_vice_title : '',
								'field_vice_show': res.data.data.head.field_vice_show ? res.data.data.head.field_vice_show : '',
								'list_type': that.list_type ? that.list_type : ''
							}
							break;
						case "list_img":
							that.getSet.head = {
								'id': res.data.data.base.id,
								'field_main': res.data.data.head.field_main ? res.data.data.head.field_main : [],//主标题(主标题设置)
								'field_main_title': res.data.data.head.field_main_title ? res.data.data.head.field_main_title : '',
								'field_main_show': res.data.data.head.field_main_show ? res.data.data.head.field_main_show : '',
								'field_content': res.data.data.head.field_content ? res.data.data.head.field_content : [],//内容标题（一列显示）
								'field_content_title': res.data.data.head.field_content_title ? res.data.data.head.field_content_title : '',
								'field_content_show': res.data.data.head.field_content_show ? res.data.data.head.field_content_show : '',
								'field_vice': res.data.data.head.field_vice ? res.data.data.head.field_vice : [],//副标题（两列显示）
								'field_vice_title': res.data.data.head.field_vice_title ? res.data.data.head.field_vice_title : '',
								'field_vice_show': res.data.data.head.field_vice_show ? res.data.data.head.field_vice_show : '',
								'field_url': res.data.data.head.field_url ? res.data.data.head.field_url : [],// 图片配置
								'list_type': that.list_type ? that.list_type : ''
							}
							break;
						case "list_down":
						case "list_shop":
							that.getSet.head = {
								'id': res.data.data.base.id,
								'field_main': res.data.data.head.field_main ? res.data.data.head.field_main : [],//主标题(主标题设置)
								'field_main_title': res.data.data.head.field_main_title ? res.data.data.head.field_main_title : '',
								'field_main_show': res.data.data.head.field_main_show ? res.data.data.head.field_main_show : '',
								'field_content': res.data.data.head.field_content ? res.data.data.head.field_content : [],//内容标题（一列显示）
								'field_content_title': res.data.data.head.field_content_title ? res.data.data.head.field_content_title : '',
								'field_content_show': res.data.data.head.field_content_show ? res.data.data.head.field_content_show : '',
								'field_vice': res.data.data.head.field_vice ? res.data.data.head.field_vice : [],//副标题（两列显示）
								'field_vice_title': res.data.data.head.field_vice_title ? res.data.data.head.field_vice_title : '',
								'field_vice_show': res.data.data.head.field_vice_show ? res.data.data.head.field_vice_show : '',
								'field_url': res.data.data.head.field_url ? res.data.data.head.field_url : '',// 图片配置
								'list_type': that.list_type ? that.list_type : ''
							}
							break;
					}
					// if(!that.getSet.head.field_content){
						// that.getSet.head.list_type = 'list_down';
					// 	that.getSet.head.field_content = [];
					// 	that.getSet.head.field_content_show = '';
					// 	that.getSet.head.field_content_title = '';
					// 	that.getSet.head.field_url = [];
					// }
					// if(!that.getSet.head.field_main_show){
					// 	that.getSet.head = {
					// 		"id": "",
					// 		"field_main": [],
					// 		"field_main_title": "",
					// 		"field_main_show": "",
					// 		"field_vice": [],
					// 		"field_vice_title": "",
					// 		"field_vice_show": ""
					// 	}
					// }
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
				// 测试数据：列表的图文数据
				// that.getSet.head.list_type = 'list_down';
				// that.getSet.head.field_content = [];
				// that.getSet.head.field_content_show = '';
				// that.getSet.head.field_content_title = '';
				// that.getSet.head.field_url = [];
				// 测试数据：列表的图文数据END
				// console.log(that.getSet);
				that.$nextTick(function(){
					that.jiazai = true;
				});
				that.loading = false;
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
			})
		},
		methods:{
			handlAdhibition(key) {
				this.adhibition = key;
			},
		},
		watch:{
			'getSet.base.enable_form':{
				handler(val){
					if(val){
						let that = this;
						let obj = this.getSet.form.filter((item) => item.id === val);
						this.fieldSelect = obj[0].field;
						// console.log(this.fieldSelect)
						// this.getSet.template.field_main = this.getSet.template.field_vice = '';
						that.jurisdictionExample = [];
						this.fieldSelect && this.fieldSelect.length && this.fieldSelect.map((item) => {
							that.jurisdictionExample.push({
								componentName: item.element,
								fieldBehavior: "",
								fieldTitle: item.title,
								fieldId: item.id
							});
						});
						if(that.isRefresh_l_s){
							// console.log('重新请求列表设置数据');
							that.$axios.post('/api/flow/default', {
								'table_id': val
							}).then(res => {
								if(res.data.code === 1){
									that.jiazai = false;
									console.log(res);
									let obj = that.getSet.form.filter((item) => item.id === that.getSet.base.enable_form);
									obj.length && (that.fieldSelect = obj[0].field);
									that.getSet.search = res.data.data.search;
									if(Array.isArray(that.getSet.template)){
										that.getSet.template = {
											"ca_id": "",//企业应用id
											"field_main": "",// 主标题id
											"field_main_title": "", // 主标题id组成的字符
											"field_main_show": "",// 主标题展示文字
											"field_vice": "",// 副标题id
											"field_vice_title": "",// 副标题id组成的字符
											"field_vice_show": ""// 副标题展示文字
										}
									}else{
										that.getSet.template = {
											"ca_id": "",//企业应用id
											"field_main": res.data.data.template.field_main ? res.data.data.template.field_main : [],// 主标题id
											"field_main_title": res.data.data.template.field_main_title ? res.data.data.template.field_main_title : '', // 主标题id组成的字符
											'field_main_show': res.data.data.template.field_main_show ? res.data.data.template.field_main_show : '',
											'field_vice': res.data.data.template.field_vice ? res.data.data.template.field_vice : [],//副标题（两列显示）
											'field_vice_title': res.data.data.template.field_vice_title ? res.data.data.template.field_vice_title : '',
											'field_vice_show': res.data.data.template.field_vice_show ? res.data.data.template.field_vice_show : '',
										}
									}
									switch(that.list_type){
										case "list_text":
											that.getSet.head = {
												'id': that.base_id,
												'field_main': res.data.data.head.field_main ? res.data.data.head.field_main : [],//主标题(主标题设置)
												'field_main_title': res.data.data.head.field_main_title ? res.data.data.head.field_main_title : '',
												'field_main_show': res.data.data.head.field_main_show ? res.data.data.head.field_main_show : '',
												'field_vice': res.data.data.head.field_vice ? res.data.data.head.field_vice : [],//副标题（两列显示）
												'field_vice_title': res.data.data.head.field_vice_title ? res.data.data.head.field_vice_title : '',
												'field_vice_show': res.data.data.head.field_vice_show ? res.data.data.head.field_vice_show : '',
											}
											break;
										case "list_img":
											that.getSet.head = {
												'id': that.base_id,
												'field_main': res.data.data.head.field_main ? res.data.data.head.field_main : [],//主标题(主标题设置)
												'field_main_title': res.data.data.head.field_main_title ? res.data.data.head.field_main_title : '',
												'field_main_show': res.data.data.head.field_main_show ? res.data.data.head.field_main_show : '',
												'field_content': res.data.data.head.field_content ? res.data.data.head.field_content : [],//内容标题（一列显示）
												'field_content_title': res.data.data.head.field_content_title ? res.data.data.head.field_content_title : '',
												'field_content_show': res.data.data.head.field_content_show ? res.data.data.head.field_content_show : '',
												'field_vice': res.data.data.head.field_vice ? res.data.data.head.field_vice : [],//副标题（两列显示）
												'field_vice_title': res.data.data.head.field_vice_title ? res.data.data.head.field_vice_title : '',
												'field_vice_show': res.data.data.head.field_vice_show ? res.data.data.head.field_vice_show : '',
												'field_url': res.data.data.head.field_url ? res.data.data.head.field_url : [],// 图片配置
											}
											break;
										case "list_down":
										case "list_shop":
											that.getSet.head = {
												'id': that.base_id,
												'field_main': res.data.data.head.field_main ? res.data.data.head.field_main : [],//主标题(主标题设置)
												'field_main_title': res.data.data.head.field_main_title ? res.data.data.head.field_main_title : '',
												'field_main_show': res.data.data.head.field_main_show ? res.data.data.head.field_main_show : '',
												'field_content': res.data.data.head.field_content ? res.data.data.head.field_content : [],//内容标题（一列显示）
												'field_content_title': res.data.data.head.field_content_title ? res.data.data.head.field_content_title : '',
												'field_content_show': res.data.data.head.field_content_show ? res.data.data.head.field_content_show : '',
												'field_vice': res.data.data.head.field_vice ? res.data.data.head.field_vice : [],//副标题（两列显示）
												'field_vice_title': res.data.data.head.field_vice_title ? res.data.data.head.field_vice_title : '',
												'field_vice_show': res.data.data.head.field_vice_show ? res.data.data.head.field_vice_show : '',
												'field_url': res.data.data.head.field_url ? res.data.data.head.field_url : '',// 图片配置
												'list_type': 'list_shop'
											}
											break;
									}
									that.$nextTick(function(){
										that.jiazai = true;
									});
								}else{
									that.overdueOperation(res.data.code, res.data.msg);
								}
							}).catch(err => {
								that.$message({
									showClose: true,
									message: err,
									type: 'error'
								});
							});
						}
						!that.isRefresh_l_s && (that.isRefresh_l_s = true);
					}
				}
			},
			'getSet.base.app_type':{
				handler(val){
					if(val == '1'){// 代表是表单类型
						this.adhibitionArr[1].lable = '送阅配置';
						this.adhibitionArr[1].status = '';
					}else if(val == '2'){// 代表是表单加流程类型
						this.adhibitionArr[1].lable = '审批流程';
						this.adhibitionArr[1].status = 'required-css';
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.table-box {
		height: calc(100% - 104px);
		&.table-box-btn{
			height: calc(100% - 164px);
			margin-top: 20px;
		}
	}
	.span-css{
		position: relative;
		.required-css{
			position: absolute;
			color: red;
			right: -10px;
			margin-top: 4px;
		}
	}
	
</style>