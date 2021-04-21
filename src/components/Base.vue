<!-- 基础设置组件 -->
<template>
	<div class="base">
		<el-form ref="form" label-width="80px">
			<el-form-item label="应用名称">
				<el-input v-model="baseData.app_name" style="width: 300px;" disabled></el-input>
			</el-form-item>
			<el-form-item label="所属模块">
				<el-input v-model="baseData.app_module" style="width: 300px;" disabled></el-input>
			</el-form-item>
			<el-form-item label="流程标题">
				<el-input v-model="baseData.flow_title" style="width: 300px;"></el-input>
			</el-form-item>
			<el-form-item label="功能介绍">
				<el-input type="textarea" v-model="baseData.describe" style="width: 300px;" disabled></el-input>
			</el-form-item>
			<el-form-item label="是否启用">
				<el-radio-group v-model="baseData.installed">
					<el-radio :label="1">启用</el-radio>
					<el-radio :label="0">不启用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="应用类型">
				<el-radio-group v-model="baseData.app_type">
					<el-radio :label="1">表单</el-radio>
					<el-radio :label="2">表单加流程</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- <el-form-item>
				<el-button type="primary" @click="onSubmit">立即创建</el-button>
				<el-button>取消</el-button>
			</el-form-item> -->
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'BasePage',
		props: {
			baseData:{
				type: Object
			}
		},
		data() {
			return {}
		},
		methods: {}
	}
</script>

<style leng="less" scoped>
	.base{
		padding: 20px;
	}
</style>
