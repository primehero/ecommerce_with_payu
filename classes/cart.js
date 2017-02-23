const Product = require("../models/product.js");

// Constructor 
const Cart = function() {
	this.items = [];
	this.numItems = 0;
	this.total = 0;
};

/**
 * Checks for duplicates in the cart. If there is a duplicate then this function returns its index.
 *
 * @param {Object} id - The id of the item to find in the cart.
 * returns {String/Boolean} Returns the position of the element as string else returns false.
 */
Cart.prototype.isDup = function(id) {
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i]._id.toString() === id.toString()) {
			return i.toString();
		}
	}
	return false;
};

/**
 * Adds an item to the cart.
 *
 * @param {String} id - The id of the item to add to cart.
 * @param {String} q - Quantity of items to be added.
 * returns {Promise} A promise object.
 */
Cart.prototype.addItem = function(id, q) {
	return new Promise((resolve, reject) => {
		Product.findById(id, (err, foundItem) => {
			q = parseInt(q, 10);
			if (err) reject(err);

			var pos = this.isDup(id);
			console.log(pos);
			// If there are no duplicates.
			if ( ! pos ) {
				var shallowItem = foundItem;
				shallowItem.quantity = q;
				this.items.push(shallowItem);
				resolve({ itemName: shallowItem.name, q: q});
			} else {
				pos = parseInt(pos);
				this.items[pos].quantity += q;
				resolve({ itemName: this.items[pos].name, q: q});
			}
			
			this.total += (foundItem.price * q);
			this.numItems += q;
		});		
	});

};

/**
 * Removes an item from the cart.
 *
 * @param {String} id - Mongo id of the object to be removed.
 * returns {Boolean} true if its found in the cart, else false.
 */
Cart.prototype.removeItem = function(id) {
	for (var i = 0; i < this.items.length; i++) 
		if (this.items[i]._id.toString() === id.toString()) {
			this.total -= (this.items[i].quantity * this.items[i].price);
			this.numItems -= this.items[i].quantity;
			this.items.splice(i, 1);
			return true;
		}
	return false;	
};


module.exports = Cart;