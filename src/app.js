import express from 'express';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { errorHandler } from './middlewares/error.middlewares.js';
import userRouter from './routes/app/auth/user.routes.js'
import dotenv from 'dotenv';
// Load environment variables based on the environment
// export const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });


const app = express();

const httpServer = createServer(app);
app.use(
    cors({
        origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN2],
        credentials: true,
    })
); 


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());


app.get('/' , (req, res) => {
    res.send('Welcome')
})


app.use("/user", userRouter);


// common error handling middleware
app.use(errorHandler);

export { httpServer };