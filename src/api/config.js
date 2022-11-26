import axios from 'axios'
import { ElMessage } from 'element-plus'
//引入进度条
import nprogress from 'nprogress';
//引入进度条样式
//start:进度条开始.	done:进度条结束
import "nprogress/nprogress.css";
//创建axios实例
const Service = axios.create({
    // 设置baseURL地址
    baseURL: 'http://localhost:80',
    //定义统一的请求头
    headers: {
        'Content-Type': "application/json;charset=UTF-8"
    },
    //配置请求超时时间
    time: 5000
})

//请求拦截器
Service.interceptors.request.use((config) => {
    //配置请求头
	//先从浏览器的回话存储中提取token值
	const tokenStr = localStorage.getItem('token')
	if (tokenStr) {
	  config.headers.Authorization = tokenStr
	}
    config.headers.common['Authorization'] = window.sessionStorage.getItem('token') === null ? null : window.sessionStorage.getItem('token')
	//进度条开始
	nprogress.start();
    return config
})

//响应拦截器
Service.interceptors.response.use((response) => {
	//进度条结束
	nprogress.done();
    //获取接口返回结果
    const res = response.data
	// console.log("res=>",res)	
    if (res.flag === true || typeof(res.flag)=="undefined") {
        return res
    } else {
        ElMessage.error('网络异常')
		return res
    }
})

export default Service