import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config()

const URL = process.env.URL;

const log = (args) => {
    console.log(args);
}

const connection = async () => {
	try {
		await mongoose.connect(URL);
		log('successfully connected');
        
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

export default connection;
