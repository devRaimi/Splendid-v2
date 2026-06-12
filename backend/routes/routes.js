import express from 'express';
import {
	createOrder,
	createItem,
	getOrders,
	getItems,
	updateOrder,
} from '../controllers/controllers.js';
import { itemUpload, receiptUpload } from '../middlewares/upload.js';

const router = express.Router();

router.route('/order/create').post(receiptUpload.single('image'), createOrder);
router.route('/order/fetchAll').get(getOrders);
router.route('/item/create').post(itemUpload.single('image'), createItem);

router.route('/item/fetchAll').get(getItems);
router.route('/order/update').put(updateOrder);

export default router;
