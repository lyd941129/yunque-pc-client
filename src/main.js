import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import store from './store';
import './common/mixin/mixin.js';
import {
	tokenExpressInTime
} from '../static/js/utils.js'


Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
// axios.defaults.baseURL = '';
let protocol = window.location.protocol; //协议
let host = window.location.host; //主机
let reg = /^localhost+/;
if (reg.test(host)) {
	//若本地项目调试使用
	axios.defaults.baseURL = 'http://yqflow.taozizi.cn';
} else {
	//动态请求地址             协议               主机
	axios.defaults.baseURL = protocol + "//" + host;
}
axios.interceptors.request.use(config => {
	// 在发送请求之前做些什么
	if (window.location.hash != "#/log" && localStorage.getItem('tokenTime') == null) {
		router.push('/log');
	}
	if (window.location.hash != "#/log" && tokenExpressInTime() && localStorage.getItem('tokenTime')) {
		router.push('/log');
		// ElementUI({
		// 	type: 'error',
		// 	center: true,
		// 	message: '登录超时请重新登录',
		// 	duration: 2000
		// })
		// setTimeout(() => {
		// 	router.push('/log');
		// 	setTimeout(function() {
		// 		localStorage.clear();
		// 	}, 100);
		// }, 1500)
		return false;
	}
	return config;
}, error => {
	// 对请求错误做些什么
	return Promise.reject(error);
});
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'; //配置请求头信息。


new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
