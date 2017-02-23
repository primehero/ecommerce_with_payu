const Product = require("./models/product.js");

let products = [
	{ name: "Grey T Shirt", image: "http://localhost:1337/images/tshirt-1.jpg", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", price: 21  },
	{ name: "Red T Shirt", image: "http://localhost:1337/images/tshirt-2.jpg", description: "Vivamus et dapibus quam. Mauris consectetur cursus risus, in vehicula tortor tincidunt eget. Aenean semper euismod venenatis.", price: 23  },
	{ name: "Yellow T Shirt", image: "http://localhost:1337/images/tshirt-3.jpg", description: "Vivamus et dapibus quam. Mauris consectetur cursus risus, in vehicula tortor tincidunt eget. Aenean semper euismod venenatis.", price: 23  },
	{ name: "White T Shirt", image: "http://localhost:1337/images/tshirt-5.jpg", description: "Vivamus et dapibus quam. Mauris consectetur cursus risus, in vehicula tortor tincidunt eget. Aenean semper euismod venenatis.", price: 23  },
	{ name: "Black T Shirt", image: "http://localhost:1337/images/tshirt-6.jpg", description: "Vivamus et dapibus quam. Mauris consectetur cursus risus, in vehicula tortor tincidunt eget. Aenean semper euismod venenatis.", price: 23  }
];

module.exports = (function() {
	Product.remove({}, err => {
		products.forEach((p) => {
			Product.create(p, (err, createdProduct) => {
				console.log("Added '" + createdProduct.name + "' to the db.");
			});
		});
	});
}).bind();