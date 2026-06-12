import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connection from './config/db.js';
import orderRoutes from './routes/routes.js'
import cookieParser from 'cookie-parser';


const app = express();
connection()

dotenv.config() 
const PORT = process.env.PORT;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api', orderRoutes)
// Add or update your global error handler
app.use((err, req, res, next) => {
  console.error(err); // This prints it to your terminal
  
  // This sends the actual error message back to the frontend as JSON
  res.status(500).json({ 
    error: err.message || 'Something went wrong on the server',
    stack: err.stack 
  });
});
app.listen(PORT, () => {
    console.log(`app listening on port: ${PORT}`)
})