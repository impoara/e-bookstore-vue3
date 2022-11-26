<template>
	<!-- 商品表格 -->
	<el-table :data="tableData" style="width: 100%" >
		<el-table-column label="图书名" prop="book.bname" align="center" />
		<el-table-column label="作者" prop="book.author" align="center" />

		<el-table-column label="图片" prop="book.image" align="center">
			<template #default="scope">
				<img :src="scope.row.book.image" width="40" />
			</template>
		</el-table-column>

		<el-table-column  label="数量" prop="count" align="center"/>
		
		<el-table-column prop="subtotal" label="小计" align="center">
			<template #default="scope">
				{{scope.row.subtotal}} 元
			</template>
		</el-table-column>
	</el-table>
	
	<!-- 支付表单 -->
	<el-form :model="formData" label-width="120px" style="margin-top: 20px; margin-left: 25%">
		<el-form-item label="订单编号">
		      <el-input v-model="formData.oid" style="width:280px" disabled/>
		</el-form-item>
		<el-form-item label="订单时间">
		      <el-input v-model="formData.ordertime" style="width:280px" disabled/>
		</el-form-item>
		<el-form-item label="收件人">
		      <el-input v-model="formData.username" style="width:280px" disabled/>
		</el-form-item>
		<el-form-item label="联系人电话" prop="address">
		      <el-input v-model="formData.phone" placeholder="手机号" style="width:280px"/>
		</el-form-item>
		<el-form-item label="收货地址" prop="address">
		      <el-input v-model="formData.address" placeholder="收货地址" style="width:500px"/>
		</el-form-item>
		<el-form-item label="总价格:">
			<span style="font-size: 20px">{{formData.total}} 元</span>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="paySubmit" style="margin-left: 150px;">支付订单</el-button>
		</el-form-item>
	</el-form>
	
</template>

<script setup>
	import {ref,reactive,computed,onMounted} from 'vue'
	import request from '@/api/request.js'
	import {ElMessage} from 'element-plus'
	import { useRouter,useRoute } from 'vue-router'
	
	onMounted(() => {
		oid.value = route.params.oid
		getOrderItemList()
	})
	
	//路由功能
	const router = useRouter()
	 const route = useRoute()
	 
	//oid
	const oid = ref('')
	//列表数据
	const tableData = ref([])
	const formData = reactive({
		address: '',
		oid: '',
		ordertime: '',
		state: '',
		total: '',
		uid: '',
		username: '',
		phone: ''
	})
	//获取数据
	const getOrderItemList = async () => {
		await request.get({
			url: `/orders/${oid.value}`
		}).then(res => {
			console.log(res.data)
			//表格数据
			tableData.value = res.data.orderitemList
			//表单
			formData.phone = res.data.orders.phone
			formData.address = res.data.orders.address
			formData.total = res.data.orders.total
			formData.oid = res.data.orders.oid
			formData.ordertime = res.data.orders.ordertime
			formData.state = res.data.orders.state
			formData.uid = res.data.orders.uid
			formData.username = res.data.orders.username
		})
	}
	
	const paySubmit = async () => {
		if(formData.address == null||formData.address == ""){
			ElMessage.error("收货地址不能为空!")
			return 
		}
		await request.post({
			url: `/orders/pay`,
			data: formData
		}).then(res => {
			request.get({
				url: `/orders/pay/${formData.oid}`,
				data: formData
			}).then(res => {
				if(res.flag == true){
					if(res.data.state != 0){
						ElMessage.success("支付成功! 正在跳转...")
						setTimeout(()=>{
							router.push({ name: 'home',})
						},700)
					}else{
						ElMessage.error("支付失败,请重新稍后再试!")
						router.push({ name: 'pay', params: { oid: formData.oid } })
					}
				}else {
					ElMessage.error("服务器异常!")
				}
			})
		})
	}

</script>

<style>

</style>
