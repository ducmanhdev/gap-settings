import {createApp, markRaw} from 'vue';
import App from './App.vue';
import router from "./router";
import {createPinia} from 'pinia';
import Antd from 'ant-design-vue';
// @ts-ignore
import CKEditor from '@ckeditor/ckeditor5-vue';
// @ts-ignore
import Paginate from "vuejs-paginate-next";

import './styles/tailwind.scss';
import 'ant-design-vue/dist/antd.less';
import './styles/index.scss';

const pinia = createPinia();
pinia.use(({store}) => {
    store.router = markRaw(router)
});

const app = createApp(App);
app.use(Antd);
app.use(router);
app.use(pinia);
app.use(CKEditor);
app.component('Paginate', Paginate);

app.directive('input-number', {
    mounted(el) {
        if(el.tagName !== 'input') el = el.querySelector('input');
        el.addEventListener("keypress", function (evt: any) {
            if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
        });
    },
})

app.mount('#app');
