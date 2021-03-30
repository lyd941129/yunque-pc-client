<!-- 表单设计中间组件展示 -->
<template>
	<div class="element" :class="[{'element-list': (information.element === 'List')}]">
		<i class="icon icon-ensconce" v-if="information.isHidden"></i>
		<div class="box" :class="{'box-isRequired': information.isRequired == '1'}" v-if="information.element === 'Textbox'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">{{information.value ? information.value : information.prompt}}</div>
		</div>
		<div class="box caption-box" v-if="information.element === 'Caption'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
		</div>
		<div class="box describe-box" :class="{'box-isRequired': information.isRequired == '1'}" v-if="information.element === 'Describe'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">{{information.value ? information.value : information.prompt}}</div>
		</div>
		<div class="box" :class="{'box-isRequired': information.isRequired == '1'}" v-if="information.element === 'Num'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">{{information.value ? information.value : information.prompt}}</div>
		</div>
		<div class="box choice-box" :class="{'box-isRequired': information.isRequired == '1'}" v-if="information.element === 'Choice' || information.element === 'Data' || information.element === 'Association' || information.element === 'Bringback'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip"><div>{{information.value ? information.value : information.prompt}}</div><i class="el-icon-arrow-right"></i></div>
			<div class="relevance-box" v-if="information.relevance">
				<div class="relevance-item" v-for="(item, index) in information.relevance" :key="index">{{item.field_name || item.tit}}</div>
			</div>
		</div>
		<div class="box" v-if="information.element === 'Money'" :class="{'box-isRequired': information.isRequired == '1'}">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">{{information.prompt}}</div>
			<div class="capital" v-if="information.rmb">大写</div>
		</div>
		<div class="box ensconce-box" v-if="information.element === 'Ensconce'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">这是一个隐藏组件，无需修改</div>
		</div>
		<div class="box file-box" v-if="information.element === 'File'" :class="{'box-isRequired': information.isRequired == '1'}">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">+</div>
		</div>
		<div class="box site-box" v-if="information.element === 'Site'" :class="{'box-isRequired': information.isRequired == '1'}">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip tip-choce"><div>请输选择</div><i class="el-icon-arrow-right"></i></div>
			<div class="title" :class="{'no-write': information.status == '0'}">详细地址</div>
			<div class="tip">请输入...</div>
		</div>
		<div class="box list-box" v-if="information.element === 'List'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="phone-within" v-if="information.listData" :class="{'phone-within-no': (information.listData.header.length == 0)}">
				<subassemblyElement v-for="(item, index) in information.listData.header" :key="item.id" :information="item"
				:parentData.sync="information.listData.header" :parentIndex="index"></subassemblyElement>
			</div>
			<div class="tip tip-list"><i class="el-icon-plus"></i>添加</div>
		</div>
	</div>
</template>

<script>
	import subassemblyElement from '../components/Element.vue';
	export default{
		name: "subassemblyElement",
		components: {
			subassemblyElement,
		},
		props:{
			information:{},
			parentIndex:{},
			parentData:{},
		},
		data(){
			return {
			}
		},
		computed:{
			
		},
		methods:{
		},
		watch:{
		}
	}
</script>

<style lang="less" scoped="scoped">
	.element{
		background-color: white;
		margin: 0 2px;
		margin-bottom: 10px;
		cursor: pointer;
		border-left: 3px solid #fff;
		position: relative;
		// transition: border-left-color 0.3s;
		&.element-list{
			border: 1px dashed #ccc;
			border-left-width: 3px;
		}
		&.active{
			border-left: 3px solid rgba(0, 133, 255, 1);
		}
		&:hover{
			border-left: 3px solid #bfc1c2;
			box-shadow: 0 1px 10px 0 rgba(226, 226, 226, 0.5);
			cursor: grab;
		}
		&.active:hover{
			border-left: 3px solid rgba(0, 133, 255, 1);
		}
		.box{
			padding: 16px;
			position: relative;
			.title{
				text-align: left;
				color: rgba(51, 51, 51, 1);
				font-size: 16px;
				margin-bottom: 10px;
				&.no-write{
					color: #a6a6a6;
				}
			}
			.capital{
				color: rgba(51, 51, 51, 1);
				font-size: 16px;
				margin-top: 10px;
			}
			.tip{
				text-align: left;
				color: rgba(166, 166, 166, 1);
				font-size: 16px;
			}
			.relevance-item{
				margin-top: 5px;
				padding: 8px 0;
				border-top: 1px solid #ececec;
			}
			&.caption-box{
				position: relative;
				&::after{
					display: inline-block;
					content: '';
					position: absolute;
					width: 100%;
					height: 1px;
					border-bottom: 1px dashed rgba(24, 144, 255, 1);
					left: 0;
				}
				.title{
					position: relative;
					color: rgba(24, 144, 255, 1);
					padding-left: 10px;
					&::after{
						display: inline-block;
						content: '';
						width: 2px;
						height: 100%;
						background-color: rgba(24, 144, 255, 1);
						position: absolute;
						left: 0;
						border-radius: 2px;
					}
				}
			}
			&.describe-box{
				.tip{
					min-height: 50px;
				}
			}
			&.choice-box{
				.tip{
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
			&.ensconce-box{
				.title{
					color: rgba(166, 166, 166, 1);
				}
			}
			&.file-box{
				.tip{
					width: 46px;
					height: 46px;
					background: #F6F6F6;
					font-size: 32px;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			&.list-box{
				.tip-list{
					text-align: center;
					margin-top: 10px;
				}
				.phone-within{
					&.phone-within-no{
						height: 64px;
						position: relative;
						background-color: #ddeff3;
					}
					&.phone-within-no::before{
						content: '拖入组件';
						display: inline-block;
						position: absolute;
						color: #ccc;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}
				.element{
					box-shadow: 0 1px 10px 0 rgba(226, 226, 226, 0.5);
				}
			}
			&.site-box{
				.tip{
					display: flex;
					justify-content: space-between;
					align-items: center;
					&.tip-choce{
						margin-bottom: 10px;
					}
				}
			}
			&.box-isRequired::after{
				content: "*";
				display: inline-block;
				position: absolute;
				color: red;
				top: 22px;
				left: 8px;
			}
		}
		.operation{
			position: absolute;
			top: 16px;
			right: 16px;
			display: none;
			align-items: center;
			justify-content: center;
			padding: 4px 8px;
			border-radius: 16px;
			background: rgba(17, 31, 44, 0.04);
			z-index: 1;
			&.active{
				display: flex;
			}
			i{
				cursor: pointer;
				&:hover{
					color: #0089ff;
				}
			}
			.wire{
				display: inline-block;
				margin: 0 10px;
				width: 1px;
				border-left: 1px solid #DDDDDD;
				height: 14px;
			}
		}
		.icon-ensconce{
			top: 0;
			left: 0;
			display: inline-block;
			background: url(../assets/icon/icon.png) no-repeat;
			width: 18px;
			height: 18px;
			background-position: -259px -227px;
			position: absolute;
		}
	}
</style>
