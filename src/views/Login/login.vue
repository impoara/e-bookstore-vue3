<template>
	<!-- 最外层的大盒子 -->
	<div class="bigBox">
		<div class="box">
			<!-- 滑动盒子 -->
			<div class="pre-box">
				<h1>WELCOME</h1>
				<p>JOIN US!</p>
				<div class="img-box">
					<img src="@/assets/img/login_img.gif" alt="" id="avatar" />
				</div>
			</div>
			<!-- 注册盒子 -->
			<div class="register-form">
				<!-- 标题盒子 -->
			 	<div class="title-box1">
					<h1>注册</h1>
				</div>
				<!-- 输入框盒子 -->
				<el-form ref="registerFormRef" :model="registerForm" :rules="rules" label-with="5px">
					<el-form-item prop="username" label=" ">
						<el-input type="text" placeholder="用户名" :suffix-icon="User" v-model="registerForm.username" />
					</el-form-item>
					<el-form-item prop="password" label=" ">
						<el-input type="password" placeholder="密码" :suffix-icon="Lock"
							v-model="registerForm.password" />
					</el-form-item>
					<el-form-item prop="confirmPassword" label=" ">
						<el-input type="password" placeholder="确认密码" :suffix-icon="Lock"
							v-model="registerForm.confirmPassword" />
					</el-form-item>
					<el-form-item prop="email" label=" ">
						<el-input type="email" placeholder="电子邮箱" :suffix-icon="Message" v-model="registerForm.email" />
					</el-form-item>
					<el-form-item prop="code" label=" ">
						<el-input style="width: 180px;" type="text" placeholder="验证码" v-model="registerForm.code" />
						<img style="height:42px; margin-left:12px;" @click="changeCode" :src="verifyCode" alt="验证码" title="看不清?点击更换" id="verify_code"/>
					</el-form-item>
				</el-form>
				<!-- 按钮盒子 -->
				<div class="btn-box">
					<button @click="register">注册</button>
					<!-- 绑定点击事件 -->
					<p @click="mySwitch">已有账号?去登录</p>
				</div>
			</div>
			<!-- 登录盒子 -->
			<div class="login-form">
				<!-- 标题盒子 -->
				<div class="title-box2">
					<h1>登录</h1>
				</div>
				<!-- 输入框盒子 -->
				<el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-with="5px">
					<el-form-item prop="username" label=" ">
						<el-input type="text" placeholder="用户名" :suffix-icon="User" v-model="loginForm.username" />
					</el-form-item>
					<el-form-item prop="password" label=" ">
						<el-input type="password" placeholder="密码" :suffix-icon="Lock" v-model="loginForm.password" />
					</el-form-item>
				</el-form>
				<!-- 按钮盒子 -->
				<div class="btn-box">
					<button @click="login">登录</button>
					<!-- 绑定点击事件 -->
					<p @click="mySwitch">没有账号?去注册</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {Lock,User,Message,Bell} from '@element-plus/icons-vue'
	import mySwitch from './js/mySwitch'
	import {reactive,ref,onMounted,watchEffect} from 'vue'
	import api from '@/api/login.js'
	import {ElMessage} from 'element-plus'
	import { useRouter,useRoute } from 'vue-router'
	import { useStore  } from 'vuex';
	
	//生命周期钩子
	onMounted(()=>{
		changeCode()
	})
	//登陆表单
	const loginForm = reactive({
		username: '',
		password: ''
	})
	//注册表单
	const registerForm = reactive({
		username: '',
		password: '',
		confirmPassword: '',
		email: '',
		code: '',
	})
	const store = useStore();
	const verifyCode = ref('')
	const loginFormRef = ref('')
	const registerFormRef = ref('')
	const confirmPass = ref(false)
	//校验规则
	const rules = reactive({
		username: [{
				required: true,
				message: '请输入用户名',
				trigger: ['blur', 'change']
			},
			{
				min: 3,
				max: 15,
				message: '长度应该在3~15个字符之间',
				trigger: ['blur', 'change']
			},
		],
		password: [{
				required: true,
				message: '请输入密码',
				trigger: ['blur', 'change']
			},
			{
				min: 3,
				message: '长度应该大于3',
				trigger: ['blur', 'change']
			},
		],
		confirmPassword: [{
				required: true,
				message: '请输入确认密码',
				trigger: ['blur', 'change']
			},
			{
				min: 3,
				message: '请保持密码一致',
				trigger: ['blur', 'change']
			},
		],
		email: [{
				required: true,
				message: '请输入电子邮箱',
				trigger: ['blur', 'change']
			},
			{
				type: 'email',
				message: '请输入正确的电子邮箱',
				trigger: ['blur', 'change']
			},
		],
		code: [{
				required: true,
				message: '请输入验证码',
				trigger: 'blur'
			},
			{
				min: 4,
				max: 4,
				message: '验证码为四位',
				trigger: ['blur', 'change']
			},
		],
	})
	//监视
	watchEffect(()=>{
		const x1 = registerForm.password
		const x2 = registerForm.confirmPassword
		if(x1 == x2){
			confirmPass.value = true;
		}else{
			confirmPass.value = false;
		}
	})
	//路由功能
	const router = useRouter()
	 const route = useRoute()
	//登录功能
	const login = () => {
		loginFormRef.value.validate((valid) => {
			if (valid) {
				api.loginApi(loginForm).then(res => {
					// console.log('login=>', res)
					if(res.data.flag === true) {
						ElMessage.success("登陆成功!")
						//将用户信息保存到仓库中
						store.commit('GETUSERINFO',res.data.userInfo)
						router.push('/home')
					} else if(res.data.flag === false){
						ElMessage.error(res.msg)
					}
					/* if (res.status === 0) {
						// ElMessage.success(res.message)
						// window.sessionStorage.setItem('token', res.token)
						router.push('/home')
					} */
				}).catch(error => {
					console.log(error);
				})
			} else {
				return
			}
		})
	}
	//注册功能
	const register = () => {
		registerFormRef.value.validate((valid) => {
			if (valid) {
				if(!confirmPass.value){
					ElMessage.error("两次密码输入不正确")
					return 
				}
				api.registerApi(registerForm).then(res => {
					// console.log(res)
					if (res.data.status === 0) {
						ElMessage.success(res.msg)
						loginForm.username = registerForm.username
						registerForm.username = ''
						registerForm.password = ''
						registerForm.confirmPassword = ''
						registerForm.email = ''
						registerForm.code = ''
						mySwitch()
					} else if(res.data.status === -1){
						ElMessage.error(res.msg)
						changeCode()
					}
				}).catch(error => {
					console.log(error);
				})
			} else {
				return
			}
		})
	}
	//更换验证码
	const changeCode = () => {
		verifyCode.value = "http://localhost:80/user/code?"+ new Date().getTime()
	}
	
</script>

<style scoped>
	/* 去除input的轮廓 */
	input {
		outline: none;
	}

	.bigBox {
		/* 溢出隐藏 */
		height: 100vh;
		overflow-x: hidden;
		display: flex;
		/* 渐变方向从左到右 */
		background: linear-gradient(to right, rgb(250, 203, 77), rgb(206, 219, 253));/* rgb(247, 209, 215), rgb(191, 227, 241) */
	}

	/* 最外层的大盒子 */
	.box {
		width: 1050px;
		height: 600px;
		display: flex;
		/* 相对定位 */
		position: relative;
		z-index: 2;
		margin: auto;
		/* 设置圆角 */
		border-radius: 8px;
		/* 设置边框 */
		border: 1px solid rgba(255, 255, 255, 0.6);
		/* 设置盒子阴影 */
		box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
	}

	/* 滑动的盒子 */
	.pre-box {
		/* 宽度为大盒子的一半 */
		width: calc(1050px / 2);
		height: 100%;
		/* 绝对定位 */
		position: absolute;
		/* 距离大盒子左侧为0 */
		left: 0;
		/* 距离大盒子顶部为0 */
		top: 0;
		z-index: 99;
		border-radius: 4px;
		background-color: #edd4dc;/* #edd4dc */
		box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
		/* 动画过渡，先加速再减速 */
		transition: 0.5s ease-in-out;
	}

	/* 滑动盒子的标题 */
	.pre-box h1 {
		margin-top: 150px;
		text-align: center;
		/* 文字间距 */
		letter-spacing: 5px;
		color: white;
		/* 禁止选中 */
		user-select: none;
		/* 文字阴影 */
		text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
	}

	/* 滑动盒子的文字 */
	.pre-box p {
		height: 30px;
		line-height: 30px;
		text-align: center;
		margin: 20px 0;
		/* 禁止选中 */
		user-select: none;
		font-weight: bold;
		color: white;
		text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
	}

	/* 图片盒子 */
	.img-box {
		width: 200px;
		height: 200px;
		margin: 20px auto;
		/* 设置为圆形 */
		border-radius: 50%;
		/* 设置用户禁止选中 */
		user-select: none;
		overflow: hidden;
		box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
	}

	/* 图片 */
	.img-box img {
		width: 100%;
		transition: 0.5s;
	}

	/* 登录和注册盒子 */
	.login-form,
	.register-form {
		flex: 1;
		height: 100%;
	}

	/* 标题盒子 */
	.title-box1 {
		height: 230px;
		line-height: 370px;
	}
	
	.title-box2 {
		height: 300px;
		line-height: 500px;
	}

	/* 标题 */
	.title-box1,.title-box2 h1 {
		text-align: center;
		color: white;
		/* 禁止选中 */
		user-select: none;
		letter-spacing: 5px;
		text-shadow: 1px 4px 3px rgba(0, 0, 0, 0.1);
	}

	/* 输入框盒子 */
	.el-form {
		display: flex;
		/* 纵向布局 */
		flex-direction: column;
		/* 水平居中 */
		align-items: center;
	}

	.el-form-item {
		width: 65%;
	}

	/* 输入框 */
	input {
		/* width: 60%; */
		height: 40px;
		margin-bottom: 20px;
		text-indent: 10px;
		border: 1px solid #fff;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 120px;
		/* 增加磨砂质感 */
		backdrop-filter: blur(10px);
	}

	input:focus {
		/* 光标颜色 */
		color: #b0cfe9;
	}

	/* 聚焦时隐藏文字 */
	input:focus::placeholder {
		opacity: 0;
	}

	/* 按钮盒子 */
	.btn-box {
		display: flex;
		justify-content: center;
	}

	/* 按钮 */
	button {
		width: 100px;
		height: 30px;
		margin: 0 7px;
		line-height: 30px;
		border: none;
		border-radius: 4px;
		background-color: #69b3f0;
		color: white;
	}

	/* 按钮悬停时 */
	button:hover {
		/* 鼠标小手 */
		cursor: pointer;
		/* 透明度 */
		opacity: 0.8;
	}

	/* 按钮文字 */
	.btn-box p {
		height: 30px;
		line-height: 30px;
		/* 禁止选中 */
		user-select: none;
		font-size: 14px;
		color: white;
	}

	.btn-box p:hover {
		cursor: pointer;
		border-bottom: 1px solid white;
	}
</style>
