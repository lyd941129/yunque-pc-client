<!-- 表单及打印模板组件 -->
<template>
	<div class="formandprint">
		<h4>选择要使用的表单模板</h4>
		<el-table ref="multipleTable" :data="fromData" style="width: 100%" max-height="300px" border show-overflow-tooltip="false" @row-click="getTableData">
			<el-table-column width="50">
				<template slot-scope="scope">
					<el-radio v-model="radio" :label="scope.row.id"></el-radio>
				</template>
			</el-table-column>
			<el-table-column prop="table_name" label="表单名称" width="120">
			</el-table-column>
			<el-table-column prop="describe" label="说明" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="操作" width="120">
				<template slot-scope="scope">
					<el-button @click.stop="handleClick(scope.row)" type="text" size="small">查看表单</el-button>
				</template>
			</el-table-column>
		</el-table>
		<h4>选择要使用的打印模板样式</h4>
		<el-table :data="print" style="width: 100%" max-height="300px" border show-overflow-tooltip="false" @row-click="getTableDataPrint" v-if="mmp">
			<el-table-column width="50">
				<template slot-scope="scope">
					<el-radio v-model="radio2" :label="scope.row.id"></el-radio>
				</template>
			</el-table-column>
			<el-table-column prop="print_name" label="表单名称" width="120">
			</el-table-column>
			<el-table-column prop="describe" label="说明" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="操作" width="120">
				<template slot-scope="scope">
					<el-button @click.stop="handleClickPrint(scope.row)" type="text" size="small">查看模板</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 预览表单 -->
		<el-dialog class="xzry" title="预览表单" :visible.sync="previewForm" v-loading="previewLoading" center :fullscreen="true">
			<div class="phone">
				<div class="phone-within">
					<subassemblyElement v-for="(item, index) in formDesignData" :key="index" :information="item"
					:parentData.sync="formDesignData" :parentIndex="index"></subassemblyElement>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="previewForm = false">关 闭</el-button>
			</span>
		</el-dialog>
		<!-- 预览打印 -->
		<el-dialog class="xzry" title="预览打印" :visible.sync="previewPrint" v-loading="printLoading" center :fullscreen="true">
			<print-content v-if="printFlag" :printHtml="printHtml" :printData="printData"></print-content>
			<span slot="footer" class="dialog-footer">
				<el-button @click="previewPrint = false">关 闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import Vue from 'vue';
	import subassemblyElement from './Element.vue';
	export default {
		props:{
			fromData:{
				type: Array
			},
			enableForm:{
				type: String
			},
			enableTemplate:{
				type: String
			},
		},
		components:{
			subassemblyElement,
			'print-content': {
				props: {
					printHtml: String,
					printData: Object,
				},
				render(h){
					let that = this;
					const com = Vue.extend({
						data() {
							return {
								printData: that.printData
							}
						},
						template: `<div>${this.printHtml}</div>`
					});
					return h(com, {});
				}
			}
		},
		data() {
			return {
				radio: "", //单选的值
				radio2: "", //单选的值
				print: [],
				mmp:true,
				previewForm: false,
				previewPrint: false,
				previewLoading: false,
				printLoading: false,
				printFlag: false,
				formDesignData: [],
				printData: {
					xiangmumingcheng: '123'
				},
				printHtml: '',
			}
		},
		methods: {
			handleClick(row) {// 点击打开预览表单
				let that = this;
				that.$set(that, 'previewForm', true);
				that.previewLoading = true;
				this.$axios.post('/api/flow/formView?table_id='+row.id).then(res => {
					// console.log(res.data.data);
					if(res.data.code === 1){
						that.$set(that, 'formDesignData', res.data.data)
					}else{
						that.overdueOperation(res.data.code, res.data.msg);
					}
					that.previewLoading = false;
				}).catch(err => {
					// console.log(err);
					that.previewLoading = false;
				});
			},
			getTableData(event) {// 点击为表单模板的参数赋值
				// console.log(event);
				this.print = event.print;
				this.radio = event.id;
				this.$emit('update:enableForm', event.id);
			},
			getTableDataPrint(event) {// 点击为打印模板的参数赋值
				// console.log(event);
				this.radio2 = event.id;
				this.$emit('update:enableTemplate', event.id);
			},
			handleClickPrint(row) {// 点击打开预览打印模板
				let that = this;
				that.$set(that, 'previewPrint', true);
				that.printLoading = true;
				this.$axios.post('/api/flow/templateView?id='+row.id).then(res => {
					if(res.data.code === 1){
						// console.log(res.data.data);
						that.getSelected(res.data.data.main);
					}else{
						that.overdueOperation(res.data.code, res.data.msg);
					}
					that.printLoading = false;
				}).catch(err => {
					// console.log(err);
					that.printLoading = false;
				});
			},
			getSelected(html) { // 获取表单表格选中的数据的组件数据
				let that = this;
				let arr = this.fromData.filter((s) => {
					return s.id == this.radio;
				});
				// console.log(arr);
				let field = arr[0].field;
				field.length && field.map((item) => {
					that.$set(that.printData, item.field_sign, item.value ? item.value : '暂无数据');
				});
				that.$set(that, 'printFlag', true);
				that.$set(that, 'printHtml', html);
			},
		},
		watch:{
			fromData:{
				handler (val) {
					if(this.radio && val){
						var that = this;
						var obj = {}
						obj = val.filter(item => item.id===that.radio);
						this.print = obj.length ? obj[0].print : [];
					}
				},
				deep: true,
				immediate:true,//关键
			},
			enableForm:{
				handler (val) {
					if(val){
						this.radio = val;
						var that = this;
						var obj = {};
						obj = this.fromData.filter(item => item.id === that.radio);
						obj.length && (that.print = obj[0].print);
					}
				},
				deep: true,
				immediate:true,//关键
			},
			enableTemplate:{
				handler (val) {
					if(val){
						this.radio2 = val;
					}
				},
				deep: true,
				immediate:true,//关键
			},
		}
	}
</script>

<style lang="less">
	.el-table {
		.el-radio {
			margin-left: 6px;
		}

		.el-radio .el-radio__label {
			display: none;
		}

		thead {
			tr {
				th {
					background-color: rgba(242, 242, 242, 1);
					text-align: center;
				}
			}
		}
		tbody{
			td{
				text-align: center;
			}
		}
	}
	.formandprint{
		.el-dialog__body{
			height: calc(100% - 144px);
			text-align: center;
			.phone {
				display: inline-block;
				width: 100%;
				height: 100%;
				width: 400px;
				box-shadow: #666 0px 0px 10px;
				border-radius: 20px;
				padding: 14px;
				box-sizing: border-box;
				text-align: left;
				.phone-within {
					width: 100%;
					height: 100%;
					background-color: rgba(242, 244, 245, 1);
					border-radius: 20px;
					padding-top: 15px;
					position: relative;
					box-sizing: border-box;
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
				}
			}
			table{
				display: table;
				vertical-align: middle;
				border-color: inherit;
				border-collapse: collapse;
				width:100%;
				tr{
					display: table-row;
					vertical-align: inherit;
					border-color: inherit;
					td{
						padding: 5px 10px;
						border: 1px solid #DDD;
					}
					
				}
			}
		}
	}
</style>
