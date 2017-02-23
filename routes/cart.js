const routes = require("express").Router();
const Product = require("../models/product.js");


// SHOW CART route
routes.get("/", (req, res) => {
	if (req.app.locals.cart.numItems < 1) {
		req.flash("failure", "Your cart is empty!");
		res.redirect("/products");
	} else {
		res.render("cart");		
	}
});

// ADD TO CART route
routes.get("/:id", (req, res) => {
	req.app.locals.cart.addItem(req.params.id, req.query.q)
	.then(o => {
		req.flash("success", "Added " + o.itemName + " to your cart.");
		res.redirect("/products");
	})
	.catch((err) => {
		console.error(err);
	});
});

// DELETE route
routes.delete("/:id", (req, res) => {
	if (req.app.locals.cart.removeItem(req.params.id))	
		req.flash("success", "Deleted an item from your cart.");
	else 
		req.flash("failure", "No such item in your cart");
	res.redirect("/products")
});

module.exports = routes;
