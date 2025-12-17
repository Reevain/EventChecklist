import User from '../models/User.models.js';
import ApiError from '../utils/ErrorHandeler.js';
import ApiResponse from '../utils/ResponseHandeler.js';
import asyncHandler from '../utils/asynkHandeler.js';
import Project from '../models/Project.models.js';

// Helper to recalculate progress based on completed tasks
const recalculateProgress = (project) => {
  if (!project.tasks || project.tasks.length === 0) {
    project.progress = 0;
    return;
  }

  const total = project.tasks.length;
  const completed = project.tasks.filter(
    (task) => task.status === 'completed'
  ).length;

  project.progress = Math.round((completed / total) * 100);
};

class ProjectsController {
  // Create a new project
  createProject = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const {
      title,
      description,
      eventDate,
      location,
      category,
      priority,
      tasks,
    } = req.body;
    if (!title || !description || !eventDate) {
      return next(
        new ApiError(400, 'Title, description, and event date are required')
      );
    }
    const newProject = new Project({
      title,
      description,
      eventDate,
      location,
      category,
      priority,
      tasks,
      createdBy: userId,
    });

    await newProject.save();
    res
      .status(201)
      .json(new ApiResponse(201, 'Project created successfully', newProject));
  });

  // Get all projects
  getAllProjects = asyncHandler(async (req, res, next) => {
   const {search="",tags="",page=1,limit=10}=req.query;

    const pages = parseInt(req.query.page) || 1;
    const limits = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter ={};

    /// seacrh filter by discription or title
    if(search){
      filter.$or=[
        {title:{$regex:search,$options:"i"}},
        {description:{$regex:search,$options:"i"}}
      ]
    }

    if(tags){
      const tagsArray=tags.split(',').map(tag=>tag.trim());
      filter.category={$in:tagsArray};
    }

    const projects = await Project.find(filter)
      .skip(skip)
      .limit(limits)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(filter);

    res.json(
      new ApiResponse(200, 'Projects retrieved successfully', {
        projects,
        total,
        page: pages,
        pages: Math.ceil(total / limits),
      })
    );

  });

  // Update a project by ID
  updateProject = asyncHandler(async (req, res, next) => {
    const updates = req.body;
    const { id } = req.params;

    if (Object.keys(updates).length === 0) {
      return next(new ApiError(400, 'No updates provided'));
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedProject) {
      return next(new ApiError(404, 'Project not found'));
    }
    // Ensure progress stays in sync if tasks or statuses changed
    recalculateProgress(updatedProject);
    await updatedProject.save();

    res.json(
      new ApiResponse(200, 'Project updated successfully', updatedProject)
    );
  });

  // Delete the project by ID
  deleteProject = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }
    res.json(new ApiResponse(200, 'Project deleted successfully', project));
  });

  // get project by user id
  getProjectsByUserId = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const projects = await Project.find({ $or: [{ 'contributors.userId': userId }, { createdBy: userId }] }).sort({ createdAt: -1 });
    res.json(
      new ApiResponse(200, 'Projects retrieved successfully', projects)
    );
  });


  // Get view  project by ID
  getProjectById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }
    res.json(new ApiResponse(200, 'Project retrieved successfully', project));
  });

  // Likes management of project 
  toggleLikeProject = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }

    const alreadyLiked = project.likes.includes(userId);

    if (alreadyLiked) {
      project.likes.pull(userId);
      project.likesCount = Math.max(0, project.likesCount - 1);
    } else {
      project.likes.push(userId);
      project.likesCount += 1;
    }
    await project.save();

    res.json(
      new ApiResponse(200, 'Project like status toggled successfully', {
        likesCount: project.likesCount,
        liked: !alreadyLiked,
      })
    );
  });

  //unique views management of project
  addUniqueView = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    const userId = req.user.id;
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ApiError(404, 'Project not found'));
    }
    const alreadyViewed = project.views.includes(userId);

    if (!alreadyViewed) {
      project.views.push(userId);
      project.viewsCount += 1;
      await project.save();
    }
    res.json(
      new ApiResponse(200, 'Project view count updated successfully', {
        viewsCount: project.viewsCount,
        viewed: !alreadyViewed,
      })
    );
  });


  // Add a new checklist task to an event
  addTask = asyncHandler(async (req, res, next) => {
    const { id } = req.params; // event (project) id
    const { title, description, dueDate, priority, reminderAt } = req.body;

    if (!title) {
      return next(new ApiError(400, 'Task title is required'));
    }

    const project = await Project.findById(id);
    if (!project) {
      return next(new ApiError(404, 'Event not found'));
    }

    // Only the owner can modify the checklist
    if (project.createdBy.toString() !== req.user.id.toString()) {
      return next(new ApiError(403, 'Not authorized to modify this event'));
    }

    project.tasks.push({
      title,
      description,
      dueDate,
      priority,
      reminderAt,
    });

    recalculateProgress(project);
    await project.save();

    res
      .status(201)
      .json(
        new ApiResponse(201, 'Task added successfully', project)
      );
  });

  // Update an existing checklist task
  updateTask = asyncHandler(async (req, res, next) => {
    const { id, taskId } = req.params;
    const updates = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return next(new ApiError(404, 'Event not found'));
    }

    if (project.createdBy.toString() !== req.user.id.toString()) {
      return next(new ApiError(403, 'Not authorized to modify this event'));
    }

    const task = project.tasks.id(taskId);
    if (!task) {
      return next(new ApiError(404, 'Task not found'));
    }

    Object.assign(task, updates);

    recalculateProgress(project);
    await project.save();

    res.json(
      new ApiResponse(200, 'Task updated successfully', project)
    );
  });

  // Remove a checklist task from an event
  deleteTask = asyncHandler(async (req, res, next) => {
    const { id, taskId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return next(new ApiError(404, 'Event not found'));
    }

    if (project.createdBy.toString() !== req.user.id.toString()) {
      return next(new ApiError(403, 'Not authorized to modify this event'));
    }

    const task = project.tasks.id(taskId);
    if (!task) {
      return next(new ApiError(404, 'Task not found'));
    }

    task.deleteOne();

    recalculateProgress(project);
    await project.save();

    res.json(
      new ApiResponse(200, 'Task deleted successfully', project)
    );
  });
}

export default new ProjectsController();
