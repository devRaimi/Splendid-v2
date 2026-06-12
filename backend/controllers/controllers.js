import Item from '../models/itemModel.js';
import Order from '../models/orderModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const createOrder = asyncHandler(async (req, res) => {
	const {
		orderName,
		type,
		quantity,
		price,
		location,
		buyersName,
		buyersWhatsapp,
		deliveryLocation,
		isTrue,
		receipientName,
		receipientWhatsapp,
		receipientMessage,
	} = req.body;
	let anonymous;
	if (isTrue) {
		anonymous = {
			receipientName,
			receipientWhatsapp,
			receipientMessage,
		};
	}
	const data = {
		orderName,
		type,
		quantity,
		price,
		location,
		buyersName,
		buyersWhatsapp,
		deliveryLocation,
		anonymous,
	};
	try {
		const order = new Order({ ...data });
		await order.save();
		res.json(order);
	} catch (err) {
		throw new Error(err);
	}
});

const createItem = asyncHandler(async (req, res) => {
	// console.log(req.body.sizeName);
	const { name, type, sizeName, size, price, description, available, locationAvailable } =
		req.body;
	const image = req.file
		? { url: req.file.path, public_id: req.file.filename }
		: null;
	try {
		const item = new Item({
			name,
			type,
			size: {
				sizeName,
				quantity: Number(size),
				price: Number(price),
			},
			locationAvailable,
			description,
			available,
			image
		});
		await item.save();
		res.json(item);
	} catch (err) {
		throw new Error(err);
	}
});

const getItems = asyncHandler(async (req, res) => {
	try {
		const data = await Item.find({});
		res.json(data);
	} catch (err) {
		throw new Error(err);
	}
});

const getOrders = asyncHandler(async (req, res) => {
	try {
		const data = await Order.find({});
		res.json(data);
	} catch (err) {
		throw new Error(err);
	}
});

const updateOrder = asyncHandler(async (req, res) => {
	const order = await Order.findById(await req.params.id);
	const { status } = req.body;
	try {
		order.status = status;
		await order.save();
		res.json(order);
	} catch (err) {
		throw new Error(err);
	}
});

const updateItem = asyncHandler(async (req, res) => {
	const item = await Item.findById(await req.params.id);
	const {} = req.body;

	try {
		await item.save();
		res.json(item);
	} catch (err) {
		throw new Error(err);
	}
});

export { createOrder, createItem, getItems, getOrders, updateOrder };
