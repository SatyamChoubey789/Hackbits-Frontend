import React from "react";

const Sponsors = () => {
  const sponsors = [
    {
      name: "TechCorp",
      tier: "Platinum",
      logo: "🏢",
      description: "Leading technology solutions provider empowering innovation worldwide.",
      benefits: ["$10,000 Prize Pool", "Internship Opportunities", "Mentorship Program"],
    },
    {
      name: "InnovateLab",
      tier: "Gold",
      logo: "🔬",
      description: "Research and development company focused on cutting-edge technologies.",
      benefits: ["$5,000 Prize Pool", "Research Collaboration", "Tech Swag"],
    },
    {
      name: "CodeAcademy",
      tier: "Silver",
      logo: "💻",
      description: "Online learning platform making coding education accessible to everyone.",
      benefits: ["Premium Courses", "Certification Programs", "Learning Resources"],
    },
    {
      name: "StartupHub",
      tier: "Bronze",
      logo: "🚀",
      description: "Incubator for emerging startups and entrepreneurial ventures.",
      benefits: ["Incubation Program", "Networking Events", "Startup Resources"],
    },
    {
      name: "CloudTech",
      tier: "Bronze",
      logo: "☁️",
      description: "Cloud infrastructure provider supporting scalable applications.",
      benefits: ["Cloud Credits", "Technical Support", "Infrastructure Resources"],
    },
    {
      name: "DataViz",
      tier: "Bronze",
      logo: "📊",
      description: "Data visualization and analytics platform for modern businesses.",
      benefits: ["Analytics Tools", "Data Resources", "Visualization Software"],
    },
  ];

  const getTierColor = (tier) => {
    switch (tier) {
      case "Platinum":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "Gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Silver":
        return "bg-gray-100 text-gray-600 border-gray-300";
      case "Bronze":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Our Sponsors
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're grateful to our amazing sponsors who make this hackathon possible
            and provide incredible opportunities for our participants.
          </p>
        </div>

        {/* Sponsor Tiers */}
        {/* <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Sponsor Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["Platinum", "Gold", "Silver", "Bronze"].map((tier) => (
              <div
                key={tier}
                className={`card text-center border-2 ${getTierColor(tier)}`}
              >
                <h3 className="text-lg font-semibold mb-2">{tier} Sponsor</h3>
                <p className="text-sm">
                  {tier === "Platinum" && "Premier partnership with maximum visibility"}
                  {tier === "Gold" && "Major partnership with significant benefits"}
                  {tier === "Silver" && "Supporting partnership with great exposure"}
                  {tier === "Bronze" && "Community partnership with valuable perks"}
                </p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor, index) => (
            <div
              key={index}
              className="card hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{sponsor.logo}</div>
                {/* <div className="mb-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getTierColor(
                      sponsor.tier
                    )}`}
                  >
                    {sponsor.tier} Sponsor
                  </span>
                </div> */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {sponsor.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {sponsor.description}
                </p>
              </div>

              {/* <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Benefits for Participants:
                </h4>
                <ul className="space-y-2">
                  {sponsor.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className="text-sm text-gray-600 flex items-center"
                    >
                      <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
          ))}
        </div>

        {/* Become a Sponsor Section */}
        <div className="mt-16 card text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Interested in Sponsoring?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our community of forward-thinking companies and help us create
            an amazing experience for the next generation of innovators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:sponsors@hackathon.edu"
              className="btn-primary"
            >
              Contact Us
            </a>
            <a
              href="/about"
              className="btn-secondary"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Sponsor Benefits */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Sponsor Our Hackathon?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Talent Acquisition
              </h3>
              <p className="text-gray-600">
                Connect with top-tier students and emerging talent in technology
                and innovation.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Brand Visibility
              </h3>
              <p className="text-gray-600">
                Increase your brand awareness among the tech community and
                potential future employees.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Community Impact
              </h3>
              <p className="text-gray-600">
                Support education and innovation while building meaningful
                relationships with the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
