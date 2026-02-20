import Router from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Test route
router.get("/authTest", (req, res) => {
  res.send("Auth route is working");
});

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);

// Protected route (Bearer token)
router.get('/verify', authenticate, authController.verify);

export default router;