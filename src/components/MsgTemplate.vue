<!-- 查询列表消息推送模板组件 -->
<template>
	<div class="msgtemplate">
		<!-- 主标题 -->
		<div class="two-parts">
			<div class="two-parts-item" v-if="templateData.list_type=='list_shop' && searchJudge==='yes'">
				<h4>图片配置</h4>
				<div class="attachment-configuration">
					<el-select slot="prepend" v-model="aConfiguration" placeholder="请选择" @change="addAttachmentConfiguration(aConfiguration, 'field_url')">
						<el-option v-for="(item, index) in onlyPictures(selectData)" :key="index" :label="item.title" :value="item.id"></el-option>
					</el-select>
				</div>
			</div>
			<div class="two-parts-item" v-if="templateData.list_type=='list_down' && searchJudge==='yes'">
				<h4>附件配置</h4>
				<div class="attachment-configuration">
					<el-select slot="prepend" v-model="aConfiguration" placeholder="请选择" @change="addAttachmentConfiguration(aConfiguration, 'field_url')">
						<el-option v-for="(item, index) in onlyPictures(selectData, 'no')" :key="index" :label="item.title" :value="item.id"></el-option>
					</el-select>
				</div>
			</div>
			<div class="two-parts-item">
				<h4>主标题配置</h4>
				<el-select slot="prepend" v-model="advocate" placeholder="请选择">
					<el-option v-for="(item, index) in selectData" :key="index" :label="item.title" :value="item.id"></el-option>
				</el-select>
				<el-button type="primary" slot="append" @click="addTitleAdvocate(advocate)">选择</el-button>
				<el-input type="textarea" v-model="templateData.field_main_show" @change="textareaChange(templateData.field_main_show, '1')" :autosize="{minRows: 6}"></el-input>
			</div>
		</div>
		<!-- 图片配置 -->
		<div v-if="templateData.list_type=='list_img' && searchJudge==='yes'">
			<h4>图片配置</h4>
			<el-select slot="prepend" v-model="pConfiguration" placeholder="请选择">
				<el-option v-for="(item, index) in onlyPictures(selectData)" :key="index" :label="item.title" :value="item"></el-option>
			</el-select>
			<el-button type="primary" slot="append" @click="addPictureConfiguration(pConfiguration)">选择</el-button>
			<div class="picture-configuration">
				<transition name="el-fade-in-linear">
					<div class="picture-configuration-item" v-for="(item, index) in templateData.field_url" :key="item.id">{{item.title}} <i class="el-icon-close" @click="delePictureConfiguration(index)"></i></div>
				</transition>
			</div>
		</div>
		<!-- 副标题 -->
		<div v-if="templateData.list_type !== 'list_text' && searchJudge==='yes'">
			<h4>副标题配置（一列显示）</h4>
			<el-select slot="prepend" v-model="assistanttow" placeholder="请选择">
				<el-option v-for="(item, index) in selectData" :key="index" :label="item.title" :value="item.id"></el-option>
			</el-select>
			<el-button type="primary" slot="append" @click="addTitleAssistant(assistanttow, 'field_content', 'field_content_show', 'field_content_title')">选择</el-button>
			<el-input type="textarea" v-model="templateData.field_content_show" @change="textareaChange(templateData.field_content_show, '2')" :autosize="{minRows: 6}"></el-input>
		</div>
		<!-- 副标题（两列显示） -->
		<h4>{{searchJudge==='yes' ? '副标题配置（两列显示）' : '副标题配置'}}</h4>
		<el-select slot="prepend" v-model="assistant" placeholder="请选择">
			<el-option v-for="(item, index) in selectData" :key="index" :label="item.title" :value="item.id"></el-option>
		</el-select>
		<el-button type="primary" slot="append" @click="addTitleAssistant(assistant, 'field_vice', 'field_vice_show', 'field_vice_title')">选择</el-button>
		<el-input type="textarea" v-model="templateData.field_vice_show" @change="textareaChange(templateData.field_vice_show)" :autosize="{minRows: 6}"></el-input>
		<!-- 搜索配置 -->
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
			searchData: {},
			searchJudge: {
				type: String
			},
			selectData: {}
		},
		computed:{
			onlyPictures: function(){
				return function(val, type){
					let arr = (val && val.length) ? (val.filter((e) => {
						return e.element === 'File';
					})) : [];
					return arr;
				}
			}
		},
		data() {
			return {
				advocate: '',
				pConfiguration: '',
				aConfiguration: '',
				assistant: '',
				assistanttow: '',
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
				],
			}
		},
		created() {
			this.$set(this, 'aConfiguration', this.templateData.field_url);
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
				this.$forceUpdate();
			},
			addTitleAssistant(val, main, show, title) {
				var obj = {};
				var that = this;
				this.templateData[main] = [];
				obj = this.selectData.filter(item => item.id===val);
				!this.templateData[main] && (this.templateData[main] = []);
				!this.templateData[show] && (this.templateData[show] = '');
				!this.templateData[title] && (this.templateData[title] = '');
				// this.templateData.field_vice.push(obj[0].id);
				this.templateData[show] += ` #${obj[0].title}# `;
				this.templateData[show] = this.templateData[show].replace(/(^\s*)|(\s*$)/g, "");
				let titleArr = this.templateData[show].split('#');
				let showText = '';
				titleArr && titleArr.length && titleArr.map((item) => {
					let titleObj = [];
					titleObj = that.selectData.filter(se => se.title===item);
					titleObj.length ? (showText += `#${titleObj[0].id}#`) : (item ? (showText+= ` ${item.replace(/(^\s*)|(\s*$)/g, "")} `) : '');
					titleObj.length && that.templateData[main].push(titleObj[0].id);
				});
				this.templateData[title] = showText;
				this.$emit('update:templateData', this.templateData);
				this.$forceUpdate();
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
				if(type === '1'){
					this.templateData.field_main = [];
				}else if(type === '2'){
					this.templateData.field_content = [];
				}else {
					this.templateData.field_vice = [];
				}
				// type === '1' ? (this.templateData.field_main = []) : (this.templateData.field_vice = []);
				title.length && title.map((item) => {
					let titleObj = [];
					titleObj = that.selectData.filter(se => se.title===item);
					titleObj.length ? (show += `#${titleObj[0].id}#`) : (item ? (show+= ` ${item.replace(/(^\s*)|(\s*$)/g, "")} `) : '');
					if(titleObj.length){
						if(type === '1'){
							that.templateData.field_main.push(titleObj[0].id)
						}else if(type === '2'){
							that.templateData.field_content.push(titleObj[0].id)
						}else {
							that.templateData.field_vice.push(titleObj[0].id)
						}
						// type === '1' ? (that.templateData.field_main.push(titleObj[0].id)) : (that.templateData.field_vice.push(titleObj[0].id));
					}
				});
				if(type === '1'){
					this.templateData.field_main_title = show;
				}else if(type === '2'){
					this.templateData.field_content_title = show;
				}else {
					this.templateData.field_vice_title = show
				}
				// type === '1' ? (this.templateData.field_main_title = show) : (this.templateData.field_vice_title = show);
				this.$emit('update:templateData', this.templateData);
			},
			addPictureConfiguration(val){// 添加图片配置
				let arr = this.templateData.field_url.filter((e) => {
					return val.id == e.id
				});
				if(arr.length){
					this.$message.error('已存在该字段！');
					return
				}
				this.templateData.field_url.push({
					id: val.id,
					title: val.title
				});
				this.$emit('update:templateData', this.templateData);
				this.$forceUpdate();
			},
			delePictureConfiguration(index){// 删除图片配置
				this.templateData.field_url.splice(index, 1);
				this.$emit('update:templateData', this.templateData);
				this.$forceUpdate();
			},
			addAttachmentConfiguration(val, objname){
				this.templateData[objname] = val;
				this.$emit('update:templateData', this.templateData);
				this.$forceUpdate();
			},
		}
	}
</script>

<style lang="less" scoped>
	.msgtemplate{
		padding-right: 10px;
	}
	.two-parts{
		display: flex;
		.two-parts-item{
			flex: 2;
			&:nth-child(2){
				flex: 3;
			}
			.attachment-configuration{
				height: calc(100% - 58px);
				border: 1px solid #DCDFE6;
				border-radius: 4px;
				margin-right: 20px;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.picture-configuration{
		min-height: 126px;
		width: 100%;
		border: 1px solid #DCDFE6;
		border-radius: 4px;
		display: flex;
		flex-wrap: wrap;
		.picture-configuration-item{
			width: 100px;
			height: 100px;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 1px solid #dceeff;
			color: #1890FF;
			background-color: #ECF5FF;
			margin: 10px;
			position: relative;
			i{
				transition: .3s all;
				position: absolute;
				top: 4px;
				right: 4px;
				&:hover{
					cursor: pointer;
					opacity: 0.5;
				}
			}
		}
	}
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
