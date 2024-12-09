const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
require('./config/db_conn');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3003;

const promClient = require('prom-client');
// Prometheus setup
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Request tracking middleware
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to track request metrics
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ 
      method: req.method, 
      route: req.route ? req.route.path : req.path, 
      code: res.statusCode 
    });
  });
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.use("/cart", require("./routes/cartRouter"));

app.listen(port, host, () => {
    console.log(`Running on http://${host}:${port}`);
});

module.exports = app;
