import { Router } from 'express';
import authRoutes from './auth.routes.js';
// import profileRoutes from './profile.routes.js';
import projectRoutes from './projects.routes.js';

const router = Router();

router.use('/auth', authRoutes);
// router.use('/profile', profileRoutes);

// Event management (checklist) routes
// Mounted as /api/events/...
router.use('/events', projectRoutes);

export default router;
