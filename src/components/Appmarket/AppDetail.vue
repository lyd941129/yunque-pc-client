<!-- 应用详情 -->
<template>
	<div class="app-detail">
		<!-- app -->
		<div class="app-item">
			<img class="icon-img" v-if="detail.app_style" :src="imgHttp+'/'+detail.app_style">
			<i v-else class="icon" :class="detail.icon_url ? detail.icon_url : 'icon-project'"></i>
			<div class="app-text">
				<div class="app-title">{{detail.app_name}}</div>
				<div class="app-dec">所属于{{detail.app_module}}模块</div>
				<div class="app-time">发布时间：{{getLocalTime(detail.publish_time)}}</div>
			</div>
			<div class="installation">安装应用</div>
		</div>
		<!-- app简介 -->
		<div class="app-introductory">
			<div class="title">应用简介</div>
			<div class="dec">{{detail.describe}}</div>
		</div>
		<!-- app详情 -->
		<div class="app-introductory app-item-detail">
			<div class="title">应用详情</div>
			<div class="dec" v-html="detail.app_detail"></div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	export default{
		props: {
			information: {},
		},
		created() {
			let that = this;
			that.$axios.post('/api/market/info', { app_id: that.information.id }).then(data => {
				if(data.data.code === 1){
					console.log(data);
					that.detail = data.data.data;
				}else{
					that.overdueOperation(data.data.code, data.data.msg);
				}
				that.loading = false;
			}).catch(msg => {
				that.$message.error(msg);
				that.loading = false;
			});
		},
		data(){
			return {
				detail: {},
			}
		},
		computed: {
			getLocalTime: function() {// 时间转化
				return function(nS) {
					return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
				}
			},
		}
	}
</script>

<style lang="less" scoped="scoped">
	.app-detail{
		padding: 0px 170px;
		height: 100%;
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
		.app-item{
			position: relative;
			.icon-img{
				position: absolute;
				top: 0px;
				left: 0px;
				width: 112px;
				height: 112px;
			}
			.icon{
				transform: scale(2.8);
				position: absolute;
				top: 36px;
				left: 36px;
				cursor: default;
			}
			.app-text{
				margin-left: 172px;
				display: flex;
				flex-direction: column;
				.app-time,
				.app-dec,
				.app-title{
					font-size: 16px;
					font-weight: 700;
					color: #000000;
				}
				.app-title{
					margin-bottom: 13px;
				}
				.app-dec{
					color: #666666;
					font-weight: 400;
					margin-bottom: 30px;
				}
				.app-time{
					color: #666666;
					font-weight: 400;
				}
			}
			.installation{
				width: 62px;
				height: 20px;
				opacity: 1;
				background: #38adff;
				font-weight: 400;
				color: #ffffff;
				line-height: 22px;
				position: absolute;
				top: 0;
				right: 20px;
				text-align: center;
				font-size: 12px;
				&:hover{
					transition: all .3s;
					opacity: 0.7;
					cursor: pointer;
				}
			}
			margin-bottom: 47px;
		}
		.app-introductory{
			.title{
				font-size: 16px;
				font-weight: 400;
				color: #000000;
				line-height: 40px;
				border-bottom: 1px solid #eaeced;
			}
			.dec{
				font-size: 16px;
				font-weight: 400;
				color: #666666;
				margin: 23px 0 48px 0;
			}
		}
	}
</style>
