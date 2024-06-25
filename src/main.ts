import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import WebApp from '@twa-dev/sdk'

import './mockEnv.ts';

WebApp.ready();

createApp(App).mount('#app')
