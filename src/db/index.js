import mongoose from 'mongoose';

export let dbInstance = undefined;

const connectDB = async () => {
    console.log(process.env.MONGODB_URI);
    try {
        const connectionInstance = await mongoose.connect( 'mongodb+srv://ryalamanna:n9X8QqojvsgBGCWu@cluster0.ycs2cg0.mongodb.net/neighbourly' );
        dbInstance = connectionInstance;
        console.log(
            `MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
        );
        return 'yes';
    } catch (error) {
        console.log('MongoDB connection error: ', error);
        process.exit(1);
    }
};

export default connectDB;
