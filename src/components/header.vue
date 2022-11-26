<template>
	<div id="topbox">
		<div id="titlebox"><span id="title">天天书店</span></div>
		<div id="label_nav">
			<el-breadcrumb separator="|">
				<el-breadcrumb-item :to="{ path: '#' }">{{username}}</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/cart' }" v-show="isLogin">购物车</el-breadcrumb-item>
				<el-breadcrumb-item :to="{ path: '/orders' }" v-show="isLogin">订单</el-breadcrumb-item>
				<el-breadcrumb-item v-show="isLogin" @click="Logout">退出登录</el-breadcrumb-item>
				<el-breadcrumb-item v-show="!isLogin" :to="{ path: '/login' }">前往登录</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	</div>
</template>

<script setup>
	import { ref,computed } from 'vue'
	import { useStore } from 'vuex'
	import { useRouter,useRoute } from 'vue-router'
	import {ElMessage} from 'element-plus'
	
	//路由功能
	const router = useRouter()
	const route = useRoute()
	//父传子
	const props = defineProps(['username'])
	//仓库
	const store = useStore()
	
	
	const isLogin = ref()
	const username = computed(() => {
		if(props.username != null){
			isLogin.value = true
			return '欢迎用户: '+props.username
		} else{
			isLogin.value = false
			return '您还未登录'
		}
	})
	
	const Logout = () => {
		if(confirm("确认退出吗?")){
			store.dispatch('userLogout')
			if(route.name == 'cart' || route.name == 'pay'){
				router.push('/login')
			}
			ElMessage.info("您已退出登录!")
		}
	}
	
	
</script>

<style scoped>
	#topbox {
		width: 100%;
		height: 110px;
		background-color: beige;
	}

	#titlebox {
		text-align: center;
		line-height: 110px;
	}

	#title {
		color: brown;
		font-size: 70px;
		letter-spacing: 20px;
		font-weight: 900;
		font-family: 楷体;
		text-shadow: 2px 4px 3px rgba(0, 0, 0, 0.1);
	}

	#label_nav {
		position: absolute;
		top: 90px;
		left: 55px;
	}
</style>
