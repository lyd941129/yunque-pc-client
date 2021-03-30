<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style lang="less">
	@width100: 100%;
	@height100: 100%;
	html {
		width: @width100;
		height: @height100;
		overflow: hidden;
	}
	body{
		width: @width100;
		height: @height100;
		margin: 0;
		font-size: 14px;
		font-family: -apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
		font-variant: tabular-nums;
		line-height: 1.5;
		background-color: #fff;
		-webkit-font-feature-settings: "tnum";
		font-feature-settings: "tnum";
	}
	*{
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	i{
		font-style: normal;
	}
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		width: @width100;
		height: @height100;
		overflow: auto;
		background-color: #f5f5f7;
	}
</style>
