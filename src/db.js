import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDB = async() => {
    try {
        await mongoose.connect(`mongodb+srv://saccescuela:${process.env.MONGODB_KEY}@ahorraplus.ysj2j.mongodb.net/?retryWrites=true&w=majority&appName=AhorraPlus`)
        console.log('>>> DB is connected');
    } catch(error) {
        console.log(error);
    }
};
