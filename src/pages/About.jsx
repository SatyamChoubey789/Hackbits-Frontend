import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const About = () => {
  const { isAuthenticated } = useAuth();

  const organizers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Event Director",
      description:
        "Professor of Computer Science with 15+ years of experience in organizing tech events.",
      image: "👩‍💼",
    },
    {
      name: "Michael Chen",
      role: "Technical Lead",
      description:
        "Senior Software Engineer and hackathon enthusiast, passionate about innovation.",
      image: "👨‍💻",
    },
    {
      name: "Emily Rodriguez",
      role: "Community Manager",
      description:
        "Student Affairs Coordinator dedicated to fostering inclusive tech communities.",
      image: "👩‍🎓",
    },
    {
      name: "David Park",
      role: "Sponsor Relations",
      description:
        "Industry Relations Manager connecting students with leading tech companies.",
      image: "👨‍💼",
    },
  ];

  const sponsors = [
    {
      name: "TechCorp",
      tier: "Platinum",
      description: "Leading technology solutions provider",
    },
    {
      name: "InnovateLab",
      tier: "Gold",
      description: "Research and development company",
    },
    {
      name: "CodeAcademy",
      tier: "Silver",
      description: "Online learning platform",
    },
    {
      name: "StartupHub",
      tier: "Bronze",
      description: "Incubator for emerging startups",
    },
  ];

  const values = [
    {
      icon: "🚀",
      title: "Innovation",
      description:
        "We believe in pushing boundaries and creating solutions that make a real impact.",
    },
    {
      icon: "🤝",
      title: "Collaboration",
      description:
        "Great ideas come from diverse minds working together towards a common goal.",
    },
    {
      icon: "📚",
      title: "Learning",
      description:
        "Every participant leaves with new skills, knowledge, and experiences.",
    },
    {
      icon: "🌍",
      title: "Impact",
      description:
        "We focus on solutions that address real-world problems and create positive change.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              About Our Hackathon
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up">
              Empowering the next generation of innovators through technology,
              collaboration, and creative problem-solving.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We are dedicated to fostering innovation and creativity in the
              tech community. Our hackathon provides a platform for students,
              developers, and entrepreneurs to collaborate, learn, and build
              solutions that address real-world challenges. Through this event,
              we aim to bridge the gap between academic learning and practical
              application, creating opportunities for networking, mentorship,
              and career development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizers Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Organizers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our dedicated team of professionals and volunteers work tirelessly
              to make this hackathon an unforgettable experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {organizers.map((organizer, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-6xl mb-4">{organizer.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {organizer.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {organizer.role}
                </p>
                <p className="text-gray-600 text-sm">{organizer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Sponsors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're grateful to our sponsors who make this event possible and
              provide amazing opportunities for our participants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                {/* <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      sponsor.tier === "Platinum"
                        ? "bg-gray-100 text-gray-800"
                        : sponsor.tier === "Gold"
                        ? "bg-yellow-100 text-yellow-800"
                        : sponsor.tier === "Silver"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {sponsor.tier} Sponsor
                  </span>
                </div> */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {sponsor.name}
                </h3>
                <p className="text-gray-600 text-sm">{sponsor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Event Details
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our hackathon.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📅 When & Where
                </h3>
                <div className="space-y-3">
                  <p>
                    <strong>Date:</strong> 19th-20th novemeber 2025
                  </p>
                  <p>
                    <strong>Duration:</strong> 24 hours
                  </p>
                  <p>
                    <strong>Location:</strong> Lovely Professional University,Block 34
                  </p>
                  <p>
                    <strong>Format:</strong> In-person with virtual options
                  </p>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🏆 Prizes & Awards
                </h3>
                <div className="space-y-3">
                  <p>
                    <strong>1st Place:</strong> ₹5,000
                    
                  </p>
                  <p>
                    <strong>2nd Place:</strong> ₹3,000 
                  </p>
                  <p>
                    <strong>3rd Place:</strong> ₹2,000 
                  </p>
                  <p>
                    <strong>Special Awards:</strong> Best Design, Most
                    Innovative, Social Impact
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🎯 What to Expect
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Opening ceremony with keynote speakers</li>
                  <li>• Problem statement reveal and team formation</li>
                  <li>• 24-hour coding marathon with food and drinks</li>
                  <li>• Mentorship sessions with industry experts</li>
                  <li>• Final presentations and judging</li>
                  <li>• Awards ceremony and networking</li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📋 Rules & Guidelines
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Teams of 1-5 members allowed</li>
                  <li>• All code must be written during the event</li>
                  <li>• Open source libraries and APIs are welcome</li>
                  <li>• Respectful and inclusive environment</li>
                  <li>• Original work only - no plagiarism</li>
                  <li>• Follow all university policies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We're here to help! Reach out to our team for any
              inquiries or support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Us
              </h3>
              <p className="text-gray-600 mb-4">
                For general inquiries and support
              </p>
              <a
                href="mailto:hackathon@university.edu"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                hackathon@university.edu
              </a>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Call Us
              </h3>
              <p className="text-gray-600 mb-4">
                For urgent matters and registration help
              </p>
              <a
                href="tel:+1234567890"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                +1 (234) 567-890
              </a>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visit Us
              </h3>
              <p className="text-gray-600 mb-4">
                University Tech Center, Room 101
              </p>
              <p className="text-primary-600 font-medium">
                123 University Ave, City, State 12345
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Us?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Don't miss out on this incredible opportunity to learn, create, and
            connect with like-minded innovators.
          </p>
          {isAuthenticated ? (
            <Link
              to="/register"
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Register Your Team
            </Link>
          ) : (
            <Link
              to="/signup"
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              Sign Up Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;
