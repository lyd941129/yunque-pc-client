import Vue from 'vue'
import VueRouter from 'vue-router'
import Flow from '../views/Flow.vue'

Vue.use(VueRouter)

const routes = [
	{//	登录路由
		path: "/Log",
		name: "Log",
		meta: {
			title: '登录'
		},
		component: () => import("../views/Log.vue"),
	},
	{// 流程设计路径
		path: '/Flow',
		name: 'Flow',
		component: Flow
	},
	{
		path: '/',
		name: 'Index',
		meta: {
			title: '云雀客户后台'
		},
		component: () => import( /* webpackChunkName: "about" */ '../views/Index.vue')
	}
]

const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
	window.document.title = to.meta.title == undefined ? '云雀客户后台' : to.meta.title
	next();
})

export default router
