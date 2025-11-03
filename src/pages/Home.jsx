import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: "👥",
      title: "Team Registration",
      description:
        "Register as solo participants or form teams of up to 4 members.",
    },
    {
      icon: "🎯",
      title: "Problem Statements",
      description:
        "Choose from diverse problem statements covering AI, IoT, Blockchain, and more.",
    },
    {
      icon: "🏆",
      title: "Competition",
      description:
        "Compete with teams from across the university and showcase your innovative solutions.",
    },
    {
      icon: "🤝",
      title: "Networking",
      description:
        "Connect with industry experts, mentors, and fellow participants.",
    },
  ];

  const stats = [
    { number: "500+", label: "Participants" },
    { number: "100+", label: "Teams" },
    { number: "24", label: "Hours" },
    { number: "10+", label: "Problem Statements" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Code. Create. Compete.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
              Join the ultimate hackathon experience where innovation meets
              technology. Build amazing solutions, learn from experts, and
              compete for exciting prizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              {isAuthenticated ? (
                <Link
                  to="/register"
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
                >
                  Register Your Team
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/about"
                    className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Participate?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the thrill of innovation and take your coding skills to
              the next level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Event Schedule
            </h2>
            <p className="text-xl text-gray-600">
              Mark your calendars for this exciting 24-hour coding marathon.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-center space-x-4 p-6 bg-primary-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Registration Opens
                  </h3>
                  <p className="text-gray-600">
                    Early bird registration starts with exciting perks
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-6 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Opening Ceremony
                  </h3>
                  <p className="text-gray-600">
                    Welcome address, problem statement reveal, and team
                    formation
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-6 bg-yellow-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    24-Hour Coding Marathon
                  </h3>
                  <p className="text-gray-600">
                    Build, innovate, and create amazing solutions
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-6 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Judging & Awards
                  </h3>
                  <p className="text-gray-600">
                    Present your solutions and win exciting prizes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join hundreds of developers, designers, and innovators in creating
            solutions that matter.
          </p>
          {isAuthenticated ? (
            <Link
              to="/register"
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Register Your Team Now
            </Link>
          ) : (
            <Link
              to="/signup"
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Join the Hackathon
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
