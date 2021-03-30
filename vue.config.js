module.exports = {
    // 关闭elint,因为引入的富文本插件会报错
    lintOnSave: false,

    devServer: {
		proxy: {
			'/api': {
				target: 'http://yqflow.taozizi.cn', // 请求服务器根路径,这里必须加上 http/https://
				changeOrigin: true, // 是否跨域
				// ws: true, // websocket
				pathRewrite: { // 重写路径: 当检测到请求地址里包含 /v1 时,将此路径进行跨域代理操作
					'^/api': '/api'
				}
			}
		}
	},

    runtimeCompiler: true,
    outputDir: 'client'
}
