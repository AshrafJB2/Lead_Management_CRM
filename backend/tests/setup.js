import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST || process.env.MONGO_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
});