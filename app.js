import express from 'express';
import userRouter from './routes/user-routes.js'
import blogRouter from './routes/blog-routes.js';
import { connectDB } from './config/dbConnection.js';
import { config } from 'dotenv'
config();


connectDB()
const app = express()

const port = process.env.PORT || 5000
app.use(express.json())
app.use("/api/user", userRouter)
app.use("/api/blog", blogRouter)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
