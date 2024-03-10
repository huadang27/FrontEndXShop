import { createApp   } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import axios from 'axios'
import Pagination from 'v-pagination-3';
import CKEditor from '@ckeditor/ckeditor5-vue';
import globalConfig from './lib/configDatatable.js'
const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$globalConfig = globalConfig;
app.use(router);
app.use(CKEditor);
app.mount('#app');
