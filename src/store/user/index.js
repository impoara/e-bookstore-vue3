//user仓库
const state = {
	userInfo:{},
}

const actions = {
	//获取用户信息
	getUserInfo({commit},userInfo){
			commit('GETUSERINFO',userInfo)
	},
	//退出登录
	userLogout({commit}){
			commit('CLEAR');
	}
}

const mutations = {
	//保存用户信息
	GETUSERINFO(state,userInfo){
		state.userInfo = userInfo
	},
	//清除用户信息
	CLEAR(state){
		state.userInfo = {};
	}
}

const getters = {
	
}


export default {
	state,
	actions,
	mutations,
	getters
}