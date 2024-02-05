module.exports = (app) => {
  app.use("/api/admins", require("./admin/routes"));
  app.use("/api/restaurants", require("./rest/routes"));
  app.use("/", require("./subscription/routes"));
};
