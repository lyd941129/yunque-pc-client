<!-- 个人管理 -->
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
		<h5 id="jump0" class="step-jump">日常办公</h5>
		<div class="surface">
			<div class="surface-box" v-for="(item, index) in organization" :key="index" @click="adhibitionFun(item)">
				<i class="icon" :class="item.icon"></i>
				<span>{{item.app_name}}</span>
			</div>
		</div>
		<h5 id="jump2" class="step-jump">资料管理</h5>
		<div class="surface">
			<div class="surface-box" v-for="(item,index) in companyData" :key="index" @click="adhibitionFun(item)">
				<i :class="['icon',item.icon]"></i>
				<span>{{item.app_name}}</span>
			</div>
		</div>
		<h5 id="jump3" class="step-jump">问题及反馈</h5>
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
				loading: false,
				adhibitionArrData: [],
				// noEnabled: [],
                // 日常办公
				organization: [
					{
						app_name: '代办',
						icon: 'icon-agency',
						app_id: "",
						type: ''
					},
                    {
						app_name: '已办',
						icon: 'icon-already',
						app_id: "",
						type: ''
					},
                    {
						app_name: '消息通知',
						icon: 'icon-message',
						app_id: "",
						type: ''
					},
                    {
						app_name: '送阅',
						icon: 'icon-sendRead',
						app_id: "",
						type: ''
					},
                    {
						app_name: '我发起的',
						icon: 'icon-started',
						app_id: "",
						type: ''
					}
				],
				// 资料管理
				companyData: [
					{
						app_name: '系统助手',
						icon: 'icon-SystemAgent',
						app_id: "SystemAgent",
						type: 'SystemAgent'
					}
				],
				// 问题及反馈
				orderData: [
					{
						app_name: '常见问题',
						icon: 'icon-commonProblem',
						app_id: "",
						type: ''
					},
					{
						app_name: '我要反馈',
						icon: 'icon-feedback',
						app_id: "",
						type: ''
					}
				],
				anchorPointArr: [// 锚点数据
					'日常办公',
					'资料管理',
					'问题及反馈',
				],
				anchorPointindex: '0',
				scrollTop: 0,
			}
		},
		created() {
			console.log(1)
		},
        mounted(){
            console.log(2)
        },
		methods:{
			getData(){
				
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
