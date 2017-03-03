const routes = require("express").Router();
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const payu = require("pay-u").newOrder;
const fs = require("fs");

// PAYMENT FORM route
routes.get("/checkout", (req, res) => {
	res.render("payment/customerForm");
});

// PAYMENT POST route
routes.post("/", (req, res) => {
	try {
		if (this.numItem < 0) throw new Error("No items in the cart");
		// This object will be sent to payment gateway.
		let custObj         = {};
		custObj.amount      = req.app.locals.cart.total;
        custObj.productinfo = 'None';
        custObj.firstname   = req.body.firstname;
        custObj.email       = req.body.email;
        custObj.phone       = req.body.phone;
        custObj.address1  	= req.body.address + ", " + req.body.city + ", " + req.body.zip;
        custObj.surl        = 'http://localhost:1337/payment/success';
        custObj.furl        = 'http://localhost:1337/payment/failure';
	    custObj.service_provider = 'payu_paisa';

	    let shallowObj = custObj;
	    let items = req.app.locals.cart.items;
	    shallowObj.prepaid = false;

	    shallowObj.items = items.map((item) => {
	    	let it = {};
	    	it._self_id = item._id;
	    	it._self_name = item.name
	    	it.quantity = item.quantity;
	    	return it;
	    });

		(function() {
			return new Promise((resolve, reject) => {
				Order.create(shallowObj, (err, createdOrder) => {
					if (err) reject(err);
					custObj.udf1 = createdOrder._id.toString();
					payu.Create(custObj,/* false === test payment*/ false);
					resolve(createdOrder);
				});
			});	
		})()
		.then(() => {
			payu.sendReq()
			.then(url => {
				res.redirect(url);
		    })
		    .catch(err => {
		    	req.failure = JSON.stringify(err)
	    		res.redirect("/products");
		    });
		})		
	    .catch(err => {
	    	req.failure = JSON.stringify(err)	    	
	    	res.redirect("/products");
	    });


	} catch (err) {
		req.flash("failure", err);
		res.redirect("/products");
	}
});

routes.post("/success", (req, res) => {
	try {
		// req.body = JSON.parse(fs.readFileSync("paid.json"));

		/**
		 * Makes a good lookin invoice.
		 */
		let makeInvoice = function(order) {
			data = `
				Name: ${order.firstname},
				Address: ${order.address1},
				Mobile: ${order.phone},
				Date: ${order.addedon},
				Items:
			`;
			for (let i = 0; i < order.items.length; i++) {								
				data += `${order.items[i]._self_name} - ${order.items[i].quantity}\n`;
			};

			data += `total : ${order.amount}`;
			res.send(data + "\n\n" + JSON.stringify(order));
		}

		/**
		 * Checks the status of data returned from payment gateway and saves a few values.
		 */
		let checkStatus = function(obj) {
			return new Promise((resolve, reject) => {
				// If status !== success reject
				if (obj.status !== "success" && Number.parseInt(obj.order.amount, 10) !== Number.parseInt(obj.data.amount, 10) ) reject(new Error("Payment failed!"));
				// If it is a success find by id and update.
				Order.findById(obj.oi, (err, foundOrder) => {					
					foundOrder.addedon =  		obj.data.addedon;
					foundOrder.payuMoneyId =  	obj.data.payuMoneyId;
					foundOrder.cardnum =  		obj.data.cardnum;
					foundOrder.name_on_card =  	obj.data.name_on_card;
					foundOrder.mihpayid =  		obj.data.mihpayid;
				    foundOrder.hash =  			obj.data.hash;
					foundOrder.field1 =  		obj.data.field1;
					foundOrder.field2 =  		obj.data.field2;
					foundOrder.field3 =  		obj.data.field3;
					foundOrder.field4 =  		obj.data.field4;
					foundOrder.field5 =  		obj.data.field5;
					foundOrder.field6 =  		obj.data.field6;
					foundOrder.field7 =  		obj.data.field7;
					foundOrder.field8 =  		obj.data.field8;
					foundOrder.field9 =  		obj.data.field9;
					foundOrder.PG_TYPE =  		obj.data.PG_TYPE;
					foundOrder.encryptedPaymentId =  obj.data.encryptedPaymentId;
					foundOrder.bank_ref_num =  	obj.data.bank_ref_num;
					foundOrder.bankcode =  		obj.data.bankcode;
					foundOrder.prepaid =  		"true";

					foundOrder.save((err, savedOrder) => {
						if (err) reject(err);
						resolve(savedOrder);
					});
				});
            });
		};

		/**
		 * Finds an order using data from req.body.udf1.
		 * returns {promise} A promise that RESOLVEs with found order or REJECTs with an error.
		 */
		(function() {
			return new Promise((resolve, reject) => {
				Order.findById(req.body.udf1).populate("items._id").exec((err, foundOrder) => {
					if (err) reject(err);
					resolve({ order: foundOrder, data: req.body, oi: req.body.udf1 });
				});
			});
		})()
		.then(checkStatus)		
		.then(makeInvoice)
		.catch((err) => {
			console.log(err);
		});	

	} catch (err) {
		console.log(err);
	}	
});

routes.post("/failure", (req, res) => {
	req.flash("failure", "Whoops! payment failed!");
	res.redirect("/products");
})

module.exports = routes;