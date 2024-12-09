const express = require("express");
const promClient = require('prom-client');
const {getCartProducts, addCartProduct, deleteCartProduct, checkout} = require("../controllers/cartController");
const validateToken = require('../middleware/tokenValidationMiddleware');

const router = express.Router();

// Create metrics registry
const register = new promClient.Registry();

// Define metrics
const cartMetrics = {
  getCartRequests: new promClient.Counter({
    name: 'cart_get_requests_total',
    help: 'Total number of get cart requests'
  }),
  addToCartRequests: new promClient.Counter({
    name: 'cart_add_requests_total', 
    help: 'Total number of add to cart requests'
  }),
  deleteFromCartRequests: new promClient.Counter({
    name: 'cart_delete_requests_total',
    help: 'Total number of delete from cart requests'
  }),
  checkoutRequests: new promClient.Counter({
    name: 'cart_checkout_requests_total',
    help: 'Total number of checkout requests'
  })
};

// Register metrics
Object.values(cartMetrics).forEach(metric => register.registerMetric(metric));

// Metrics endpoint
router.get("/metrics", async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

router.get("/", validateToken, (req, res, next) => {
  cartMetrics.getCartRequests.inc();
  getCartProducts(req, res, next);
});

router.post("/:productid", validateToken, (req, res, next) => {
  cartMetrics.addToCartRequests.inc();
  addCartProduct(req, res, next);
});

router.delete("/checkout", validateToken, (req, res, next) => {
  cartMetrics.checkoutRequests.inc();
  checkout(req, res, next);
});

router.delete("/:productid", validateToken, (req, res, next) => {
  cartMetrics.deleteFromCartRequests.inc();
  deleteCartProduct(req, res, next);
});

module.exports = router;