const express = require("express");
const basicAuth = require("express-basic-auth");
const ejs = require("ejs");
const cors = require("cors");
const { SetMetrics, GetMetrics } = require("./src/prometheus/prometheus");
const auth = require("./src/keycloak/auth");
const Producer = require("./src/kafka/producer/producer");
const Topic = require("./src/kafka/topic/topic");
const Consumer = require("./src/kafka/consumer/consumer");
const { json } = require("express/lib/response");
const app = express();
const kc = auth(app);

// Socket.io connection
const server = require("http").createServer(app);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(cors());
app.use(express.json());
app.use(
  kc.middleware({
    logout: "/logout",
    admin: "/",
  })
);

// Basic Auth
var staticUserAuth = basicAuth({
  users: {
    HomeConnect: "HomeConnect@123",
  },
  challenge: true,
});

const io = require("socket.io")(server, { cors: { origin: "*" } });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
app.get("/", (req, res) => {
  res.render("home", {
    logStatus: req.session["keycloak-token"] ? true : false,
  });
  // res.render("home", {
  //   logStatus: true,
  // });
});

// app.get("/umpire",  (req, res) => {
// app.get("/umpire", kc.protect(), (req, res) => {
//   res.render("umpire", { logStatus: true });
// });

app.get("/event", kc.protect("live-score-client"), (req, res) => {
  res.render("event", { logStatus: true });
});

app.get("/login", (req, res) => {
  res.redirect("/event");
});

// app.post("/umpire", async (req, res) => {
//   console.log(req.body);
//   const live_data = JSON.stringify(req.body);
//   await Producer(live_data);
//   // res.sendStatus(200);
//   // res.redirect("/umpire");
// });

// Socket.io Connect
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
});

// const testdata = {
//   score: "143",
//   wicket: "5",
//   batsman1: "Rohit Sharma",
//   batsman2: "Virat Kohli",
//   overs: "16.4",
//   bowler: "David Warner",
// };

// app.get("/test", async (req, res) => {
//   await Consumer(io);
//   // await io.emit("message", testdata);
//   res.send("Done");
// });

// Prometheus
app.get("/metrics", staticUserAuth, async (req, res) => {
  const MetricData = GetMetrics();
  res.writeHead(200, { "Content-Type": `${MetricData.contentType}` });
  res.write(await MetricData.metrics());
  res.end();
});

// function RandomGeneratore(max) {
//   return Math.floor(Math.random() * max);
// }

// function Fn60sec() {
//   const app_status = 1;
//   console.log("Prometheus Test Data:", app_status);
//   SetMetrics(app_status);
// }

// Server Started at port 3000
server.listen(process.env.PORT || 3030, async () => {
  console.log("Server Started !!!");
  SetMetrics(1);
  await Topic();
  await Consumer(io);
  // Fn60sec();
  // setInterval(Fn60sec, 30 * 1000);
});
