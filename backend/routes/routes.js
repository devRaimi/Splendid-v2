import express from 'express';
import {
	createOrder,
	createItem,
	getOrders,
	getItems,
	updateOrder,
	getOrderByRef,
} from '../controllers/controllers.js';
import { itemUpload, receiptUpload } from '../middlewares/upload.js';

const router = express.Router();

router
	.route('/order/create')
	.post(receiptUpload.single('receipt'), createOrder);
router.route('/order/fetchAll').get(getOrders);
router.route('/order/fetchOne/:ref').get(getOrderByRef);
router.route('/item/create').post(itemUpload.single('image'), createItem);

router.route('/item/fetchAll').get(getItems);
router.route('/order/update/:ref').put(updateOrder);

export default router;
