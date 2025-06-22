import express from 'express';
import {managersRouter} from "./routes/managers.routes.js";
import { AuthRouter } from "./routes/auth.routes.js";
import { requireRole } from './middlewares/role.middleware.js';
import { EmpoloyerRouter } from './routes/employer.route.js';
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
app.use('/api/auth', AuthRouter);
app.use('/employer', requireRole('employer'), EmpoloyerRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});
