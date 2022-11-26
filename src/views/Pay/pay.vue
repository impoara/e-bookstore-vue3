<template>
	<Header :username="userInfo.username"/>
	<Middle/>
</template>

<script setup>
	import Header from '@/components/header.vue'
	import Middle from './components/middle.vue'
	import {reactive,ref,onMounted,computed } from 'vue'
	import { useStore } from 'vuex'
	import request from '@/api/request.js'
	
	const store = useStore();
	const userInfo = computed(() => store.state.user.userInfo)
	
	
</script>

<style>
</style>