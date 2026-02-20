import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ApiError from './utils/ErrorHandeler.js';
import router from './routes/index.js';

const app = express();

// ================= CORS CONFIG =================
const allowedOrigins = [
  'http://localhost:5173',
  'https://eventchecklist-seven.vercel.app' // ❗ NO trailing slash
];

import cors from 'cors';

app.use(cors({
  origin: function (origin, callback) {

    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (
      origin.includes('localhost') ||
      origin.includes('vercel.app')
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= ROUTES =================
app.use('/api', router);

// Test route
app.get('/', (req, res) => {
  res.send('Hello World! from Express.js');
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: err.message || 'Internal Server Error',
  });
});

export default app;