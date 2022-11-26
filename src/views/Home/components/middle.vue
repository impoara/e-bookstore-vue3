<template>
	<!-- 按条件分页查询 -->
	<el-form :inline="true" :model="bookInfo" class="demo-form-inline" id="selectBox">
		<el-form-item label="图书种类">
			<el-select v-model="bookInfo.cid" placeholder="默认全部">
				<el-option label="全部" value="" />
				<el-option v-for="(item,index) in bookType" :key="item.cid" :label="item.cname" :value="item.cid" />
			</el-select>
		</el-form-item>
		<el-form-item label="图书名称">
			<el-input v-model="bookInfo.bname" placeholder="图书名称" />
		</el-form-item>
		<el-form-item label="作者">
			<el-input v-model="bookInfo.author" placeholder="作者" />
		</el-form-item>

		<el-form-item>
			<el-button type="primary" @click="onCheck">查询</el-button>
			<el-button type="info" @click="resetCheck">重置</el-button>
		</el-form-item>
	</el-form>

	<!-- 图书列表展示 -->
	<el-table :data="tableData" style="width: 100%" @row-click="test">
		<el-table-column label="图书ID" prop="bid" align="center" width="100" />
		<el-table-column label="图书名" prop="bname" align="center" />
		<el-table-column label="单价" prop="price" align="center" />
		<el-table-column label="作者" prop="author" align="center" />
		<el-table-column label="类别" prop="btype" align="center" />
		<el-table-column label="图片" prop="image" align="center">
			<template #default="scope">
				<img :src="scope.row.image" width="90" />
			</template>
		</el-table-column>

		<el-table-column align="center" label="操作">
			<template #default="scope">
				<el-button size="primary" @click="handleBuy(scope.$index, scope.row)">购买</el-button>
			</template>
		</el-table-column>
	</el-table>

	<!-- 分页插件 -->
	<div id="pagination_nav">
		<el-pagination class="pagiantion" @current-change="handleCurrentChange" :current-page="pagination.currentPage"
			:page-size="pagination.pageSize" layout="prev, pager, next" :total="pagination.total">
		</el-pagination>
	</div>

	<!-- 购买弹窗 -->
	<el-dialog v-model="dialogPayForm" title="订单详情">
		<el-form>
			<el-form-item label="书名" label-width="100px">
				<el-input :value="payFormInfo.bookName" disabled />
			</el-form-item>
			<el-form-item label="作者" label-width="100px">
				<el-input :value="payFormInfo.bookAuthor" disabled />
			</el-form-item>
			<el-form-item label="单价" label-width="100px">
				<el-input :value="payFormInfo.bookPrice"  disabled />
			</el-form-item>
			<el-form-item label="数量" label-width="100px">
				<el-input-number v-model="payFormInfo.bookNum" :min="1" :max="10" @change="handleChange" />
			</el-form-item>
			<el-form-item label="总价" label-width="100px">
				<font size="5">{{ (payFormInfo.bookPrice*payFormInfo.bookNum).toFixed(2) }} ￥</font> 
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancle">取消</el-button>
				<el-button type="primary" @click="addToCart">购买</el-button>
			</span>
		</template>
	</el-dialog>

</template>



<script setup>
	import { ref,reactive,computed,onMounted } from 'vue'
	import request from '@/api/request.js'
	import {ElMessage} from 'element-plus'
	
	const props = defineProps(['uid'])
	//钩子
	onMounted(() => {
		getPage()
		getBookType()
	})

	//查询列表
	const bookType = ref()

	const bookInfo = reactive({
		bname: '',
		author: '',
		cid: '',
	})

	//按条件查询
	const onCheck = () => {
		getPage()
	}
	//重置查询条件
	const resetCheck = () => {
		bookInfo.bname = ''
		bookInfo.author = ''
		bookInfo.cid = ''
	}

	//获取所有图书类型
	const getBookType = () => {
		request.get({
			url: '/books/type'
		}).then(res => {
			bookType.value = res.data
		})
	}

	//图书列表
	const handleBuy = (index, row) => {
		payFormInfo.bookId = row.bid
		payFormInfo.bookName = row.bname
		payFormInfo.bookAuthor = row.author
		payFormInfo.bookPrice = row.price
		dialogPayForm.value = true
	}
	
	
	const tableData = ref()
	const getPage = () => {
		let param = "?cid=" + bookInfo.cid;
		param += "&bname=" + bookInfo.bname;
		param += "&author=" + bookInfo.author;
		// console.log(param)
		request.get({
			url: `/books/${pagination.currentPage}/${pagination.pageSize}${param}`
		}).then(res => {
			tableData.value = null
			tableData.value = res.data.records
			pagination.currentPage = res.data.current
			pagination.total = res.data.total
		})
	}

	//分页设置
	const pagination = reactive({
		currentPage: 1, //当前页码
		pageSize: 4, //每页显示的记录数
		total: 0, //总记录数
	})
	
	//更改页码
	const handleCurrentChange = (current) => {
		pagination.currentPage = current
		getPage()
	}

	//购买弹窗页
	const dialogPayForm = ref(false)
	
	//订单详情
	const payFormInfo = reactive({
		bookId: '',
		bookName: '',
		bookPrice: '',
		bookAuthor: '',
		bookNum: 1,
	})
	
	//更改购买图书数量
	const handleChange = (number) => {
	  payFormInfo.bookNum = number
	  // console.log(payFormInfo)
	}
	
	//取消弹窗页面
	const cancle = () => {
		dialogPayForm.value = false
		payFormInfo.bookId = ''
		payFormInfo.bookName = ''
		payFormInfo.bookAuthor = ''
		payFormInfo.bookPrice = ''
		payFormInfo.bookNum = 1	
	}
	
	//发送信息至购物车
	const addToCart = () => {
		request.post({
			url: '/cart/add',
			data: {
				bid: payFormInfo.bookId,
				count: payFormInfo.bookNum,
				uid: props.uid
			}
		}).then(res => {
			cancle()
			if(res.data.flag){
				ElMessage.success("加入购物车成功!")
			}else{
				ElMessage.error("加入购物车失败!")
			}
		})
	
	}
	

</script>

<style scoped>
	#selectBox {
		margin-top: 20px;
		margin-left: 50px;
	}

	#tableBox {
		margin-left: 2%;
	}

	#pagination_nav {
		position: relative;
		margin-top: 10px;
		margin-left: 35%;
	}
</style>
