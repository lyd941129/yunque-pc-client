<!-- 企业管理 -->
<template>
	<div class="enterprise-box enterprise-box-index" v-loading="loading" @scroll="handleScroll" ref="content">
		<!-- 锚点 -->
		<div class="anchor-point">
			<div class="anchor-point-box" :class="{'active': anchorPointindex == index}" v-for="(item, index) in anchorPointArr" :key="index">
				<div class="title" @click="jump(index)">{{item}}</div>
				<div class="line"></div>
			</div>
		</div>
		<!-- 锚点END -->
		<h5 id="jump0" class="step-jump">组织架构</h5>
		<div class="surface">
			<div class="surface-box" v-for="(item, index) in organization" :key="index" @click="adhibitionFun(item)">
				<i class="icon" :class="item.icon"></i>
				<span>{{item.app_name}}</span>
			</div>
		</div>
		<h5 id="jump1" class="step-jump">应用管理</h5>
		<!-- <h6 style="color: rgba(166, 166, 166, 1);">已启用</h6> -->
		<div v-for="(item, index) in isEnabled" :key="index" v-show="item.child.length > 0">
			<h5>{{item.title}}</h5>
			<div class="adhibition">
				<div class="adhibition-box" v-for="(item_c, index_c) in item.child" :key="index_c" 
				@click="adhibitionFun(item_c)" :class="{'uninstalled': !item_c.installed}">
					<div class="not-enabled" v-if="!item_c.installed">未启用</div>
					<img class="icon-img" v-if="item_c.app_style" :src="imgHttp+'/'+item_c.app_style">
					<i v-else class="icon" :class="item_c.icon_url ? item_c.icon_url : 'icon-project'"></i>
					<span>{{item_c.app_name}}</span>
				</div>
			</div>
		</div>
		<!-- <h6 style="color: rgba(166, 166, 166, 1);">未启用</h6>
		<div class="adhibition">
			<div class="adhibition-box" v-for="(item, index) in noEnabled" :key="index" @click="adhibitionFun(item)">
				<img class="icon-img" v-if="item.app_style" :src="imgHttp+'/'+item.app_style">
				<i v-else class="icon" :class="item.icon_url ? item.icon_url : 'icon-project'"></i>
				<span>{{item.app_name}}</span>
			</div>
		</div> -->
		<h5 id="jump2" class="step-jump">企业数据</h5>
		<div class="surface">
			<div class="surface-box" v-for="(item,index) in companyData" :key="index" @click="adhibitionFun(item)">
				<i :class="['icon',item.icon]"></i>
				<span>{{item.app_name}}</span>
			</div>
		</div>
		<h5 id="jump3" class="step-jump">订单续费</h5>
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
				tabPosition: 'left',
				loading: true,
				adhibitionArrData: [],
				isEnabled: [],
				// noEnabled: [],
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
				],
				anchorPointArr: [// 锚点数据
					'组织架构',
					'应用管理',
					'企业数据',
					'订单续费',
				],
				anchorPointindex: '0',
				scrollTop: 0,
			}
		},
		created() {
			this.getData();
		},
		methods:{
			getData(){
				var that = this;
				// that.$set(that, 'noEnabled', []);
				console.log(that.loginData.default_company.id);
				that.$set(that, 'isEnabled', []);
				this.$axios.post('/api/companyApplication/app?company_id='+JSON.parse(localStorage.getItem("loginDatac")).default_company.id+'&uid='+JSON.parse(localStorage.getItem("loginDatac")).user_info.id).then(res => {
					if(res.data.code === 1){
						that.anchorPointindex = 0
						// console.log( res.data.data);
						// res.data.data.app.length && res.data.data.app.map((app_item) => {
						// 	if(app_item.installed == 0){
						// 		that.noEnabled.push(app_item)
						// 	}
						// });
						res.data.data.app_group.length && res.data.data.app_group.map((item) => {
							let obj = {
								title: item.dict_label,
								child: []
							}
							res.data.data.app.length && res.data.data.app.map((app_item) => {
								if(app_item.app_group == item.dict_value){
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
			},
			jump (index) {// 锚点点击
				let that = this
				// 用 class="step-jump" 添加锚点
				let jump = document.querySelectorAll('.step-jump')
				let total = jump[index].offsetTop - 20;
				//        this.$emit('viewScroll', total)
				let distance = this.scrollTop
				//         平滑滚动，时长500ms，每10ms一跳，共50跳
				let step = total / 50 >> 0
				if (total > distance) {
					smoothDown()
				} else {
				let newTotal = distance - total
					step = newTotal / 50 >> 0
					smoothUp()
				}
				function smoothDown () {
					if (distance < total) {
						distance += step
						that.$refs.content.scrollTop = distance
						setTimeout(smoothDown, 10)
					} else {
						that.$refs.content.scrollTop = total
					}
				}
				function smoothUp () {
					if (distance > total) {
						distance -= step
						that.$refs.content.scrollTop = distance
						setTimeout(smoothUp, 10)
					} else {
						that.$refs.content.scrollTop = total
					}
				}
				// setTimeout(()=>{
				// 	this.anchorPointindex = index
				// }, 1000);
			},
			handleScroll (el) {// 滚动高度获取
				this.scrollTop = this.$refs.content.scrollTop;
			},
			onScroll () {// 判断锚点位置
				let _article = document.querySelectorAll('.step-jump')
				_article.forEach((item, index) => {
					if (this.scrollTop >= item.offsetTop-20) {
						this.anchorPointindex = index;
					}
				})
			},
		},
		watch: {
			scrollTop (val) {
				this.onScroll();
			}
		},
	}
</script>

<style lang="less">
	@import "../../static/css/general.less";
	.enterprise-box {
		.step-jump{
			padding: 12px 20px;
			background-color: #F2F4F5;
			box-shadow: 0px -2px 0px 0px rgba(24,30,33,0.10) inset;
			border-radius: 10px 10px 0px 0px;
		}
		.anchor-point{
			position: fixed;
			top: 50%;
			transform: translateY(-50%);
			right: 10%;
			display: flex;
			flex-direction: column;
			font-size: 16px;
			color: #333333;
			.anchor-point-box{
				padding: 14px 0;
				cursor: pointer;
				&:last-child{
					padding-bottom: 0;
				}
				&:nth-child(1){
					padding-top: 0;
				}
				&.active{
					.title{
						transition: all .3s;
						color: #409eff;
						position: relative;
						&::after{
							content: '';
							height: 40px;
							width: 2px;
							background-color: #409eff;
							position: absolute;
							left: -20px;
							z-index: 2;
							top: 50%;
							transform: translateY(-50%);
						}
					}
				}
				&:hover{
					.title{
						transition: all .3s;
						color: #409eff;
					}
				}
				position: relative;
				.line{
					position: absolute;
					top: 0;
					left: -20px;
					background-color: #c0c4cc;
					height: 100%;
					width: 2px;
				}
			}
		}
	}
	@media screen and (min-width: 1500px){
		.enterprise-box{
			.anchor-point{
				right: 15%;
			}
		}
	}
	@media screen and (min-width: 1700px){
		.enterprise-box{
			.anchor-point{
				right: 20%;
			}
		}
	}
</style>
