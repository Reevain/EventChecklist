import Router from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticateCookie } from '../middlewares/cookieAuth.middleware.js';
const router = Router();

router.get("/authTest", (req, res) => {
  res.send("Auth route is working");
});
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/verify', authenticateCookie, authController.verify);




export default router;