// 一些公共的方法可以抽离放到这里
import Vue from 'vue';

Vue.mixin({
	created() {
		let protocol = window.location.protocol; //协议
		let host = window.location.host; //主机
		let reg = /^localhost+/;
		if (reg.test(host)) {
			//若本地项目调试使用
			this.allUrl = 'http://192.168.66.36:9501';
			this.imgHttp  = 'http://192.168.66.36:9501' ;
		} else {
			//动态请求地址             协议               主机
			this.allUrl  = protocol + "//" + host ;
			this.imgHttp  = protocol + "//" + 'yqadmin.taozizi.cn' ;
		}
		// if(localStorage.getItem('tokenTime') == null && window.location.hash != "#/log"){
		// 	this.$router.push('/log');
		// }
		this.loginData = localStorage.getItem("loginDatac") ? JSON.parse(localStorage.getItem("loginDatac")) : null;
	},
	data(){
		return {
			allUrl: 'http://192.168.66.36:9501',
			imgHttp: 'http://192.168.66.36:9501',
			loginData: null,
		}
	},
	methods:{
		overdueOperation(code, msg){// 处理服务器端返回的问题
			let that = this;
			if(code === 2001){
				that.$message({
					message: '登录过期了请重新登录！',
					type: 'error'
				});
				setTimeout(function(){
					that.$router.push('/log');
					localStorage.setItem("loginDatac", "");
					localStorage.clear();
				}, 1000)
			}else{
				that.$message({
					message: msg,
					type: 'error'
				});
			}
		}
	}
});