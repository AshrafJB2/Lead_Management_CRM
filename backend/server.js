import express from 'express';
import { AuthRouter } from "./routes/auth.routes.js";
import { EmpoloyerRouter } from './routes/employer.route.js';
import { ManagerRoutes } from './routes/manager.routes.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config({ path: './config/.env' });
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


app.use('/api/auth', AuthRouter);
app.use('/api/employer', EmpoloyerRouter)
app.use('/api/managers', ManagerRoutes);


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});
