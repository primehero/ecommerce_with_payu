const routes = require("express").Router();
const Product = require("../models/product.js");


routes.get("/", (req, res) => {
	Product.find({}, (err, foundProducts) => {
		res.render("index", {products: foundProducts});
	});
});

routes.get("/:id", (req, res) => {
	Product.findById(req.params.id, (err, foundProduct) => {
		res.render("show", { product: foundProduct });
	})
});

module.exports = routes;
