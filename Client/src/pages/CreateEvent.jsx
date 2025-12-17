import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tasks, setTasks] = useState([
    { title: '', dueDate: '', priority: 'medium' },
  ]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTaskChange = (index, field, value) => {
    setTasks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addTaskRow = () => {
    setTasks((prev) => [...prev, { title: '', dueDate: '', priority: 'medium' }]);
  };

  const removeTaskRow = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !eventDate) {
      setError('Title, description and event date are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanTasks = tasks
        .filter((t) => t.title.trim() !== '')
        .map((t) => ({
          title: t.title,
          dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : undefined,
          priority: t.priority,
        }));

      await eventsAPI.createEvent({
        title,
        description,
        eventDate: new Date(eventDate).toISOString(),
        location,
        priority,
        tasks: cleanTasks,
      });

      navigate('/events');
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Event</h1>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., College Fest 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Describe the event and its goals..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Main Auditorium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Checklist Tasks</h2>
                <button
                  type="button"
                  onClick={addTaskRow}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Task
                </button>
              </div>

              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-gray-50 rounded-lg p-4"
                  >
                    <div className="md:col-span-5">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Task Title
                      </label>
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) =>
                          handleTaskChange(index, 'title', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="e.g., Book venue"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={task.dueDate}
                        onChange={(e) =>
                          handleTaskChange(index, 'dueDate', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={task.priority}
                        onChange={(e) =>
                          handleTaskChange(index, 'priority', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      {tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTaskRow(index)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


