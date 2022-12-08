import { createApp } from "vue";
import vSelect from "vue-select"
import "./style.css";
import App from "./App.vue";
import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'
import VueApexCharts from "vue3-apexcharts";

createApp(App).component("v-select",vSelect).use(mdiVue, {
    icons: mdijs
  }).use(VueApexCharts).mount("#app");