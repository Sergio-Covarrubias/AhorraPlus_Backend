import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import costsRoutes from './routes/costs.routes.js';
import chatbotRoutes from './routes/ai.routes.js';

const app = express();

app.use(cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', costsRoutes);
app.use('/api', chatbotRoutes);

export default app;
