<template>
	<el-container v-loading="loading" v-if="loginData">
		<el-header>
			<el-image v-if="loginData && loginData.default_company.logo" :src="loginData.default_company.logo"></el-image>
			<div v-else class="logo"></div>
			<el-dropdown class="logo-text" placement="top-start" @command="handleEnterpriseList">
				<span class="el-dropdown-link" style="font-size: 16px;color: ##000000FF;font-weight: 400;">
					{{loginData.default_company.name}}<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item v-for="(item, index) in enterpriseList" :key="index" :disabled="item.id == loginData.default_company.id" :command="item.id">{{item.name}}</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				<el-menu-item index="personage">个人管理</el-menu-item>
				<el-menu-item index="enterprise">企业管理</el-menu-item>
				<el-menu-item index="market">应用市场</el-menu-item>
			</el-menu>
			<el-row class="dropdown">
				<el-button v-if="releaseShow()" type="primary" class="issue" @click="release">发布</el-button>
				<el-col :span="12">
					<el-dropdown @command="handleCommand">
						<span class="el-dropdown-link">
							<el-image style="border-radius: 10px;width: 36px;height: 36px;background-position: 0px -70px;top: 13px;right: 10px;" v-if="loginData.user_info.avatar" :src="loginData.user_info.avatar" >
							</el-image>
							<i v-else class="icon icon-exit" style="left: 15px;"></i>
							{{loginData.user_info.username}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>个人信息</el-dropdown-item>
							<el-dropdown-item>修改密码</el-dropdown-item>
							<el-dropdown-item>更换主管理员</el-dropdown-item>
							<el-dropdown-item>注销账户</el-dropdown-item>
							<el-dropdown-item command="logout">退出</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
			</el-row>
		</el-header>
		<el-main>
			
			<!-- 个人管理 -->
			<el-tabs v-if="activeIndex === 'personage'" id="main-tabs" v-model="perTabsValue" type="card" closable @tab-remove="removeTab">
				<el-tab-pane v-for="(item, index) in perTabs" :key="item.name" :label="item.title" :name="item.name">
					<component :ref="'applicat'+ item.name" :is="item.type" :key="item.type" :adhibitionFun="adhibitionFun" :itemData="item" :editableTabs.sync="perTabs" :editableTabsValue.sync="perTabsValue"></component>
				</el-tab-pane>
			</el-tabs>
			<!-- 企业管理 -->
			<el-tabs v-if="activeIndex === 'enterprise'" id="main-tabs" v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
				<el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
					<component :ref="'applicat'+ item.name" :is="item.type" :key="item.type" :adhibitionFun="adhibitionFun" :itemData="item" :editableTabs.sync="editableTabs" :editableTabsValue.sync="editableTabsValue"></component>
				</el-tab-pane>
			</el-tabs>
			<!-- 应用市场 -->
			<el-tabs v-if="activeIndex === 'market'" id="main-tabs" v-model="appTabsValue" type="card" closable @tab-remove="removeAppTab">
				<el-tab-pane v-for="(item, index) in appTabs" :key="item.name" :label="item.title" :name="item.name">
					<component :ref="'app'+ item.name" :is="item.type" :key="item.name" :applicationModule="applicationModule" :adAppFun="adAppFun" :information='item.information'></component>
				</el-tab-pane>
			</el-tabs>
		</el-main>
	</el-container>
</template>

<script>
	import Management from '../components/Management.vue';
	import Personal from '../components/Personal.vue';
	import Applicationsettings from '../components/Applicationsettings.vue';
	import Personnelmanagement from '../components/Personnelmanagement.vue';
	import Divisionalmanagement from '../components/Divisionalmanagement.vue';
	import BasicDatas from '../components/BasicDatas/BasicDatas.vue';
	import OrderLists from '../components/OrderRenewal/OrderLists.vue';
	import Expenditure from '../components/OrderRenewal/Expenditure.vue';
	import OrderPay from '../components/OrderRenewal/OrderPay.vue';
	import BillDetail from '../components/OrderRenewal/BillDetail.vue';
	import Appmarket from '../components/Appmarket/Appmarket.vue';
	import AppDetail from '../components/Appmarket/AppDetail.vue';
	import SystemAgent from '../components/DataManagement/SystemAgent.vue';
	import HelpDetail from '../components/DataManagement/HelpDetail.vue';
	import Feedback from '../components/DataManagement/Feedback.vue';
	
	import axios from 'axios';
	export default {
		components: {
			Management,
			Personal,
			Applicationsettings,
			Personnelmanagement,
			Divisionalmanagement,
			BasicDatas,
			OrderLists,
			Expenditure,
			OrderPay,
			BillDetail,
			Appmarket,
			AppDetail,
			SystemAgent,
			HelpDetail,
			Feedback
		},
		data() {
			return {
				activeIndex: 'personage',
				editableTabsValue: '1',
				appTabsValue: '1',
				perTabsValue: '1',
				editableTabs: [{
						title: '企业管理',
						name: '1',
						type: 'Management'
					},
				],
				appTabs: [{
						title: '应用中心',
						name: '1',
						type: 'Appmarket',
						information: '',
					},
				],
				perTabs: [
					{
						title: '个人管理',
						name: '1',
						type: 'Personal'
					}
				],
				flowConditionArr: [],
				adhibitionArrData: [],
				loading: false,
				enterpriseList: [],
				addNum: '2',
				applicationModule: [],
			}
		},
		computed:{
			releaseShow: function(){
				return function (){ 
					let falg = false;
					let that = this;
					if(that.activeIndex === 'enterprise'){
						// 企业管理
						let obj = this.editableTabs.filter(function(s){
							return s.name == that.editableTabsValue;
						});
						if(obj.length > 0 && obj[0].type == 'Applicationsettings'){
							falg = true;
						}
					}
					return falg;
				}
			},
		},
		created() {
			let that = this;
			this.loginData = localStorage.getItem("loginDatac") ? JSON.parse(localStorage.getItem("loginDatac")) : null;
			// console.log(that.loginData)
			// 获取企业列表
			that.$axios.get('/custom/user/company').then(data => {
				// console.log(data);
				if(data.data.code === 1){
					that.$set(that, 'enterpriseList', data.data.data);
				}else{
					that.overdueOperation(data.data.code, data.data.msg);
				}
			}).catch(msg => {
				that.$message.error(msg);
			});
			// 监听，新增tab页签
			that.$hfBus.$on("addnewtabs",(data)=>{
				console.log(data)
				that.adhibitionFun(data.tab,data.data)
			});
		},
		// 销毁时
		destroyed(){
			this.$hfBus.$off(['addnewtabs'])
		},
		methods: {
			// 企业管理
			handleEnterpriseList(val){// 切换企业
				let that = this;
				that.loading = true;
				that.$axios.post('/custom/company/switch', {
					cid: val
				}).then(data => {
					if(data.data.code === 1){
						that.loginData.default_company = data.data.data.default_company;
						localStorage.setItem("loginDatac", JSON.stringify(that.loginData));
						that.clearTab();
					}else{
						that.overdueOperation(data.data.code, data.data.msg);
					}
					that.loading = false;
				}).catch(msg => {
					that.$message.error(msg);
					that.loading = false;
				});
			},
			handleCommand(command){
				let that = this;
				switch(command){
					case "logout":// 退出登录
						that.loading = true;
						// axios.defaults.baseURL = 'http://yqflow.taozizi.cn';
						that.$axios.post('/custom/token/logout', {}).then(data => {
							if(data.data.code === 1){
								that.$message({
									message: data.data.msg,
									type: 'success'
								});
								setTimeout(function(){
									that.$router.push('/log');
									localStorage.setItem("loginDatac", "");
									localStorage.clear();
								}, 1000)
							}else{
								that.overdueOperation(data.data.code, data.data.msg);
							}
							that.loading = false;
						}).catch(msg => {
							that.$message.error(msg);
							that.loading = false;
						});
						break;
				}
				
			},
			adhibitionFun(objData,subData){// 新增页签
				let that = this,
					type = 'editableTabs',
					tabValueType = 'editableTabsValue';
				if(that.activeIndex === 'personage'){
					type = 'perTabs'
					tabValueType = 'perTabsValue'
				}



				let obj = that[type].filter(function(s){
					return objData.app_id == s.app_id;
				});
				if(obj.length > 0){
					that[tabValueType] = obj[0].name + '';
					return
				}
				that[type].push({
					title: objData.app_name,
					name: that.addNum + '',
					type: objData.type ? objData.type : 'Applicationsettings',
					app_id: objData.app_id,
					ca_id: objData.ca_id,
					lengthNum:  that[type].length,
					subData: subData || ""
				});
				that[tabValueType] = that.addNum + '';
				that.addNum = ++that.addNum;
			},
			handleSelect(key, keyPath) {// 顶部分栏切换事件
				let that = this;
				// console.log(key, keyPath);
				if(key === 'market'){// 进入应用市场
					that.loading = true;
					that.applicationModule = [];
					that.$axios.get('/api/market/list').then(data => {
						if(data.data.code === 1){
							data.data.data.app_group.map((group) => {
								group.app = [];
								data.data.data.app.map((app) => {
									if(app.app_group == group.dict_value){
										group.app.push(app);
									}
								});
								that.applicationModule.push(group);
							});
							that.activeIndex = key;
						}else{
							that.overdueOperation(data.data.code, data.data.msg);
						}
						that.loading = false;
					}).catch(msg => {
						that.$message.error(msg);
						that.loading = false;
					});
				}else{
					that.activeIndex = key;
				}
			},
			handlAdhibition(key) {
				this.adhibition = key;
			},
			removeTab(targetName) {
				let type = 'editableTabs',
				tabValueType = 'editableTabsValue';
				if(this.activeIndex === 'personage'){
					type = 'perTabs'
					tabValueType = 'perTabsValue'
				}
				let tabs = this[type],
					activeName = this[tabValueType];
				if(targetName == 1){
					return
				}
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}
				this[tabValueType] = activeName;
				this[type] = tabs.filter(tab => tab.name !== targetName);
			},
			release() {// 发布按钮事件
				let postGetSet = this.$refs['applicat'+(this[tabValueType])][0].getSet;
				let that = this;
				for(let key in postGetSet.formConfig){
					if(!postGetSet.formConfig[key].length){
						that.$delete(postGetSet.formConfig, key);
					}
				}
				this.flowConditionArr = [];
				this.flowConditionFun(postGetSet.flow.flow_set);
				postGetSet.conditionId = this.flowConditionArr;
				delete postGetSet.head.id;
				delete postGetSet.head.list_type;
				// console.log(postGetSet);
				// console.log(JSON.stringify(postGetSet));
				// return
				this.$confirm('确认发布吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.$axios.post('/api/flow/saveSet', {
						'base': postGetSet.base,
						'flow': postGetSet.flow,
						'head': postGetSet.head,
						'search': postGetSet.search,
						'template': postGetSet.template,
						'formConfig': postGetSet.formConfig,
						'condition_field': postGetSet.conditionId,
						'uid': that.loginData.user_info.id
					}).then(res => {
						if(res.data.code === 1){
							that.$message({
								showClose: true,
								message: res.data.msg,
								type: 'success'
							});
							that.$refs.applicat1[0].getData();
							// console.log(res);
						}else{
							that.overdueOperation(res.data.code, res.data.msg);
						}
					}).catch(err => {
						that.$message({
							showClose: true,
							message: err.msg,
							type: 'error'
						});
					});
				}).catch(() => {});
			},
			flowConditionFun(obj){// 选出条件中的条件组件id并组成数组
				let that = this;
				if(obj.type === "route"){
					obj.conditionNodes.map((item) => {
						item.properties.conditions.map((con_item) => {
							con_item.map((con_arr_item) => {
								that.flowConditionArr.indexOf(con_arr_item.paramKey) == -1 && (that.flowConditionArr.push(con_arr_item.paramKey));
							});
						});
					});
				}
				if(obj.childNode && Object.keys(obj.childNode).length){
					this.flowConditionFun(obj.childNode);
				}
			},
			clearTab(){// 重置tab页签
				let that = this;
				that.editableTabs = [that.editableTabs[0]];
				that.editableTabsValue = '1';
				that.$refs.applicat1[0].getData();
				// 个人管理
				that.perTabs = [that.perTabs[0]]
				that.perTabsValue = '1'
			},
			// 应用市场
			adAppFun(grop, app){// 应用市场新增页签
				// console.log(grop, app);
				let that = this;
				let obj = that.appTabs.filter(function(s){
					return app.id == s.name;
				});
				if(obj.length > 0){
					that.appTabsValue = obj[0].name + '';
					return
				}
				that.appTabs.push({
					title: app.app_name,
					name: app.id,
					type: 'AppDetail',
					information: app,
				});
				that.appTabsValue = app.id + '';
			},
			removeAppTab(targetName) {
				let tabs = this.appTabs;
				let activeName = this.appTabsValue;
				if(targetName == 1){
					return
				}
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}
				this.appTabsValue = activeName;
				this.appTabs = tabs.filter(tab => tab.name !== targetName);
			},
		},
	}
</script>

<style lang="less">
	@import "../../static/css/general.less";
	#main-tabs{
		margin: 0 auto;
    	max-width: 1280px;
		min-width: 980px;
	}
	.el-container.is-vertical {
		height: 100%;
	}
	.el-container .el-header{
		justify-content: space-between !important;
		padding: 0 40px;
	}
	.el-header {
		padding: 0;
		display: flex;
		background-color: white;
		align-items: center;
		.logo-text{
			display: flex;
			align-items: center;
			margin-right: 20px;
		}
		.issue{
			position: absolute;
			left: -133px;
			top: 12px;
		}
		.logo {
			width: 40px;
			height: 40px;
			display: inline-block;
			text-align: center;
			line-height: 60px;
			background: url(../assets/img/logo3.png) no-repeat;
			background-position: 50% 50%;
			background-size: 100%;
			margin-right: 20px;
		}

		.dropdown {
			min-width: 100px;
			line-height: 60px;
			margin-left: auto;
			.el-col-12{
				width: 100%;
			}
		}
	}

	.el-tabs {
		height: 100%;

		.el-tabs__header {
			border: 0 !important;
			margin: 0;

			.el-tabs__nav {
				border: 0 !important;

				.el-tabs__item {
					background: #F1F1F1 !important;
					border: 0 !important;
					border-radius: 7px 7px 0 0;

					&.is-active {
						background: white !important;
					}
				}
			}
		}

		.el-tabs__content {
			height: calc(100% - 40px);
			background: white;
			padding: 20px;

			.el-tab-pane {
				height: 100%;
				.enterprise-box-index{
					padding: 0 20%;
					overflow: auto !important;
					&::-webkit-scrollbar{
						width: 4px;
						height: 4px;
						background-color: #f8f8f8;
					}
					&::-webkit-scrollbar-thumb{
						border-radius: 16px;
						background-color: #e8e8e8;
					}
					.surface{
						border: 1px solid #f2f2f2;
						border-radius: 4px;
						display: flex;
						flex-flow: wrap;
						padding: 20px 0;
						.surface-box{
							display: flex;
							flex-direction: column;
							margin-left: 20px;
							justify-content: center;
							align-items: center;
							min-width: 100px;
							transition: all 0.3s;
							margin-bottom: 10px;
							span{
								margin-top: 10px;
							}
							&:hover{
								box-shadow: 0 8px 40px 0 rgba(17, 31, 44, 0.12);
							}
						}
					}
					.adhibition{
						display: flex;
						flex-flow: wrap;
						.adhibition-box{
							display: flex;
							padding: 10px;
							border: 1px solid #f2f2f2;
							border-radius: 4px;
							margin-right: 20px;
							min-width: 200px;
							margin-bottom: 20px;
							cursor: pointer;
							align-items: center;
							transition: all 0.3s;
							position: relative;
							span{
								margin-left: 20px;
							}
							&.uninstalled{
								background-color: rgba(240, 240, 240, 0.5);
								img,
								i,
								span{
									opacity: 0.5;
								}
							}
							&:hover{
								border: 1px solid #a4a8b1;
							}
							.not-enabled{
								position: absolute;
								top: 0;
								right: 0;
								width: 46px;
								height: 18px;
								opacity: 1;
								background: #f39800;
								border-radius: 4px 0px 4px 0px;
								color: #FFFFFF;
								font-size: 12px;
								text-align: center;
							}
						}
					}
				}
				.enterprise-box {
					width: 100%;
					height: 100%;
					overflow: hidden;
					// display: flex;
					.tac {
						width: 200px;
						display: inline-block;
						height: 100%;
						background: #F3F5F7;
						border: 1px solid #E9EBEB;
						margin-right: 20px;

						.el-col-12 {
							width: 100%;

							.el-menu {
								border: 0;
								background: #F3F5F7;
								height: 100%;
								padding: 10px 0;

								.el-menu-item {
									height: 40px;
									line-height: 40px;

									&.is-active {
										background-color: rgba(63, 169, 255, 1);
										color: white;
									}
								}
							}
						}
					}

					.enterprise-right {
						width: calc(100% - 220px);
						height: 100%;
						display: inline-block;
						overflow: auto;
						&::-webkit-scrollbar{
							width: 4px;
							height: 4px;
							background-color: #f8f8f8;
						}
						&::-webkit-scrollbar-thumb{
							border-radius: 16px;
							background-color: #e8e8e8;
						}
						&.gry {
							background-color: #f5f5f7;
						}
					}
				}

			}

		}
	}
	.btn-row{
		.el-button{
			padding: 7px 20px;
		}
	}
</style>
