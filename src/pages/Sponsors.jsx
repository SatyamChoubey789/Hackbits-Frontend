

const Sponsors = () => {
  const sponsor = {
    name: "Quick Heal",
    logo: "/images/quickheal.png",
    description:
      "Quick Heal is India’s leading cybersecurity company, protecting millions of users with advanced security solutions and cutting-edge threat intelligence.",
    tier: "Title Sponsor",
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20 px-4 sm:px-6 lg:px-8">

      {/* Powered By Badge */}
      <div className="w-full flex justify-center mb-10">
        <div className="powered-badge bg-white border border-orange-400 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold shadow-md">
          🔥 Powered by Quick Heal
        </div>
      </div>

      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16 quickheal-fade">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Our Official Sponsor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We proudly present <strong>Quick Heal</strong> as the official sponsor
            of our hackathon empowering innovation and the future of cybersecurity talent.
          </p>
        </div>

        {/* Sponsor Card */}
        <div className="max-w-xl mx-auto quickheal-fade">
          <div className="card text-center glow-border glow-hover transition-all duration-300">

            {/* Logo */}
            <div className="mb-6">
              <img
                src={sponsor.logo}
                alt="Quick Heal Logo"
                className="w-40 h-auto mx-auto mb-4 quickheal-fade drop-shadow-xl"
              />

              <h3 className="text-3xl font-semibold text-gray-900 mb-2">
                {sponsor.name}
              </h3>

              <span className="inline-block px-4 py-1 mt-2 rounded-full text-sm font-medium bg-orange-100 text-orange-700 border border-orange-300">
                {sponsor.tier}
              </span>

              <p className="text-gray-600 text-base mt-4 px-4 leading-relaxed">
                {sponsor.description}
              </p>
            </div>
          </div>
        </div>

        {/* Why Quick Heal Section */}
        <div className="mt-20 quickheal-fade">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
            Why Quick Heal Supports This Hackathon
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="card text-center glow-hover">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Cybersecurity Awareness
              </h3>
              <p className="text-gray-600">
                Quick Heal nurtures young minds in cybersecurity and promotes safe digital habits.
              </p>
            </div>

            <div className="card text-center glow-hover">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Encouraging Innovation
              </h3>
              <p className="text-gray-600">
                Strong supporter of solving real-world problems through tech-driven creativity.
              </p>
            </div>

            <div className="card text-center glow-hover">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Building Future Talent
              </h3>
              <p className="text-gray-600">
                Enabling hands-on learning, mentorship, and exposure for future innovators.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-20 card text-center quickheal-fade glow-hover">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Want to Collaborate With Us?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Be part of our mission to strengthen the tech community. Reach out if
            you'd like to collaborate for future events or sponsorships.
          </p>

          <a
            href="mailto:hackbitsofficialteam@gmail.com"
            className="btn-primary px-6 py-3 rounded-lg text-white font-medium"
          >
            Contact Organizers
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
