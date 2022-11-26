<template>
	<div id="outerBox">
		<Header :username="userInfo.username"/>
		<Middle :uid="userInfo.uid"/>
	</div>
</template>

<script setup>
	import Header from '@/components/header.vue'
	import Middle from './components/middle.vue'
	import {reactive,ref,onMounted,computed } from 'vue'
	import { useStore } from 'vuex';
	
	const store = useStore();
	const userInfo = computed(() => store.state.user.userInfo)
</script>

<style scoped>
	#outerBox{
		width: 100%;
		height: 650px;
		background-color: aliceblue;
	}
</style>