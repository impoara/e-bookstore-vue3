<template>
	<!-- 按条件分页查询 -->
	<el-form :inline="true" class="demo-form-inline" id="selectBox">
		<el-form-item label="订单状态">
			<el-select v-model="orderState" placeholder="默认全部">
				<el-option label="全部" value="" />
				<el-option label="已支付" :value="1" />
				<el-option label="未支付" :value="0" />
			</el-select>
		</el-form-item>
		<el-form-item label="订单日期">
			<el-input v-model="orderTime" placeholder="订单日期" />
		</el-form-item>
	
		<el-form-item>
			<el-button type="primary" @click="onCheck">查询</el-button>
			<el-button type="info" @click="resetCheck">重置</el-button>
		</el-form-item>
	</el-form>
	
	<!-- 订单表格 -->
	<el-table :data="tableData" style="width: 100%" >
		<el-table-column label="订单编号" prop="oid" align="center" />
		<el-table-column label="订单时间" prop="ordertime" align="center" />
		<el-table-column label="收件人" prop="username" align="center" />
		<el-table-column label="联系电话" prop="phone" align="center" />
		<el-table-column label="收件地址" prop="address" align="center" />
		<el-table-column label="订单金额" prop="total" align="center">
			<template #default="scope">
				{{scope.row.total}} 元
			</template>
		</el-table-column>
		<el-table-column label="订单状态" prop="state" align="center">
			<template #default="scope">
				<span v-if="scope.row.state==1" style="color: forestgreen">订单完成</span>
				<span v-if="scope.row.state==0" style="color: red;">订单未支付</span>
			</template>
		</el-table-column>
	</el-table>
	
	<!-- 分页插件 -->
	<div id="pagination_nav">
		<el-pagination class="pagiantion" @current-change="handleCurrentChange" :current-page="pagination.currentPage"
			:page-size="pagination.pageSize" layout="prev, pager, next" :total="pagination.total">
		</el-pagination>
	</div>
</template>

<script setup>
	import {ref,reactive,computed,onMounted} from 'vue'
	import request from '@/api/request.js'
	import {ElMessage} from 'element-plus'
	import { useRouter } from 'vue-router'
	
	
	onMounted(() => {
		getPage()
	})
	//父传子
	const props = defineProps(['uid'])
	//路由功能
	const router = useRouter()
	//分页设置
	const pagination = reactive({
		currentPage: 1, //当前页码
		pageSize: 7, //每页显示的记录数
		total: 0, //总记录数
	})
	//列表数据
	const tableData = ref([])

	//获取数据
	const getPage = async () => {
		
		let param = "?state=" + orderState.value;
		param += "&ordertime=" + orderTime.value;
		
		await request.get({
			url: `/orders/list/${pagination.currentPage}/${pagination.pageSize}/${props.uid}${param}`
		}).then(res => {
			// console.log(res.data)
			//表格数据
			tableData.value = res.data.pages.records
			pagination.currentPage = res.data.pages.current
			pagination.total = res.data.pages.total
		})
	}
	
	//更改页码
	const handleCurrentChange = (current) => {
		pagination.currentPage = current
		getPage()
	}
	
	//查询条件
	const orderState = ref('')
	const orderTime = ref('')
	
	//按条件查询
	const onCheck = () => {
		getPage()
	}
	
	//重置查询条件
	const resetCheck = () => {
		orderState.value = ''
		orderTime.value = ''
	}
	

</script>

<style scoped>
	#selectBox {
		margin-top: 20px;
		margin-left: 50px;
	}
	
	#pagination_nav {
		position: relative;
		margin-top: 10px;
		margin-left: 35%;
	}
</style>
