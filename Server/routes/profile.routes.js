import Router from 'express';
import profileController from '../controllers/profile.controller.js';
import { authenticateCookie } from '../middlewares/cookieAuth.middleware.js';
// import upload from '../middlewares/multer.middleware.js';
const router = Router();

router.post('/createOrUpdateProfile', authenticateCookie, profileController.createOrUpdateProfile);
router.post('/uploadAvatar', authenticateCookie, upload.single('avatar'), profileController.uploadAvatar);
router.get('/test', authenticateCookie, profileController.test);

export default router;