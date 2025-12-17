import { Link } from 'react-router-dom';

export default function Home() {
  const reviews = [
    {
      id: 1,
      name: 'Event Committee - TechFest',
      university: 'UC Berkeley',
      text: 'This event planner made it so easy to assign tasks, track progress, and keep our entire fest on schedule.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Cultural Club Coordinator',
      university: 'IIT Delhi',
      text: 'We finally stopped losing tasks in spreadsheets—now every rehearsal, booking and reminder is in one place.',
      rating: 5,
    },
    {
      id: 3,
      name: 'Placement Cell Team',
      university: 'Seoul National University',
      text: 'From company invites to session logistics, the checklist view kept our placement drive stress free.',
      rating: 5,
    },
  ];

  const stats = [
    { label: 'Events Planned', value: '500+', icon: '📅' },
    { label: 'Tasks Tracked', value: '15,000+', icon: '✅' },
    { label: 'Student Organizers', value: '3,000+', icon: '👥' },
    { label: 'Campuses', value: '100+', icon: '🏫' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fadeInUp">
              Plan Events
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-yellow-200 to-pink-200">
                Without The Chaos
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fadeInUp animation-delay-200">
              Turn every college fest, workshop, or meetup into a success with clear task lists, deadlines, and progress tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-400">
              <Link
                to="/events"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                View My Events
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-linear-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-xl text-gray-600">Hear from our community members</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&quot;{review.text}&quot;</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.university}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Share Your Project?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students showcasing their innovative projects and connecting with peers worldwide.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}

