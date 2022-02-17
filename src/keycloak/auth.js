const Keycloak = require("keycloak-connect");
var session = require("express-session");
var memoryStore = new session.MemoryStore();

const auth = (app) => {
  const keycloakConf = require("../config/keycloak_config.json");

  // Initializing Keycloak with memory store and Config.
  const kc = new Keycloak({ store: memoryStore }, keycloakConf);

  // To set the session to prevent Keycloak middleware from throwing error.
  // Always use this before initializing Keycloak middleware.
  app.use(
    session({
      secret: "some secret",
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );

  // Keycloak middleware
  // app.use(
  //   kc.middleware({
  //     logout: "/logout",
  //     admin: "/",
  //   })
  // );

  return kc;
};

module.exports = auth;
