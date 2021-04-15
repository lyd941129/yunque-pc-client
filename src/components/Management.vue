<!-- 企业管理 -->
<template>
	<div class="enterprise-box enterprise-box-index" v-loading="loading">
		<h5>组织架构</h5>
		<div class="surface">
			<div class="surface-box" v-for="(item, index) in organization" :key="index" @click="adhibitionFun(item)">
				<i class="icon" :class="item.icon"></i>
				<span>{{item.app_name}}</span>
			</div>
		</div>
		<h5 style="border-bottom: 1px solid #f2f2f2;margin: 0;padding: 20px 0;">应用管理</h5>
		<h6 style="color: rgba(166, 166, 166, 1);">已启用</h6>
		<div v-for="(item, index) in isEnabled" :key="index" v-show="item.child.length > 0">
			<h5>{{item.title}}</h5>
			<div class="adhibition">
				<div class="adhibition-box" v-for="(item_c, index_c) in item.child" :key="index_c" @click="adhibitionFun(item_c)">
					<img class="icon-img" v-if="item_c.app_style" :src="imgHttp+'/'+item_c.app_style">
					<i v-else class="icon" :class="item_c.icon_url ? item_c.icon_url : 'icon-project'"></i>
					<span>{{item_c.app_name}}</span>
				</div>
			</div>
		</div>
		<h6 style="color: rgba(166, 166, 166, 1);">未启用</h6>
		<div class="adhibition">
			<div class="adhibition-box" v-for="(item, index) in noEnabled" :key="index" @click="adhibitionFun(item)">
				<img class="icon-img" v-if="item.app_style" :src="imgHttp+'/'+item.app_style">
				<i v-else class="icon" :class="item.icon_url ? item.icon_url : 'icon-project'"></i>
				<span>{{item.app_name}}</span>
			</div>
		</div>
		<h5>企业数据</h5>
		<div class="surface">
			<div class="surface-box" v-for="(item,index) in companyData" :key="index" @click="adhibitionFun(item)">
				<i :class="['icon',item.icon]"></i>
				<span>{{item.app_name}}</span>
			</div>
		</div>
		<h5>订单续费</h5>
		<div class="surface">


			<div class="surface-box" v-for="(item,index) in orderData" :key="index" @click="adhibitionFun(item)">
				<i :class="['icon',item.icon]"></i>
				<span>{{item.app_name}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			adhibitionFun: {},
			editableTabs: {},
		},
		data() {
			return {
				loading: true,
				adhibitionArrData: [],
				isEnabled: [],
				noEnabled: [],
				organization: [
					{
						app_name: '人员管理',
						icon: 'icon-peoplefirst',
						app_id: "rygl",
						type: 'Personnelmanagement'
					},{
						app_name: '部门管理',
						icon: 'icon-dep',
						app_id: "bmgl",
						type: 'Divisionalmanagement'
					},{
						app_name: '角色管理',
						icon: 'icon-role',
						app_id: "jsgl",
						type: 'Personnelmanagement'
					},{
						app_name: '项目角色管理',
						icon: 'icon-projectfirst',
						app_id: "xmgl",
						type: 'Personnelmanagement'
					}
				],
				// 企业数据
				companyData: [
					{
						app_name: '成员使用统计',
						icon: 'icon-statistics',
						app_id: "statistics",
						type: 'statistics'
					},
					{
						app_name: '管理员操作记录',
						icon: 'icon-operation',
						app_id: "operation",
						type: 'operation'
					},
					{
						app_name: '基础数据管理',
						icon: 'icon-basicdata',
						app_id: "BasicDatas",
						type: 'BasicDatas'
					}
				],
				// 订单续费
				orderData: [
					{
						app_name: '续费管理',
						icon: 'icon-expenditure',
						app_id: "Expenditure",
						type: 'Expenditure'
					},
					{
						app_name: '订单管理',
						icon: 'icon-indent',
						app_id: "OrderLists",
						type: 'OrderLists'
					}
				]
			}
		},
		created() {
			this.getData();
		},
		methods:{
			getData(){
				var that = this;
				that.$set(that, 'noEnabled', []);
				that.$set(that, 'isEnabled', []);
				this.$axios.post('/api/companyApplication/app?company_id='+that.loginData.default_company.id+'&uid='+that.loginData.user_info.id).then(res => {
					if(res.data.code === 1){
						// console.log( res.data.data);
						res.data.data.app.length && res.data.data.app.map((app_item) => {
							if(app_item.installed == 0){
								that.noEnabled.push(app_item)
							}
						});
						res.data.data.app_group.length && res.data.data.app_group.map((item) => {
							let obj = {
								title: item.dict_label,
								child: []
							}
							res.data.data.app.length && res.data.data.app.map((app_item) => {
								if(app_item.installed == 1 && app_item.app_group == item.dict_value){
									obj.child.push(app_item);
								}
							});
							that.isEnabled.push(obj);
						});
						// console.log(that.isEnabled)
						// that.$set(that, 'adhibitionArrData', res.data.data.app);
					}else{
						that.overdueOperation(res.data.code, res.data.msg);
					}
					this.loading = false;
				}).catch(err => {
					// console.log(err);
					this.loading = false;
				})
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	@import "../../static/css/general.less";
</style>
