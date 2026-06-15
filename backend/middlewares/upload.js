import cloudinary from '../config/cloudinary.js';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';
import 'dotenv/config'; 
import path from 'path'

// const itemStorage = new CloudinaryStorage({
// 	cloudinary: cloudinary,
// 	params: (req, file, cb) => {
// 		const fileName = file.originalname
// 			.split('.')[0]
// 			.replace(/[^\w\-]+/g, '');
// 		cb(null, {
// 			folder: `uploads/item/`,
// 			public_id: `${req.params.file || fileName + Date.now()}`,
// 		});
// 	},

// });
const itemStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // 1. Safely extract filename without extension even if it has multiple dots
    const fileBaseName = path.parse(file.originalname).name;
    const sanitizedName = fileBaseName.replace(/[^\w\-]+/g, '');
    
    // 2. Simply return the configuration object (No callback needed!)
    return {
      folder: 'uploads/item', 
      // Safe fallback logic for your public_id
      public_id: `${sanitizedName}`,
    };
  },
});

const receiptStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // 1. Safely extract filename without extension even if it has multiple dots
    const fileBaseName = path.parse(file.originalname).name;
    const sanitizedName = fileBaseName.replace(/[^\w\-]+/g, '');
    
    // 2. Simply return the configuration object (No callback needed!)
    return {
      folder: 'uploads/receipts',
      // Safe fallback logic for your public_id
      public_id: `${sanitizedName}`,
    };
  },
});
// const receiptStorage = new CloudinaryStorage({
// 	cloudinary: cloudinary,
// 	params: (req, file, cb) => {
// 		cb(null, {
// 			folder: `uploads/receipts/`,
// 			public_id: `${req.params.file || fileName + Date.now()}`,
// 		});
// 	},
// });
const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new Error(
				'Invalid file type. Only JPEG, PNG, and WebP are allowed!',
			),
			false,
		);
	}
};

export const itemUpload = multer({
	storage: itemStorage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 10, // 5MB limit
	},
});


export const receiptUpload = multer({
	storage: receiptStorage,
	// fileFilter: fileFilter,
	// limits: {
	// 	fileSize: 1024 * 1024 * 20, // 5MB limit
	// },
});

