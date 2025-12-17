import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsAPI } from '../services/api';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const fetchEvent = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await eventsAPI.getEventById(id);
      const payload = res.data || res;
      setEvent(payload.project || payload.event || payload);
    } catch (err) {
      setError(err.message || 'Failed to load event');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleTaskStatus = async (task) => {
    if (!event) return;
    const nextStatus =
      task.status === 'pending'
        ? 'in_progress'
        : task.status === 'in_progress'
        ? 'completed'
        : 'pending';

    setUpdatingTaskId(task._id);
    try {
      await eventsAPI.updateTask(event._id, task._id, { status: nextStatus });
      await fetchEvent();
    } catch (err) {
      setError(err.message || 'Failed to update task');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!event) return;
    setUpdatingTaskId(taskId);
    try {
      await eventsAPI.deleteTask(event._id, taskId);
      await fetchEvent();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event) return;
    if (!window.confirm('Delete this event and all its tasks?')) return;
    try {
      await eventsAPI.deleteEvent(event._id);
      navigate('/events');
    } catch (err) {
      setError(err.message || 'Failed to delete event');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Event not found.</p>
      </div>
    );
  }

  const completedTasks =
    event.tasks?.filter((t) => t.status === 'completed').length || 0;
  const totalTasks = event.tasks?.length || 0;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/events')}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to events
          </button>
          <button
            onClick={handleDeleteEvent}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete Event
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <p className="text-gray-600 mb-2">{event.description}</p>
              <p className="text-sm text-gray-500">
                Event date:{' '}
                {event.eventDate
                  ? new Date(event.eventDate).toLocaleString()
                  : 'Not set'}
              </p>
              <p className="text-sm text-gray-500">
                Location: {event.location || 'Not specified'}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                  event.priority === 'high'
                    ? 'bg-red-50 text-red-600'
                    : event.priority === 'low'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-yellow-50 text-yellow-600'
                }`}
              >
                {event.priority || 'medium'} priority
              </span>
              {totalTasks > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">
                    Progress: {progress}% ({completedTasks}/
                    {totalTasks} tasks)
                  </p>
                  <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-600"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-between mb  -4">
            <h2 className="text-xl font-semibold text-gray-900">Checklist</h2>
          </div>

          {totalTasks === 0 ? (
            <p className="text-gray-500 mt-4">
              No tasks yet. You can add tasks for this event from the Create
              Event page.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {event.tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleTaskStatus(task)}
                        disabled={updatingTaskId === task._id}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          task.status === 'completed'
                            ? 'bg-green-500 border-green-500 text-white'
                            : task.status === 'in_progress'
                            ? 'bg-yellow-400 border-yellow-400 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {task.status === 'completed' && (
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                      <p
                        className={`font-medium text-sm ${
                          task.status === 'completed'
                            ? 'line-through text-gray-400'
                            : 'text-gray-800'
                        }`}
                      >
                        {task.title}
                      </p>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 space-x-2">
                      {task.dueDate && (
                        <span>
                          Due:{' '}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span>• Priority: {task.priority}</span>
                      <span>• Status: {task.status}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task._id)}
                    disabled={updatingTaskId === task._id}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


