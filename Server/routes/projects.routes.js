import Router from 'express';
import ProjectsController from '../controllers/projects.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticate, ProjectsController.createProject);
router.get('/', authenticate, ProjectsController.getAllProjects);
router.put('/:id', authenticate, ProjectsController.updateProject);
router.delete('/:id', authenticate, ProjectsController.deleteProject);
router.get('/user/:userId', authenticate, ProjectsController.getProjectsByUserId);
router.get('/:id', authenticate, ProjectsController.getProjectById);
router.post('/:projectId/like', authenticate, ProjectsController.toggleLikeProject);
router.post('/:projectId/view', authenticate, ProjectsController.addUniqueView);
router.post('/:id/tasks', authenticate, ProjectsController.addTask);
router.put('/:id/tasks/:taskId', authenticate, ProjectsController.updateTask);
router.delete('/:id/tasks/:taskId', authenticate, ProjectsController.deleteTask);

export default router;