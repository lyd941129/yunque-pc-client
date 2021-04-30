<!-- 应用中心 -->
<template>
	<div class="app-market">
		<!-- 左边菜单 -->
		<el-row class="app-market-left">
			<el-col :span="12">
				<el-menu :default-active="applicationModuletion" class="el-menu-vertical-demo" @select="handlApplicationModuletion">
					<el-menu-item v-for="(item, index) in applicationModule" :index="item.id" :key="index">
						{{item.name}}
					</el-menu-item>
				</el-menu>
			</el-col>
		</el-row>
		<!-- 右边内容 -->
		<div class="app-market-right">
			<div class="app-market-right-content">
				<div class="title">
					<div class="appname">{{contentRight.name}}</div>
					<div class="appdate" v-if="renew">到期日期：2021-12-30</div>
				</div>
				<div class="content">
					<span class="explain">说明：</span>
					<div class="content-text">{{contentRight.explain}}</div>
					<div class="content-btn">
						<el-button type="primary" class="buy" @click="buyFun">{{renew ? '立即续费' : '立即购买'}}</el-button>
						<el-button type="warning" class="indent">加入订单</el-button>
					</div>
				</div>
				<div class="app-list">
					<div class="app-list-item" v-for="(item, index) in contentRight.app" :key="index">
						<img class="icon-img" v-if="item.app_style" :src="imgHttp+'/'+item.app_style">
						<i v-else class="icon" :class="item.icon_url ? item.icon_url : 'icon-project'"></i>
						<div class="app-list-item-text">
							<span class="apptitle">{{item.app_name}}</span>
							<span class="des">说明文字内容，说明文字样式内容。说明文字内容，说明文字样式内容。</span>
						</div>
						<div class="installation">安装应用</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 购买弹框 -->
		<!-- 弹框 -->
		<el-dialog :title="title" :visible.sync="centerDialogVisible" center width='600px'>
			<!-- 说明 -->
			<div class="dex-box">
				<span class="explain">说明：</span>
				<div class="content-text">{{contentRight.explain}}</div>
			</div>
			<!-- 时效 -->
			<div class="aging-box">
				<span class="explain">时效：</span>
				<div class="content-text">
					<div class="select-box">
						<span>三个半月</span>
						<span>半年</span>
						<span>一年</span>
						<span>一年半</span>
						<span>两年</span>
					</div>
					<div class="input-box" style="width: 200px;">
						<el-input placeholder="输入购买几个月" v-model="agingInput">
							<template slot="append">个月</template>
						</el-input>
					</div>
				</div>
			</div>
			<!-- 价格 -->
			<div class="price-box">
				<span class="explain">价格：</span>
				<div class="content-text"><span class="price-span">￥92,500</span></div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="btn-dialog buy" style="width: 190px;" @click="createAn('form')">立即付款</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				applicationModule: [
					{
						name: '合同管理',
						id: '1',
						explain: '模块文字说明内容文字，模块文字说明内容文字。模块文字说明内容文字，模块文字说明内容文字。模块文字说明内容文字，模块文字说明内容文字。模块文字说明内容文字，模块文字说明内容文字。模块文字说明内容文字，模块文字说明内容文字。',
						app: [
							{
								app_group: 1,
								app_id: "212216783368994817",
								app_name: "项目部组建",
								app_style: "",
								ca_id: "",
								icon_url: "icon-project",
								installed: 0,
							},
							{
								app_group: 4,
								app_id: "215527427707838465",
								app_name: "成本预算",
								app_style: "uploads/ico/20210315/T20210315085437_84921.png",
								ca_id: "",
								icon_url: "icon-project",
								installed: 0,
							},
							{
								app_group: 2,
								app_id: "223008202799812609",
								app_name: "付款申请",
								app_style: "",
								ca_id: "",
								icon_url: "icon-menu",
								installed: 0,
							},
							{
								app_group: 3,
								app_id: "223009170144727040",
								app_name: "印章申请",
								app_style: "",
								ca_id: "",
								icon_url: "icon-card",
								installed: 0,
							},
							{
								app_group: 5,
								app_id: "223009572059713536",
								app_name: "班组管理",
								app_style: "uploads/ico/20210315/T20210315085556_84921.png",
								ca_id: "",
								icon_url: "icon-project",
								installed: 0,
							},
							{
								app_group: 3,
								app_id: "223011100816412672",
								app_name: "安全管理",
								app_style: "",
								ca_id: "",
								icon_url: "icon-q",
								installed: 0,
							},
							{
								app_group: 3,
								app_id: "223012629560528896",
								app_name: "维修管理",
								app_style: "",
								ca_id: "",
								icon_url: "icon-people",
								installed: 0,
							},
							{
								app_group: 5,
								app_id: "223017059072712705",
								app_name: "供应商管理",
								app_style: "uploads/ico/20210315/T20210315085609_27509.png",
								ca_id: "",
								icon_url: "icon-project",
								installed: 0,
							},
							{
								app_group: 4,
								app_id: "223017804257927168",
								app_name: "劳务付款",
								app_style: "uploads/ico/20210315/T20210315085527_60003.png",
								ca_id: "",
								icon_url: "icon-project",
								installed: 0,
							},
							{
								app_group: 5,
								app_id: "223020839268888577",
								app_name: "劳务公司",
								app_style: "uploads/ico/20210315/T20210315085929_76255.png",
								ca_id: "",
								icon_url: "icon-project",
								installed: 0,
							},
							{
								app_group: 3,
								app_id: "223021383823765504",
								app_name: "巡检管理",
								app_style: "uploads/ico/20210315/T20210315090216_57531.png",
								ca_id: "",
								icon_url: "icon-project",
								installed: 0,
							},
							{
								app_group: 4,
								app_id: "223026298436571137",
								app_name: "材料付款",
								app_style: "uploads/ico/20210315/T20210315085546_73462.png",
								ca_id: "",
								icon_url: "icon-project",
								installed: 0,
							},
							{
								app_group: 2,
								app_id: "223081254367670273",
								app_name: "一般报销",
								app_style: "uploads/ico/20210315/T20210315085410_14305.png",
								ca_id: "",
								icon_url: "icon-project",
								installed: 0,
							},
							{
								app_group: 6,
								app_id: "235802851811598337",
								app_name: "项目立项",
								app_style: "",
								ca_id: "",
								icon_url: "icon-tower",
								installed: 0,
							},
							{
								app_group: 6,
								app_id: "235802851811598337",
								app_name: "项目立项",
								app_style: "",
								ca_id: "",
								icon_url: "icon-tower",
								installed: 0,
							},
							{
								app_group: 6,
								app_id: "238342055192113153",
								app_name: "合同登记",
								app_style: "",
								ca_id: "",
								icon_url: "icon-rw",
								installed: 0,
							},
							{
								app_group: 3,
								app_id: "244119239865892865",
								app_name: "资料移交",
								app_style: "",
								ca_id: "",
								icon_url: "icon-notice",
								installed: 0,
							}
						]
					}, {
						name: '开工准备',
						id: '2',
					}, {
						name: '工程现场',
						id: '3',
					}, {
						name: '成本管理',
						id: '4',
					}, {
						name: '财务管理',
						id: '5',
					}, {
						name: '往来公司',
						id: '6',
					}
				],
				applicationModuletion: '1',
				contentRight: '',
				renew: true,
				centerDialogVisible: false,
				title: '购买账务管理',
				agingInput: '',
			}
		},
		methods: {
			handlApplicationModuletion(key) {
				let obj = this.applicationModule.filter((e) => { return e.id == key; });
				this.contentRight = obj[0];
			},
			createAn(formName){// 确认创建打印模板
				let that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log(1);
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			buyFun(){
				this.centerDialogVisible = true;
			}
		}
	}
</script>

<style lang="less">
	.app-market{
		display: flex;
		height: 100%;
		padding: 0 30px;
		.el-button{
			margin: 0;
			transition: all .3s;
			&:hover{
				opacity: 0.7;
			}
		}
		.indent{
			margin-top: 14px;
			background: #FFE4D0;
			border-color: #F0CAB6;
			color: #FF4400;
		}
		.buy{
			background: #ff4400;
			border-color: #ff4400;
		}
		.app-market-left {
			width: 200px;
			display: inline-block;
			height: 100%;
			background: #F3F5F7;
			border: 1px solid #E9EBEB;
			margin-right: 20px;
			flex-shrink: 0;
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
		.app-market-right{
			flex-grow:1;
			overflow: auto;
			&::-webkit-scrollbar {
				width: 4px;
				height: 4px;
				background-color: #f8f8f8;
			}
			&::-webkit-scrollbar-thumb {
				border-radius: 16px;
				background-color: #e8e8e8;
			}
			.app-market-right-content{
				display: flex;
				flex-direction: column;
				.title{
					background: #eaf8ff;
					border-top-left-radius: 10px;
					border-top-right-radius: 10px;
					padding: 12px 19px;
					display: flex;
					justify-content: space-between;
					font-size: 16px;
				}
				.content{
					padding: 20px;
					border: 1px solid #EAF8FF;
					border-bottom-left-radius: 10px;
					border-bottom-right-radius: 10px;
					display: flex;
					.explain{
						width: 44px;
						display: inline-block;
						flex-shrink: 0;
					}
					.content-text{
						flex-grow: 1;
					}
					.content-btn{
						margin: 0 42px;
						display: flex;
						flex-direction: column;
					}
				}
				.app-list{
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					flex-grow:1;
					font-size: 16px;
					.app-list-item{
						width: calc(50% - 10px);
						padding: 20px;
						border: 1px solid #f0f0f0;
						border-radius: 6px;
						margin-top: 20px;
						display: flex;
						position: relative;
						transition: all 0.3s;
						cursor: pointer;
						&:hover{
							border: 1px solid #a4a8b1;
						}
						img,
						i{
							flex-shrink: 0;
							transform: scale(1.5);
							margin-top: 12px
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
							right: 20px;
							text-align: center;
							font-size: 12px;
						}
						.app-list-item-text{
							display: flex;
							flex-direction: column;
							margin-left: 30px;
							.apptitle{
								font-weight: 400;
								color: #000000;
								line-height: 22px;
							}
							.des{
								font-size: 14px;
								font-weight: 400;
								color: #666666;
								line-height: 22px;
							}
						}
					}
				}
			}
		}
		.el-dialog__body{
			padding: 20px 70px;
			.price-box,
			.aging-box,
			.dex-box{
				display: flex;
				margin-bottom: 28px;
				.explain{
					flex-shrink: 0;
				}
				.content-text{
					.select-box{
						display: flex;
						span{
							display: flex;
							padding: 6px 16px;
							border: 1px solid #dcdcdc;
							margin-right: 12px;
							margin-bottom: 10px;
							transition: all .3s;
							&:hover,
							&.active{
								cursor: pointer;
								color: #FF4400;
								border-color: #FF4400;
							}
						}
					}
					.price-span{
						display: inline-block;
						color: #FF4400;
						font-size: 22px;
						margin-top: -5px;
					}
				}
			}
		}
	}
</style>
