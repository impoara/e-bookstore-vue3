import { createStore } from "vuex";

//引入小仓库
import user from './user'
//对外暴露Store类的一个实例
export default createStore({
	//实现Vuex仓库模块式开发存储数据
	modules:{
		user,
	}
});