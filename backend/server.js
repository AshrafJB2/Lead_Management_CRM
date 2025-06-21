import express from 'express';
import {managersRouter} from "./routes/managers.routes.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './config/.env' });
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/managers', managersRouter)


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});
