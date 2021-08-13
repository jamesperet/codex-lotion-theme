import Vue from 'vue/dist/vue.js';
import VueRouter from "vue-router";

import folderView from './vue/folder-view.vue';
import markdownView from './vue/markdown-view.vue';
import imageView from './vue/image-view.vue';
import fileView from './vue/file-view.vue';

Vue.use(VueRouter);

const routes = [
  { path: '*.md', component: markdownView },
  { path: '*.markdown', component: markdownView },
  { path: '*.jpg', component: imageView },
  { path: '*.jpeg', component: imageView },
  { path: '*.png', component: imageView },
  { path: '*.gif', component: imageView },
  { path: '*.*', component: fileView },
  { path: '*', component: folderView }
];

const router = new VueRouter({
  mode: "history",
  routes: routes,
});

export default router;