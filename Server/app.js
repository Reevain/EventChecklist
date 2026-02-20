import express from 'express';
import cors from 'cors';
import ApiError from './utils/ErrorHandeler.js';   
import router from './routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-name.vercel.app'
  ],
  credentials: true
  })
);
app.use(cookieParser());
// Routes
app.use('/api', router);

// Test route
app.get('/', (req, res) => {
  res.send('Hello World! from Express.js');
});


// Global Error Handler (must be last)
app.use((err, req, res, next) => {
  console.error(err);

  // Handle known ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Unknown error fallback
  return res.status(500).json({
    status: "error",
    message: err.message || 'Internal Server Error',
  });
});

export default app;
