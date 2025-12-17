import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Subdocument schema for individual checklist tasks within an event
const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    // Optional single reminder datetime for this task
    reminderAt: { type: Date },
  },
  { timestamps: true }
);

const ProjectSchema = new Schema(
  {
    // Core event info
    title: { type: String, required: true }, // Event name
    description: { type: String, required: true },
    eventDate: { type: Date, required: true },
    location: { type: String, default: '' },

    // Optional categorisation / tags for the event
    category: [{ type: String }],

    // Event-level priority to quickly sort important events
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    // Checklist of tasks for planning the event
    tasks: [TaskSchema],

    // Cached overall progress (0–100) calculated from tasks
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Ownership
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    // Social fields kept for compatibility (can be used as favourites / views)
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    views: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Automatically keep progress in sync with task completion
ProjectSchema.pre('save', function (next) {
  if (!this.tasks || this.tasks.length === 0) {
    this.progress = 0;
    return next();
  }

  const total = this.tasks.length;
  const completed = this.tasks.filter(
    (task) => task.status === 'completed'
  ).length;

  this.progress = Math.round((completed / total) * 100);
  next();
});

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
