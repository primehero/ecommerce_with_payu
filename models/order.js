const mongoose = require("mongoose"),
	  Schema   = mongoose.Schema;

orderSchema = mongoose.Schema({
	firstname: String,
	email: String,
	phone: String,
	amount: Number,
	address1: String,
	items: [{
		_self_id: { type: Schema.Types.ObjectId, ref: "Product" },
		_self_name: String,
		quantity: String
	}],
	addedon: String,
	prepaid: Boolean,
	txnid: String,
	payuMoneyId: String,
	cardnum: String,
	name_on_card: String,
	mihpayid: String,
    hash: String,
	field1: String,
	field2: String,
	field3: String,
	field4: String,
	field5: String,
	field6: String,
	field7: String,
	field8: String,
	field9: String,
	PG_TYPE: String,
	encryptedPaymentId: String,
	bank_ref_num: String,
	bankcode: String
});

module.exports = mongoose.model("Order", orderSchema);