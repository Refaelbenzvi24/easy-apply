import {createApp,} from 'vue'
import App from './Options.vue'
import '../styles'

const rootPortal = document.createElement('div')
rootPortal.id = 'root-portal'
document.body.insertBefore(rootPortal, document.body.firstChild)

const app = createApp(App)
app
	.mount('#app')
