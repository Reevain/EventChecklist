import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  // Display actual authenticated user data from AuthContext
  const displayName = user?.name || 'User';
  const displayEmail = user?.email || 'user@example.com';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {displayName.charAt(0)}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>
              <p className="text-gray-500 mb-4">{displayEmail}</p>
              <p className="text-gray-700 mb-4 max-w-2xl">
                Manage your profile and access your event planning checklists.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              <Link
                to="/events/new"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center"
              >
                Create Event
              </Link>
            </div>
          </div>
        </div>

        {/* Simple call-to-action for events */}
        <div className="bg-white rounded-xl shadow-md p-8 mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Planning</h2>
          <p className="text-gray-600 mb-4">
            Use the event planner to create checklists, assign deadlines, and track progress for all your events.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            View My Events
          </Link>
        </div>
      </div>
    </div>
  );
}

