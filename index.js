var path = require("path");
var fs = require("fs");
const configTool = require("config");

class LotionTheme {
    
    constructor(server, config){
        this.server = server;
        this.config = config;
        this.module_name = "Lotion Theme";
        this.spa_mode = true;
        if(config.modules_path != undefined){
          this.modules_path = config.modules_path;
          console.log(`> Using custom modules_path: \'${this.modules_path}\'`);
        } else {
          this.modules_path = "node_modules";
          console.log(`> Using default modules_path: \'${this.modules_path}\'`);
        }
    }

    init(){
      var files = [
        { route: "/bootstrap.min.css", path: `${this.modules_path}/bootstrap/dist/css/bootstrap.min.css` },
        { route: "/bootstrap.min.css.map", path: `${this.modules_path}/bootstrap/dist/css/bootstrap.min.css.map` },
        { route: "/bootstrap.bundle.min.js", path: `${this.modules_path}/bootstrap/dist/js/bootstrap.bundle.min.js` },
        { route: "/bootstrap.bundle.min.js.map", path: `${this.modules_path}/bootstrap/dist/js/bootstrap.bundle.min.js.map` },
        { route: "/vue.js", path: `${this.modules_path}/vue/dist/vue.js` },
        { route: "/vue-router.min.js", path: `${this.modules_path}/vue-router/dist/vue-router.min.js` },
        { route: "/fontawesome.css", path: `${this.modules_path}/@fortawesome/fontawesome-free/css/all.css` },
        { route: "/webfonts/fa-regular-400.woff", path: `${this.modules_path}/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff` },
        { route: "/webfonts/fa-regular-400.woff2", path: `${this.modules_path}/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2` },
        { route: "/webfonts/fa-regular-400.ttf", path: `${this.modules_path}/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf` },
        { route: "/webfonts/fa-brands-400.woff1", path: `${this.modules_path}/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff1` },
        { route: "/webfonts/fa-brands-400.woff2", path: `${this.modules_path}/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2` },
        { route: "/webfonts/fa-brands-400.ttf", path: `${this.modules_path}/@fortawesome/fontawesome-free/webfonts/fa-brands-400.ttf` },
        { route: "/webfonts/fa-solid-900.woff", path: `${this.modules_path}/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff` },
        { route: "/webfonts/fa-solid-900.woff2", path: `${this.modules_path}/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2` },
        { route: "/webfonts/fa-solid-900.ttf", path: `${this.modules_path}/@fortawesome/fontawesome-free/webfonts/fa-solid-900.ttf` },
        { route: "/http-vue-loader.js", path: "views/files/http-vue-loader.js" },
        { route: "/vuex.js", path: "views/files/vuex.js" },
        { route: "/editor.js", path: "views/files/editor.js" },
        { route: "/axios.min.js", path: "views/files/axios.min.js" },
        { route: "/folder-view.vue", path: "views/vue/folder-view.vue" },
        { route: "/markdown-view.vue", path: "views/vue/markdown-view.vue" },
        { route: "/breadcrumbs.vue", path: "views/vue/breadcrumbs.vue" },
        { route: "/sidebar.vue", path: "views/vue/sidebar.vue" },
        { route: "/sidebar-file.vue", path: "views/vue/sidebar-file.vue" },
        { route: "/toolbar.vue", path: "views/vue/toolbar.vue" },
        { route: "/bundle.js", path: "views/files/bundle.js" },
        { route: "/atom-one-dark.css", path: "views/files/atom-one-dark.css" },
        { route: "/darkpastel.css", path: "views/files/darkpastel.css" },
        { route: "/tomorrow-night.css", path: "views/files/tomorrow-night.css" },
      ]
      if(this.spa_mode == true) this.server.spa_mode = true;
      var _this = this;
      for (let i = 0; i < files.length; i++) {
        this.server.express.get(files[i].route, function (req, res) {
          var file = path.join(path.dirname(fs.realpathSync(__filename)), files[i].path);
          _this.server.sendFile(req, res, file);
        });
      }
      this.server.express.get("/api/routes", function (req, res) {
        res.json({ files: _this.server.file_structure});
      });
    }

    run(){}
      
}

module.exports = LotionTheme;