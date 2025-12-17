import app from './app.js';
import connectDB from './config/Db.config.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

const initializeServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error.message);
    process.exit(1);
  }
};

initializeServer();
