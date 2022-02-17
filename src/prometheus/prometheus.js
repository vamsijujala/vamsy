const Prometheus = require("prom-client");

// Create a Registry to register the metrics
const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
collectDefaultMetrics();

const testData = new Prometheus.Gauge({
  name: "app_status",
  help: "Shows the status of App Up/Down",
  labelNames: ["app_status"],
});

const SetMetrics = (data) => {
  testData.set(data);
};

const GetMetrics = () => {
  return Prometheus.register;
};

module.exports = { SetMetrics, GetMetrics };