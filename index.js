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
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "node_modules/bootstrap/dist/css/bootstrap.min.css.map",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map",
        "node_modules/vue/dist/vue.js",
        "node_modules/vue-router/dist/vue-router.min.js",
        "views/vue/folder-view.vue",
        "views/vue/markdown-view.vue",
        "views/vue/breadcrumbs.vue",
        "views/vue/sidebar.vue",
        "views/vue/sidebar-file.vue"
      ]
      for (let i = 0; i < files.length; i++) {
        this.server.express.get("/" + files[i].split("/").pop(), function (req, res) {
          var file = path.join(path.dirname(fs.realpathSync(__filename)), files[i]);
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