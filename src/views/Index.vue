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
			<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
				<el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
					<component :ref="'applicat'+ index" :is="item.type" :key="item.type" :adhibitionFun="adhibitionFun" :itemData="item" :editableTabs.sync="editableTabs" :editableTabsValue.sync="editableTabsValue"></component>
				</el-tab-pane>
			</el-tabs>
		</el-main>
	</el-container>
</template>

<script>
	// import Flow from './Flow.vue';
	// import BasePage from '../components/Base.vue';
	// import Advanced from '../components/Advanced.vue';
	// import FromAndPrint from '../components/FormAndPrint.vue';
	// import MsgTemplate from '../components/MsgTemplate.vue';
	import Management from '../components/Management.vue';
	import Applicationsettings from '../components/Applicationsettings.vue';
	import Personnelmanagement from '../components/Personnelmanagement.vue';
	import Divisionalmanagement from '../components/Divisionalmanagement.vue';
	import Basicdata from '../components/Basicdata/Basicdata.vue';
	import axios from 'axios';
	export default {
		components: {
			// Flow,
			// BasePage,
			// Advanced,
			// FromAndPrint,
			// MsgTemplate,
			Management,
			Applicationsettings,
			Personnelmanagement,
			Divisionalmanagement,
			Basicdata
		},
		data() {
			return {
				activeIndex: 'enterprise',
				editableTabsValue: '1',
				editableTabs: [{
						title: '企业管理',
						name: '1',
						type: 'Management'
					},
				],
				flowConditionArr: [],
				adhibitionArrData: [],
				loading: false,
				enterpriseList: [],
				addNum: '2'
			}
		},
		computed:{
			releaseShow: function(){
				return function (){ 
					let falg = false;
					let that = this;
					let obj = this.editableTabs.filter(function(s){
						return s.name == that.editableTabsValue;
					});
					if(obj.length > 0 && obj[0].type == 'Applicationsettings'){
						falg = true;
					}
					return falg;
				}
			},
		},
		created() {
			let that = this;
			// console.log(this.$store.state.loginData)
			if(localStorage.getItem('tokenTime') == null){
				return;
			}
			this.loginData = localStorage.getItem("loginDatac") ? JSON.parse(localStorage.getItem("loginDatac")) : null;
			console.log(that.loginData)
			// 获取企业列表
			that.$axios.get('/custom/user/company', {
				headers: {
					'content-type': 'application/json',
					"token": that.loginData.token  //token换成从缓存获取
				}
			}).then(data => {
				// console.log(data);
				if(data.data.code === 1){
					that.$set(that, 'enterpriseList', data.data.data);
				}else{
					that.overdueOperation(data.data.code, data.data.msg);
				}
			}).catch(msg => {
				that.$message.error(msg);
			});
		},
		methods: {
			handleEnterpriseList(val){
				let that = this;
				that.loading = true;
				that.$axios.post('/custom/company/switch', {
					cid: val
				}, {
					headers: {
						'content-type': 'application/json',
						"token": that.loginData.token  //token换成从缓存获取
					}
				}).then(data => {
					if(data.data.code === 1){
						that.loginData.default_company = data.data.data.default_company;
						localStorage.setItem("loginDatac", JSON.stringify(that.loginData));
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
						axios.defaults.baseURL = 'http://yqflow.taozizi.cn';
						that.$axios.post('/custom/token/logout', {}, {
							headers: {
								'content-type': 'application/json',
								"token": that.loginData.token  //token换成从缓存获取
							}
						}).then(data => {
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
			adhibitionFun(objData){
				let that = this;
				let obj = that.editableTabs.filter(function(s){
					return objData.app_id == s.app_id;
				});
				if(obj.length > 0){
					that.editableTabsValue = obj[0].lengthNum + 1 + '';
					return
				}
				that.editableTabs.push({
					title: objData.app_name,
					name: that.addNum + '',
					type: objData.type ? objData.type : 'Applicationsettings',
					app_id: objData.app_id,
					ca_id: objData.ca_id,
					lengthNum:  that.editableTabs.length
				});
				that.editableTabsValue = that.addNum + '';
				that.addNum = ++that.addNum;
			},
			handleSelect(key, keyPath) {
				// console.log(key, keyPath);
			},
			handlAdhibition(key) {
				this.adhibition = key;
			},
			removeTab(targetName) {
				let tabs = this.editableTabs;
				let activeName = this.editableTabsValue;
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
				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.name !== targetName);
			},
			release() {
				let postGetSet = this.$refs['applicat'+(this.editableTabsValue-1)][0].getSet;
				let that = this;
				for(let key in postGetSet.formConfig){
					if(!postGetSet.formConfig[key].length){
						that.$delete(postGetSet.formConfig, key);
					}
				}
				this.flowConditionArr = [];
				this.flowConditionFun(postGetSet.flow.flow_set);
				postGetSet.conditionId = this.flowConditionArr;
				// console.log(postGetSet);
				// console.log(JSON.stringify(postGetSet));
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
							that.$refs.applicat0[0].getData();
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
						// console.log(err)
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
			}
		},
	}
</script>

<style lang="less">
	@import "../../static/css/general.less";
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
							span{
								margin-left: 20px;
							}
							&:hover{
								border: 1px solid #a4a8b1;
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
</style>
