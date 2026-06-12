import mongoose from 'mongoose';
import { timestamp } from 'rxjs';

const orderModel = mongoose.Schema({
	orderName: { type: String, required: true },
	type: { type: String, required: true },
	quantity: { type: Number, required: true },
	price: { type: Number, required: true },
	location: { type: String, required: true },
	buyersName: { type: String },
	buyersWhatsapp: { type: Number, required: true },
	deliveryLocation: { type: String, required: true },
	anonymous: {
		isTrue: { type: Boolean },
		receipientName: { type: String },
		receipientWhatsapp: { type: String },
		receipientMessage: { type: String },
	},
	receipt: { url: String, public_id: String },
	status: {type: Boolean, required: true, default: false},
	
});

const Order = mongoose.model('Order', orderModel);

export default Order;
