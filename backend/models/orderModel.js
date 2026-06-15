import mongoose from 'mongoose';
import { timestamp } from 'rxjs';

const orderModel = mongoose.Schema({
	// buyersName: { type: String, required: true },
	ref: { type: String, required: true },
	campus: { type: String, required: true },
	buyersName: { type: String },
	buyersWhatsapp: { type: String, required: true },
	deliveryLocation: { type: String, required: true },
	orders: [
		{
			name: { type: String, required: true },
			size: { type: String, required: true },
			price: { type: Number, required: true },
			quantity: { type: Number, required: true },
			subtotal: { type: Number, required: true },
			type: { type: String, required: true },
		},
	],
	anonymous: {
		// isTrue: { type: Boolean, default: false },
		receipientName: { type: String },
		receipientWhatsapp: { type: String },
		giftNote: { type: String },
	},

	receipt: { url: String, public_id: String },
	isGift: { type: Boolean, required: true, default: false },
	status: {
		isConfirmed: { type: Boolean, required: true, default: false },
		isApproved: { type: Boolean, required: true, default: false },
		isCompleted: { type: Boolean, required: true, default: false },
		isCancelled: { type: Boolean, required: true, default: false },
		// isReady: { type: Boolean, required: true, default: false },
	},
});

const Order = mongoose.model('Order', orderModel);

export default Order;
