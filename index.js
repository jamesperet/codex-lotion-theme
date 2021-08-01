var path = require("path");
var fs = require("fs");

class LotionTheme {
    
    constructor(server, config){
        this.server = server;
        this.config = config;
        this.module_name = "Lotion Theme";
    }

    init()
    {
      var _this = this;
      var files = [
        { route: "/bootstrap.min.css", path: "node_modules/bootstrap/dist/css/bootstrap.min.css" },
        { route: "/bootstrap.min.css.map", path: "node_modules/bootstrap/dist/css/bootstrap.min.css.map" },
        { route: "/bootstrap.bundle.min.js", path: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js" },
        { route: "/bootstrap.bundle.min.js.map", path: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map" },
        { route: "/vue.js", path: "node_modules/vue/dist/vue.js" },
        { route: "/vue-router.min.js", path: "node_modules/vue-router/dist/vue-router.min.js" },
        { route: "/fontawesome.css", path: "node_modules/@fortawesome/fontawesome-free/css/all.css" },
        { route: "/webfonts/fa-regular-400.woff", path: "node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff" },
        { route: "/webfonts/fa-regular-400.woff2", path: "node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.woff2" },
        { route: "/webfonts/fa-regular-400.ttf", path: "node_modules/@fortawesome/fontawesome-free/webfonts/fa-regular-400.ttf" },
        { route: "/http-vue-loader.js", path: "views/files/http-vue-loader.js" },
        { route: "/axios.min.js", path: "views/files/axios.min.js" },
        { route: "/folder-view.vue", path: "views/vue/folder-view.vue" },
        { route: "/markdown-view.vue", path: "views/vue/markdown-view.vue" },
        { route: "/breadcrumbs.vue", path: "views/vue/breadcrumbs.vue" },
        { route: "/sidebar.vue", path: "views/vue/sidebar.vue" },
        { route: "/sidebar-file.vue", path: "views/vue/sidebar-file.vue" }
      ]
      for (let i = 0; i < files.length; i++) {
        this.server.express.get(files[i].route, function (req, res) {
          var file = path.join(path.dirname(fs.realpathSync(__filename)), files[i].path);
          res.sendFile(file, function(err){
            if (err) {
              _this.server.cli.log("> Error: " + file + " - file not found");
              res.status(err.status).end();
            }
            else {
              _this.server.cli.log('> Sending ' + file +  _this.server.printUser(req));
            }
          });
        });
      }
      this.server.express.get("/api/routes", function (req, res) {
        res.json({ files: _this.server.file_structure});
      });
    }

    run(){}
      
}

module.exports = LotionTheme;