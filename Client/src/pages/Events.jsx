import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await eventsAPI.getEvents({ search });
      const payload = res.data || res;
      setEvents(payload.projects || payload.events || []);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredEvents = events.filter((event) => {
    const term = search.toLowerCase();
    return (
      event.title.toLowerCase().includes(term) ||
      (event.description || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
            <p className="text-gray-600">
              Organize your events with task checklists, priorities, and deadlines.
            </p>
          </div>
          <Link
            to="/events/new"
            className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            + Create Event
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h2>
            <p className="text-gray-500 mb-6">
              Start by creating your first event and add tasks to its checklist.
            </p>
            <Link
              to="/events/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {event.title}
                    </h2>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        event.priority === 'high'
                          ? 'bg-red-50 text-red-600'
                          : event.priority === 'low'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      {event.priority || 'medium'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Event date:{' '}
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString()
                      : 'Not set'}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Location: {event.location || 'Not specified'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>
                    Tasks: {event.tasks?.length || 0}{' '}
                    {event.tasks && event.tasks.length > 0
                      ? `• ${event.progress || 0}% complete`
                      : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


