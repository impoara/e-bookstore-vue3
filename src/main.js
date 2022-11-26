import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入仓库
import store from './store'
// createApp(App).use(router).use(ElementPlus).mount('#app')
let app = createApp(App)
//使用router
app.use(router)
//使用ElementUI
app.use(ElementPlus)
//使用仓库
app.use(store)

app.mount('#app')
