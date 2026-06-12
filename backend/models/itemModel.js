import mongoose from 'mongoose';
import { timestamp } from 'rxjs';

const itemModel = mongoose.Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	description: { type: String },
	size: {
		sizeName: { type: String, required: true },
		quantity: { type: Number, required: true },
		price: { type: Number, required: true },
	},
	image: { url: String, public_id: String },
	locationAvailable: { type: String, required: true },
	available: { type: Boolean, required: true, default: true },
});

const Item = mongoose.model('Item', itemModel);

export default Item;
