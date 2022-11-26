<template>
	<el-table :data="tableData" style="width: 100%">
		<el-table-column lable="选择" prop="status" width="55">
			<template #default="scope">
				<el-checkbox @change="checkOne" v-model="scope.row.status" size="large" style="margin-left: 10px;" />
			</template>
		</el-table-column>
		<el-table-column type="index" align="center" label="序号" />
		<el-table-column label="图书名" prop="book.bname" align="center" />
		<el-table-column label="作者" prop="book.author" align="center" />

		<el-table-column label="图片" prop="book.image" align="center">
			<template #default="scope">
				<img :src="scope.row.book.image" width="90" />
			</template>
		</el-table-column>

		<el-table-column label="单价" prop="book.price" align="center" />
		<el-table-column align="center" label="数量" prop="count">
			<template #default="scope">
				<el-input-number v-model="scope.row.count" :min="1" :max="10" size="small" />
			</template>
		</el-table-column>

		<el-table-column align="center" label="小计">
			<template #default="scope">
				{{ (scope.row.book.price*scope.row.count).toFixed(2) }}
			</template>
		</el-table-column>
	</el-table>
	<el-checkbox v-model="checkedOne" @click="checkedAll" label="全选" size="large" style="margin-left: 21px" />
	<span style="margin-left: 82%;font-size: 20px">总计 {{ totalPrice }} 元</span><br />
	<el-button @click="removeGoods" style="margin-left: 20px;" type="danger" size="large">删除</el-button>
	<el-button @click="updataGoods" style="margin-left: 20px;" type="warning" size="large">暂时保存</el-button>
	<el-button @click="buyGoods" style="margin-left: 72%;" type="primary" size="large">购买</el-button>

</template>

<script setup>
	import { ref,reactive,computed,onMounted } from 'vue'
	import request from '@/api/request.js'
	import { ElMessage } from 'element-plus'
	import { useRouter } from 'vue-router'

	onMounted(() => {
		getPage()
	})

	//路由功能
	const router = useRouter()
	//父传子
	const props = defineProps(['uid'])

	//计算总价格
	const totalPrice = ref()
	totalPrice.value = computed(() => {
		let total = 0
		for (var i = 0; i < tableData.value.length; i++) {
			if (tableData.value[i].status) {
				total += (tableData.value[i].book.price * tableData.value[i].count)
			}
		}
		return parseInt(total.toFixed(2))
	})

	//获取购物车列表
	const tableData = ref([])
	const getPage = async () => {
		await request.get({
			url: `/cart/${props.uid}`
		}).then(res => {
			tableData.value = null
			tableData.value = res.data.records
			tableData.value.status = false;
		})
	}
	//全选框的值
	const checkedOne = ref(false)

	//全选功能
	const checkedAll = () => {
		for (var i = 0; i < tableData.value.length; i++) {
			tableData.value[i].status = !checkedOne.value
		}
	}

	//校验全选框
	const checkOne = (value) => {
		let flag = false
		for (var i = 0; i < tableData.value.length; i++) {
			if (tableData.value[i].status == true) {
				flag = true
			} else {
				flag = false
				break
			}
		}
		if (tableData.value.length == 0) flag = false
		checkedOne.value = flag
	}

	//计算所选择的商品
	const checkGoodsData = ref([])
	const computedGoodsData = (isAll) => {
		if (isAll) {
			for (var i = 0; i < tableData.value.length; i++) {
				const checkGoodData = reactive({
					caid: '',
					bid: '',
					count: '',
					uid: '',
				})
				checkGoodData.caid = tableData.value[i].caid
				checkGoodData.bid = tableData.value[i].bid
				checkGoodData.count = tableData.value[i].count
				checkGoodData.uid = tableData.value[i].uid
				checkGoodsData.value.push(checkGoodData)
			}
		} else {
			for (var i = 0; i < tableData.value.length; i++) {
				if (tableData.value[i].status == true) {
					const checkGoodData = reactive({
						caid: '',
						bid: '',
						count: '',
						uid: '',
					})
					checkGoodData.caid = tableData.value[i].caid
					checkGoodData.bid = tableData.value[i].bid
					checkGoodData.count = tableData.value[i].count
					checkGoodData.uid = tableData.value[i].uid
					checkGoodsData.value.push(checkGoodData)
				}
			}
		}

	}
	//删除所选商品
	const removeGoods = async () => {
		//检测是否有商品
		if (tableData.value.length == 0) {
			ElMessage.error("购物车为空!")
			return
		}
		//保存选择的商品数组
		computedGoodsData()
		if (checkGoodsData.value.length == 0) {
			ElMessage.error("您未选择商品")
			return
		}
		//ajax
		await request.post({
			url: '/cart/remove',
			data: JSON.stringify(checkGoodsData.value)
		}).then((res) => {
			if (res.flag == true) {
				ElMessage.success("删除成功!")
			} else {
				ElMessage.error("删除失败!")
			}
		})
		checkGoodsData.value = []
		getPage()

	}


	//更新所选中的商品
	const updataGoods = async () => {
		//检测是否有商品
		if (tableData.value.length == 0) {
			ElMessage.error("购物车为空!")
			return
		}
		//保存选择的商品数组(使用全选保存)
		computedGoodsData(true)
		//ajax
		await request.post({
			url: '/cart/update',
			data: JSON.stringify(checkGoodsData.value)
		}).then((res) => {
			if (res.flag == true) {
				ElMessage.success("保存成功!")
			} else {
				ElMessage.error("保存失败!")
			}
		})
		checkGoodsData.value = []
		getPage()
	}

	//提交所选商品的订单
	const buyGoods = async() => {
		//检测是否有商品
		if (tableData.value.length == 0) {
			ElMessage.error("购物车为空!")
			return
		}
		//保存选择的商品数组
		computedGoodsData()
		//检测是否选择了商品
		if (checkGoodsData.value.length == 0) {
			ElMessage.error("您未选择商品")
			return
		}
		if(!confirm("是否确认购买")){
			return 
		}
		//ajax
		await request.post({
			url: '/cart/cartToOrder',
			data: JSON.stringify(checkGoodsData.value)
		}).then((res) => {
			if (res.flag == true) {
				ElMessage.success("即将生成订单!")
				router.push({ name: 'pay', params: { oid: res.data.oid } })
			} else {
				ElMessage.error("订单生成失败!")
			}
		})
		checkGoodsData.value = []
		getPage()
	}
</script>

<style>

</style>
