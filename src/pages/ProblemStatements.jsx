import React, { useState, useEffect } from "react";
import api from "../api/axios";

const ProblemStatements = () => {
  const [problemStatements, setProblemStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchProblemStatements();
  }, []);

  const fetchProblemStatements = async () => {
    try {
      const response = await api.get("/teams/problem-statements");
      setProblemStatements(response.data.problemStatements);
    } catch (error) {
      console.error("Error fetching problem statements:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = {
    "AI & Machine Learning": [
      "AI-Powered Learning Management System",
      "Mental Health Support Chatbot",
      
    ],
    "Blockchain & Web3": ["Blockchain-based Certificate Verification"],
    "IoT & Hardware": [
      "IoT-based Smart Agriculture Solution",
      "Smart Campus Navigation App",
    ],
    "AR/VR & Gaming": ["AR/VR Educational Content Platform"],
    "Healthcare & Social Impact": [
      "Digital Healthcare Management System",
      "Social Impact Measurement Tool",
    ],
    "Sustainability & Environment": ["Sustainable Energy Monitoring Platform"],
    Cybersecurity: ["Cybersecurity Threat Detection System"],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Problem Statements
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from a diverse range of problem statements that challenge you
            to create innovative solutions using cutting-edge technologies.
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(categories).map(([category, problems]) => (
            <div key={category} className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-2 h-8 bg-primary-600 rounded-full mr-3"></span>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problems.map((problem, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {problem}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Develop a comprehensive solution that addresses real-world
                      challenges in this domain. Consider scalability, user
                      experience, and technical innovation.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 card text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Choose Your Challenge?
          </h2>
          <p className="text-gray-600 mb-6">
            Register your team and select the problem statement that excites you
            most.
          </p>
          <a href="/register" className="btn-primary text-lg px-8 py-3">
            Register Your Team
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProblemStatements;
