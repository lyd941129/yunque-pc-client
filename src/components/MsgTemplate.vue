<!-- 查询列表消息推送模板组件 -->
<template>
	<div class="msgtemplate">
		<h4>主标题配置</h4>
		<el-select slot="prepend" v-model="advocate" placeholder="请选择">
			<el-option v-for="(item, index) in selectData" :key="index" :label="item.title" :value="item.id"></el-option>
		</el-select>
		<el-button type="primary" slot="append" @click="addTitleAdvocate(advocate)">选择</el-button>
		<el-input type="textarea" v-model="templateData.field_main_show" @change="textareaChange(templateData.field_main_show, '1')" :autosize="{minRows: 6}"></el-input>
		<h4>副标题配置</h4>
		<el-select slot="prepend" v-model="assistant" placeholder="请选择">
			<el-option v-for="(item, index) in selectData" :key="index" :label="item.title" :value="item.id"></el-option>
		</el-select>
		<el-button type="primary" slot="append" @click="addTitleAssistant(assistant)">选择</el-button>
		<el-input type="textarea" v-model="templateData.field_vice_show" @change="textareaChange(templateData.field_vice_show)" :autosize="{minRows: 6}"></el-input>
		<div v-if="searchJudge==='yes'">
			<h4>搜索配置</h4>
			<el-select slot="prepend" v-model="search" placeholder="请选择">
				<el-option v-for="(item, index) in selectData" :key="index" :label="item.title" :value="item.id"></el-option>
			</el-select>
			<el-button type="primary" slot="append" @click="addSearch(search)">选择</el-button>
			<div class="search-span-box">
				<el-tag v-for="item in searchData" :key="item.field_id" @close="handleClose(item)" closable>
					{{item.field_name}}
				</el-tag>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			templateData: {
			},
			searchData: {
				type: Array
			},
			searchJudge: {
				type: String
			},
			selectData: {
				type: Array
			}
		},
		data() {
			return {
				advocate: '',
				assistant: '',
				search: '',
				searchList: [
					{
						id: '1',
						lable: '资金用途'
					},
					{
						id: '2',
						lable: '编号'
					},
					{
						id: '3',
						lable: '使用部门'
					}
				],
				searchSelect: [
					{
						id: '5',
						lable: '发起人'
					},
					{
						id: '6',
						lable: '单据编号'
					},
					{
						id: '7',
						lable: '发起时间'
					}
				]
			}
		},
		methods: {
			addTitleAdvocate(val) {// field_main_title
				var obj = {};
				var that = this;
				this.templateData.field_main = []
				obj = this.selectData.filter(item => item.id===val);
				!this.templateData.field_main && (this.templateData.field_main = []);
				!this.templateData.field_main_show && (this.templateData.field_main_show = '');
				!this.templateData.field_main_title && (this.templateData.field_main_title = '');
				// this.templateData.field_main.push(obj[0].id);
				this.templateData.field_main_show += ` #${obj[0].title}# `;
				this.templateData.field_main_show = this.templateData.field_main_show.replace(/(^\s*)|(\s*$)/g, "");
				let title = this.templateData.field_main_show.split('#');
				let show = '';
				title && title.length && title.map((item) => {
					let titleObj = [];
					titleObj = that.selectData.filter(se => se.title===item);
					titleObj.length ? (show += `#${titleObj[0].id}#`) : (item ? (show+= ` ${item.replace(/(^\s*)|(\s*$)/g, "")} `) : '');
					titleObj.length && that.templateData.field_main.push(titleObj[0].id);
				});
				this.templateData.field_main_title = show;
				// console.log(this.templateData)
				this.$emit('update:templateData', this.templateData);
			},
			addTitleAssistant(val) {
				var obj = {};
				var that = this;
				this.templateData.field_vice = [];
				obj = this.selectData.filter(item => item.id===val);
				!this.templateData.field_vice && (this.templateData.field_vice = []);
				!this.templateData.field_vice_show && (this.templateData.field_vice_show = '');
				!this.templateData.field_vice_title && (this.templateData.field_vice_title = '');
				// this.templateData.field_vice.push(obj[0].id);
				this.templateData.field_vice_show += ` #${obj[0].title}# `;
				this.templateData.field_vice_show = this.templateData.field_vice_show.replace(/(^\s*)|(\s*$)/g, "");
				let title = this.templateData.field_vice_show.split('#');
				let show = '';
				title && title.length && title.map((item) => {
					let titleObj = [];
					titleObj = that.selectData.filter(se => se.title===item);
					titleObj.length ? (show += `#${titleObj[0].id}#`) : (item ? (show+= ` ${item.replace(/(^\s*)|(\s*$)/g, "")} `) : '');
					titleObj.length && that.templateData.field_vice.push(titleObj[0].id);
				});
				this.templateData.field_vice_title = show;
				this.$emit('update:templateData', this.templateData);
			},
			addSearch(search) {
				var obj = {}
				obj = this.selectData.filter(item => item.id===search);
				//obj 就是被选中的那个对象，也就能拿到label值了。
				obj.length && this.searchData.push({
					field_id: obj[0].id,
					field_name: obj[0].title,
				});
				// console.log(search);
				// console.log(obj);
			},
			handleClose(tag) {
				this.searchData.splice(this.searchData.indexOf(tag), 1);
			},
			textareaChange(data, type){
				var that = this;
				let title = data.split('#');
				let show = '';
				type === '1' ? (this.templateData.field_main = []) : (this.templateData.field_vice = []);
				title.length && title.map((item) => {
					let titleObj = [];
					titleObj = that.selectData.filter(se => se.title===item);
					titleObj.length ? (show += `#${titleObj[0].id}#`) : (item ? (show+= ` ${item.replace(/(^\s*)|(\s*$)/g, "")} `) : '');
					if(titleObj.length){
						type === '1' ? (that.templateData.field_main.push(titleObj[0].id)) : (that.templateData.field_vice.push(titleObj[0].id));
					}
				});
				type === '1' ? (this.templateData.field_main_title = show) : (this.templateData.field_vice_title = show);
				this.$emit('update:templateData', this.templateData);
			},
		}
	}
</script>

<style lang="less" scoped>
	.search-span-box {
		padding: 20px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		min-height: 138px;

		span {
			margin: 0px 10px 10px 0;
		}
	}
</style>
