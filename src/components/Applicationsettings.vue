<!-- 应用设置组件 -->
<template>
	<div class="enterprise-box dis-flex">
		<el-row class="tac">
			<el-col :span="12">
				<el-menu :default-active="adhibition" class="el-menu-vertical-demo" @select="handlAdhibition">
					<el-menu-item v-for="(item, index) in adhibitionArr" :index="item.key" :key="index">
						<span slot="title">{{item.lable}}</span>
					</el-menu-item>
				</el-menu>
			</el-col>
		</el-row>
		<div class="enterprise-right" :class="{'gry': adhibition === 'flow'}" v-loading="loading">
			<BasePage :baseData="getSet.base" v-show="adhibition === 'basics'"></BasePage>
			<FromAndPrint :fromData.sync="getSet.form" :enableForm.sync="getSet.base.enable_form" :enableTemplate.sync="getSet.base.enable_template"
			v-show="adhibition === 'from'"></FromAndPrint>
			<Flow :selectData="fieldSelect" :flowData="getSet.flow.flow_set" :sysCode="getSet.sys_code" :formConfigData="getSet.formConfig" 
			:selectDataDispose="jurisdictionExample" v-show="adhibition === 'flow'"></Flow>
			<Advanced :advData.sync="getSet.base" v-show="adhibition === 'advanced'"></Advanced>
			<MsgTemplate key="search" :selectData="fieldSelect" :templateData.sync="getSet.head" :searchData="getSet.search" searchJudge="yes" v-if="adhibition === 'search'"></MsgTemplate>
			<MsgTemplate key="msg" :selectData="fieldSelect" :templateData.sync="getSet.template" searchJudge="no" v-if="adhibition === 'msg'"></MsgTemplate>
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
						key: 'basics'
					},
					{
						lable: '表单及打印模板',
						key: 'from'
					},
					{
						lable: '审批流程',
						key: 'flow'
					},
					{
						lable: '高级设置',
						key: 'advanced'
					},
					{
						lable: '查询及列表设置',
						key: 'search'
					},
					{
						lable: '消息推送模板',
						key: 'msg'
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
			}
		},
		created() {
			let that = this;
			that.loading = true;
			let url = '/api/flow/getSet?app_id='+that.itemData.app_id+'&company_id='+that.loginData.default_company.id+'&uid='+that.loginData.user_info.id;
			this.$axios.post(url).then(res => {
				if(res.data.code === 1){
					that.getSet = res.data.data;
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
					if(!that.getSet.head.field_main_show){
						that.getSet.head = {
							"id": "",
							"field_main": [],
							"field_main_title": "",
							"field_main_show": "",
							"field_vice": [],
							"field_vice_title": "",
							"field_vice_show": ""
						}
					}
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
				// console.log(that.getSet)
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
						this.getSet.template.field_main = this.getSet.template.field_vice = '';
						that.jurisdictionExample = [];
						this.fieldSelect && this.fieldSelect.length && this.fieldSelect.map((item) => {
							that.jurisdictionExample.push({
								componentName: item.element,
								fieldBehavior: "",
								fieldTitle: item.title,
								fieldId: item.id
							});
						});
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
</style>