const { authJwt } = require("../middlewares");
const controller = require("../controllers/turno.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/turno", controller.add);
  app.get("/api/turnos", [authJwt.verificarToken], controller.list);
  app.get("/api/turno", controller.get);
  app.get('/api/turno/public', controller.getPublic)
  app.put("/api/turno", controller.update);
  app.delete("/api/turno", [authJwt.verificarToken], controller.remove)
  
};