import Router from 'express';
import ProjectsController from '../controllers/projects.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Base path mounted as /api/events

// Create a new event
router.post('/', authenticate, ProjectsController.createProject);

// Get all events
router.get('/', authenticate, ProjectsController.getAllProjects);

// Update an event
router.put('/:id', authenticate, ProjectsController.updateProject);

// Delete an event
router.delete('/:id', authenticate, ProjectsController.deleteProject);

// Get events for a specific user
router.get('/user/:userId', authenticate, ProjectsController.getProjectsByUserId);

// Get single event by id
router.get('/:id', authenticate, ProjectsController.getProjectById);

// Like / Unlike
router.post('/:projectId/like', authenticate, ProjectsController.toggleLikeProject);

// Add unique view
router.post('/:projectId/view', authenticate, ProjectsController.addUniqueView);

// Task operations
router.post('/:id/tasks', authenticate, ProjectsController.addTask);
router.put('/:id/tasks/:taskId', authenticate, ProjectsController.updateTask);
router.delete('/:id/tasks/:taskId', authenticate, ProjectsController.deleteTask);

export default router;