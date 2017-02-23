const routes = require("express").Router();
const Product = require("../models/product.js");

routes.get("/", (req, res) => {
	res.render("landing");
});


module.exports = routes;