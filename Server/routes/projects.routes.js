import Router from 'express';
import ProjectsController from '../controllers/projects.controller.js';
import { authenticateCookie } from '../middlewares/cookieAuth.middleware.js';

const router = Router();

// Base path for these routes will be mounted as /api/events

// Create a new event with an optional checklist
router.post('/', authenticateCookie, ProjectsController.createProject);

// Get all events (optionally filterable via query params: search, tags, page, limit)
router.get('/', authenticateCookie, ProjectsController.getAllProjects);

// Update an existing event
router.put('/:id', authenticateCookie, ProjectsController.updateProject);

// Delete an event
router.delete('/:id', authenticateCookie, ProjectsController.deleteProject);

// Get events for a specific user (created or contributed)
router.get('/user/:userId', authenticateCookie, ProjectsController.getProjectsByUserId);

// Get a single event by id
router.get('/:id', authenticateCookie, ProjectsController.getProjectById);

// Like / unlike an event
router.post('/:projectId/like', authenticateCookie, ProjectsController.toggleLikeProject);

// Add a unique view to an event
router.post('/:projectId/view', authenticateCookie, ProjectsController.addUniqueView);

// Checklist task operations
router.post('/:id/tasks', authenticateCookie, ProjectsController.addTask);
router.put('/:id/tasks/:taskId', authenticateCookie, ProjectsController.updateTask);
router.delete('/:id/tasks/:taskId', authenticateCookie, ProjectsController.deleteTask);

export default router;