import Vue from 'vue/dist/vue.js';
import VueRouter from "vue-router";

import folderView from './vue/folder-view.vue';
import markdownView from './vue/markdown-view.vue';

Vue.use(VueRouter);

const routes = [
  { path: '*.md', component: markdownView },
  { path: '*.markdown', component: markdownView },
  { path: '*', component: folderView }
];

const router = new VueRouter({
  mode: "history",
  routes: routes,
});

export default router;