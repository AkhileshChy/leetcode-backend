import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.route.js';
// import problemRoutes from './routes/problems.route.js';
// import codeExecuteRoutes from './routes/codeExecute.route.js'; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Define a basic rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                 // Limit each IP to 100 requests per windowMs
    standardHeaders: true,   // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,    // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
});

// ✅ Apply to all routes (can also apply per route instead)
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use("/auth", authRoutes);
// app.use("/problems", problemRoutes);
// app.use("/code-execute", codeExecuteRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
