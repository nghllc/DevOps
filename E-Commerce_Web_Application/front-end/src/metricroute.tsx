import express, { Request, Response } from 'express';
import * as promClient from 'prom-client';

const metricsRouter = express.Router();
const register = new promClient.Registry();

// System metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const routeVisitsCounter = new promClient.Counter({
  name: 'route_visits_total',
  help: 'Total number of route visits',
  labelNames: ['route']
});
register.registerMetric(routeVisitsCounter);

const routeLoadTimeHistogram = new promClient.Histogram({
  name: 'route_load_time_seconds',
  help: 'Route load time in seconds',
  labelNames: ['route']
});
register.registerMetric(routeLoadTimeHistogram);

// Middleware to track route metrics
export const trackRouteMetrics = (route: string) => {
  routeVisitsCounter.inc({ route });
  const end = routeLoadTimeHistogram.startTimer({ route });
  return end;
};

// Metrics endpoint
metricsRouter.get('/', async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

export { metricsRouter, routeVisitsCounter, routeLoadTimeHistogram };