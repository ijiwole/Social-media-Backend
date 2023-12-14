import mongoose from "mongoose";

export const connectDB = async() => {
    console.log(process.env.CONNECTION_STRING)
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log(
            'Database Connected', 
            connect.connection.host,
            connect.connection.name
         );
    } catch (err) {
        console.log(err);
        process.exit(1)
    }
}
