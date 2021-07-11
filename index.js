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
      var files = [
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
        "node_modules/vue/dist/vue.js"
      ]
      for (let i = 0; i < files.length; i++) {
        var _this = this;
        
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
    }

    run(){}
      
}

module.exports = LotionTheme;