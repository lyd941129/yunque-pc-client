<!-- 续费管理 -->
<template>
    <div class="personnelmanagement">
        续费管理
    </div>
</template>


<script>

export default {
    props: {

    },
    components: {
        
    },
    computed: {

    },
    data(){
        return {
            // 列表查询数据
            searchLists: {
                dict_type: "", // 查询的类型
                page: 1,
                page_size: 15,
                dict_label: "", // 查询的值
            },

        }
    },
    methods: {
        searchFn(){
            
        }
    },
    mounted(){
        this.searchFn()
    }
}
</script>

<style scoped lang="less">
	.personnelmanagement{
		height: 100%;
		.table-box {
			height: calc(100% - 104px);
            margin-top: 20px;
		}
		.el-pagination{
			text-align: center;
			margin-top: 10px;
			.el-pagination__sizes{
				display: none;
			}
		}
	}
</style>